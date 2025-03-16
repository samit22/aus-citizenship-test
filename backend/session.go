package main

import (
	"encoding/json"
	"fmt"
	"log"
	"math/rand/v2"
	"net/http"
	"quiz/model"
	"strconv"
)

func StartSession(w http.ResponseWriter, r *http.Request) {
	corsHandler(w, r)
	r.ParseForm()
	sessionID := r.Form.Get("session_id")
	w.Header().Set("Content-Type", "application/json")
	defer func() {
		log.Printf("Serving session: %s", sessionID)
	}()
	mutex.Lock()
	defer mutex.Unlock()
	if s, ok := sessions[sessionID]; ok {
		json.NewEncoder(w).Encode(model.SessionStartResponse{
			SessionID:      sessionID,
			Question:       s.Questions[s.CurrentIdx],
			Total:          model.Limit,
			TotalTimeTaken: s.TotalTimeTaken,
		})
		return
	}

	sessionID = fmt.Sprintf("sid-%d", rand.Int64())
	shuffled := model.ShuffleQuestions(questions)
	for i := range len(shuffled) {
		shuffled[i].Number = strconv.Itoa(i + 1)
		shuffled[i].Correct = ""
	}
	session := &model.Session{
		Questions:  shuffled,
		Answers:    make(map[string]string),
		CurrentIdx: 0,
		Completed:  false,
	}
	sessions[sessionID] = session

	json.NewEncoder(w).Encode(model.SessionStartResponse{
		SessionID: sessionID,
		Question:  session.Questions[0],
		Total:     model.Limit,
	})

}
