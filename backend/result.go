package main

import (
	"encoding/json"
	"math"
	"net/http"
	"quiz/model"
	"strconv"
)

func ResultHandler(w http.ResponseWriter, r *http.Request) {
	corsHandler(w, r)
	if r.Method == http.MethodOptions {
		return
	}
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	r.ParseForm()
	sessionID := r.Form.Get("session_id")
	w.Header().Set("Content-Type", "application/json")

	if sessionID == "" {
		http.Error(w, `{"message": "Session ID missing"}`, http.StatusBadRequest)
		return
	}

	mutex.Lock()
	defer mutex.Unlock()

	session, exists := sessions[sessionID]
	if !exists {
		http.Error(w, "Invalid sessionId", http.StatusBadRequest)
		return
	}

	var (
		totalQuestions = len(session.Questions)
		totalCorrect   int
		totalIncorrect int
		incorrectAns   []string
	)
	resp := model.Result{
		SessionID:          sessionID,
		TotalQuestions:     totalQuestions,
		CompletedQuestions: session.CurrentIdx,
		Completed:          session.Completed,
		TotalTimeTaken:     session.TotalTimeTaken,
	}
	if !session.Completed {
		json.NewEncoder(w).Encode(resp)
		return
	}

	for _, q := range session.Questions {
		qID, _ := strconv.Atoi(q.ID)
		if qID == 0 {
			http.Error(w, "Incorrect question id, can't be 0.", http.StatusBadRequest)
		}
		if ans, ok := session.Answers[q.ID]; ok {
			if ans == questions[qID-1].Correct {
				totalCorrect++
			} else {
				totalIncorrect++
				incorrectAns = append(incorrectAns, q.Number)
			}
		}
	}
	score := float64(totalCorrect) / float64(totalQuestions) * 100
	resp.Score = toPointer(math.Round(score))
	resp.IncorrectAnswers = incorrectAns
	resp.CorrectAnswerCount = totalCorrect
	resp.Feedback = toPointer("You need at least 80% to pass the quiz.")

	if score > model.PassPercent {
		resp.Pass = toPointer(true)
		resp.Feedback = toPointer("Congratulations!! You have passed.")
	}

	json.NewEncoder(w).Encode(resp)
}

func toPointer[T any](inp T) *T {
	return &inp
}
