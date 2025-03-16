package main

import (
	"encoding/json"
	"log"
	"net/http"
	"quiz/model"
	"strconv"
)

func Next(w http.ResponseWriter, r *http.Request) {
	corsHandler(w, r)
	if r.Method == http.MethodOptions {
		return
	}
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var answer model.Answer

	if err := json.NewDecoder(r.Body).Decode(&answer); err != nil {
		http.Error(w, "Error decoding request body", http.StatusBadRequest)
		return
	}

	if answer.SessionID == "" {
		http.Error(w, `{"message": "Session ID missing"}`, http.StatusBadRequest)
		return
	}

	if answer.Answer == "" {
		http.Error(w, `{"message": "Answer is missing"}`, http.StatusBadRequest)
		return
	}

	if answer.QuestionID == "" {
		http.Error(w, `{"message": "Question id is missing"}`, http.StatusBadRequest)
		return
	}

	mutex.Lock()
	defer mutex.Unlock()

	session, exists := sessions[answer.SessionID]
	if !exists {
		http.Error(w, "Invalid sessionId", http.StatusBadRequest)
		return
	}

	if session.Completed {
		http.Error(w, "Session already completed", http.StatusBadRequest)
		return
	}

	currentQuestion := session.Questions[session.CurrentIdx]
	session.Answers[currentQuestion.ID] = answer.Answer
	session.TotalTimeTaken = answer.TotalTimeTaken

	qID, _ := strconv.Atoi(currentQuestion.ID)
	if qID == 0 {
		http.Error(w, "Incorrect question id, can't be 0.", http.StatusBadRequest)
	}

	var lastAnswer bool
	if questions[qID-1].Correct == answer.Answer {
		lastAnswer = true
	}

	log.Printf("Current ID: %v answer: %s got answer: %s", qID, questions[qID-1].Correct, answer.Answer)

	session.CurrentIdx++
	resp := model.Response{
		LastRight:       lastAnswer,
		LastAnswer:      questions[qID-1].Correct,
		TotalQuestions:  len(session.Questions),
		CurrentQuestion: session.CurrentIdx,
		TotalTimeTaken:  session.TotalTimeTaken,
	}
	if session.CurrentIdx >= len(session.Questions) {
		session.Completed = true
		resp.Completed = true
	} else {
		resp.Question = &session.Questions[session.CurrentIdx]
		resp.Completed = false
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}
