package model

import (
	"math/rand/v2"
	"os"
	"strconv"
)

const (
	PassPercent  float64 = 80.00
	DefaultLimit         = 20
)

var (
	Limit = getLimit()
)

type Storage interface {
	GetQuestions() []Question
	CreateSession(sessionID string, session Session) error
	GetSession(sessionID string) (Session, error)
	UpdateSession(sessionID string, session Session) error
}

type SessionStartResponse struct {
	SessionID      string   `json:"session_id"`
	Question       Question `json:"question"`
	Total          int      `json:"total"`
	TotalTimeTaken int      `json:"total_time_taken"`
}

type Question struct {
	ID       string   `json:"id"`
	Number   string   `json:"number"`
	Question string   `json:"question"`
	Options  []string `json:"options"`
	Correct  string   `json:"correct,omitempty"`
}

type Result struct {
	SessionID          string   `json:"session_id"`
	Completed          bool     `json:"completed"`
	TotalQuestions     int      `json:"total_questions"`
	CompletedQuestions int      `json:"completed_questions"`
	CorrectAnswerCount int      `json:"correct_answer_count"`
	IncorrectAnswers   []string `json:"incorrect_answers,omitempty"`
	Score              *float64 `json:"score,omitempty"`
	Pass               *bool    `json:"pass,omitempty"`
	Feedback           *string  `json:"feedback,omitempty"`
	TotalTimeTaken     int      `json:"total_time_taken"`
}

type Response struct {
	LastRight       bool      `json:"last_right"`
	LastAnswer      string    `json:"last_answer"`
	Feedback        string    `json:"feedback,omitempty"`
	Question        *Question `json:"question,omitempty"`
	TotalQuestions  int       `json:"total_questions"`
	CurrentQuestion int       `json:"current_question"`
	Completed       bool      `json:"completed"`
	TotalTimeTaken  int       `json:"total_time_taken"`
}

type Answer struct {
	SessionID      string `json:"session_id"`
	QuestionID     string `json:"question_id"`
	Answer         string `json:"answer"`
	TotalTimeTaken int    `json:"total_time_taken"`
}

type ResultRequest struct {
	SessionID string `json:"session_id"`
}

type Session struct {
	Questions      []Question
	Answers        map[string]string
	CurrentIdx     int
	Completed      bool
	TotalTimeTaken int
}

func ShuffleQuestions(qs []Question) []Question {
	shuffled := make([]Question, len(qs))
	copy(shuffled, qs)
	rand.Shuffle(len(shuffled), func(i, j int) {
		shuffled[i], shuffled[j] = shuffled[j], shuffled[i]
	})
	return shuffled[:Limit]
}

func getLimit() int {
	if value, exists := os.LookupEnv("QUESTION_LIMIT"); exists {
		if limit, err := strconv.Atoi(value); err == nil {
			return limit
		}
	}
	return DefaultLimit
}
