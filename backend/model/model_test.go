package model

import (
	"reflect"
	"sort"
	"testing"
)

func TestNewShuffleQuestions(t *testing.T) {
	questions := []Question{
		{
			ID:       "1",
			Number:   "1",
			Question: "What is 2+2?",
			Options:  []string{"1", "2", "3", "4"},
			Correct:  "4",
		},
		{
			ID:       "2",
			Number:   "2",
			Question: "What is the capital of France?",
			Options:  []string{"Paris", "London", "Berlin", "Madrid"},
			Correct:  "Paris",
		},
		{
			ID:       "3",
			Number:   "3",
			Question: "What is the largest planet?",
			Options:  []string{"Earth", "Mars", "Jupiter", "Venus"},
			Correct:  "Jupiter",
		},
	}

	t.Run("Valid limit", func(t *testing.T) {
		limit := 2
		result := NewShuffleQuestions(questions, limit)

		if len(result) != limit {
			t.Errorf("Expected %d questions, got %d", limit, len(result))
		}

		for _, q := range result {
			found := false
			for _, orig := range questions {
				if q.ID == orig.ID {
					found = true
					break
				}
			}
			if !found {
				t.Errorf("Returned question ID %s not found in input", q.ID)
			}
		}
	})

	t.Run("Shuffle options", func(t *testing.T) {
		limit := 1
		result := NewShuffleQuestions(questions, limit)

		if len(result) != 1 {
			t.Fatalf("Expected 1 question, got %d", len(result))
		}

		// Get original question
		var orig Question
		for _, q := range questions {
			if q.ID == result[0].ID {
				orig = q
				break
			}
		}

		resultOptions := append([]string{}, result[0].Options...)
		origOptions := append([]string{}, orig.Options...)
		sort.Strings(resultOptions)
		sort.Strings(origOptions)
		if !reflect.DeepEqual(resultOptions, origOptions) {
			t.Errorf("Options differ: got %v, want %v", result[0].Options, orig.Options)
		}

		hasCorrect := false
		for _, opt := range result[0].Options {
			if opt == result[0].Correct {
				hasCorrect = true
				break
			}
		}
		if !hasCorrect {
			t.Errorf("Correct answer %s not found in options %v", result[0].Correct, result[0].Options)
		}
	})

	t.Run("Limit greater than length", func(t *testing.T) {
		limit := len(questions) + 1
		result := NewShuffleQuestions(questions, limit)

		if len(result) != len(questions) {
			t.Errorf("Expected %d questions, got %d", len(questions), len(result))
		}
	})

	t.Run("Zero limit", func(t *testing.T) {
		result := NewShuffleQuestions(questions, 0)
		if result != nil {
			t.Errorf("Expected nil for zero limit, got %v", result)
		}
	})

	t.Run("Negative limit", func(t *testing.T) {
		result := NewShuffleQuestions(questions, -1)
		if result != nil {
			t.Errorf("Expected nil for negative limit, got %v", result)
		}
	})

	t.Run("Empty input", func(t *testing.T) {
		result := NewShuffleQuestions([]Question{}, 1)
		if result != nil {
			t.Errorf("Expected nil for empty input, got %v", result)
		}
	})

	t.Run("Randomness check", func(t *testing.T) {
		limit := 2
		// Run multiple times to check for different selections
		results := make(map[string]bool)
		for i := 0; i < 10; i++ {
			result := NewShuffleQuestions(questions, limit)
			ids := result[0].ID + "," + result[1].ID
			results[ids] = true
		}
		// With 3 questions and limit 2, we expect multiple combinations
		if len(results) < 2 {
			t.Errorf("Expected multiple question combinations, got only %d", len(results))
		}
	})
}
