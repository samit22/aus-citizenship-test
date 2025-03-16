package local

import (
	"fmt"
	"quiz/model"
	"sync"
)

func NewStorage(questions []model.Question) model.Storage {
	return &questionStorage{
		questions: questions,
	}
}

type questionStorage struct {
	lock      sync.Mutex
	questions []model.Question
	sessions  map[string]model.Session
}

func (q *questionStorage) GetQuestions() []model.Question {
	return q.questions
}

func (q *questionStorage) CreateSession(sessionID string, session model.Session) error {
	q.lock.Lock()
	defer q.lock.Unlock()
	q.sessions[sessionID] = session
	return nil
}

func (q *questionStorage) GetSession(sessionID string) (session model.Session, err error) {
	q.lock.Lock()
	defer q.lock.Unlock()
	if s, ok := q.sessions[sessionID]; ok {
		return s, nil
	}
	return model.Session{}, fmt.Errorf("session not found")
}

func (q *questionStorage) UpdateSession(sessionID string, session model.Session) (err error) {
	q.lock.Lock()
	defer q.lock.Unlock()
	q.sessions[sessionID] = session
	return nil
}
