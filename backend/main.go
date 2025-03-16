package main

import (
	"cmp"
	"embed"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"quiz/model"
	"sync"
	"time"
)

var (
	mutex     = &sync.Mutex{}
	sessions  = map[string]*model.Session{}
	questions []model.Question
)

//go:embed questions.json
var f embed.FS

func loadData() {
	st := time.Now()
	defer func() {
		et := time.Now()
		log.Printf("Data loading completed: took: %s", et.Sub(st))
	}()
	data, err := f.ReadFile("questions.json")
	if err != nil {
		log.Fatalf("Error reading questions.json: %v", err)
	}
	if err := json.Unmarshal(data, &questions); err != nil {
		log.Fatalf("Error unmarshaling questions: %v", err)
	}
	fmt.Printf("Loaded %d questions\t Current Limit: %d\n", len(questions), model.Limit)
}

func main() {
	loadData()
	http.HandleFunc("/api/sessions", StartSession)
	http.HandleFunc("/api/sessions/next", Next)
	http.HandleFunc("/api/sessions/result", ResultHandler)

	// Enable CORS
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == http.MethodOptions {
			return
		}
		http.NotFound(w, r)
	})
	port := cmp.Or(os.Getenv("PORT"), "5011")

	log.Println("Backend server starting on port: ", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}

func corsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
}
