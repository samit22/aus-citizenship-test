export interface Question {
	number: string;
  id: string;
  question: string;
  options: string[];
  correct: string;
}

export interface Response {
  question: Question;
  completed: boolean;
  last_right: boolean;
	last_answer: string;
  score?: number;
  total?: number;
  feedback?: string;
	total_time_taken: number;
}

export interface StartResponse {
  session_id: string;
  question: Question;
  total: number;
	total_time_taken: number;
}

export interface ResultResponse {
  session_id: string;
  completed: boolean;
  total_questions: number;
  completed_questions: number;
  incorrect_answers: string[];
  score?: number;
  pass?: boolean;
  feedback?: string;
	total_time_taken: number;
}
