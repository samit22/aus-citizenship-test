package routes

import (
	"quiz/model"
)

type Route struct {
	storage model.Storage
}

func NewRoute(storage model.Storage) *Route {
	return &Route{
		storage: storage,
	}
}

func (r *Route) StartSessionHandler() {}
func (r *Route) NextHandler()         {}
func (r *Route) ResultHandler()       {}
