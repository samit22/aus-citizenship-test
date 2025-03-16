"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Head from "next/head";
import { Question, StartResponse, Response } from "../../types";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import {
  Container,
  Slide,
  Typography,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  LinearProgress,
} from "@mui/material";

import '../../styles/clock.css'

interface ISessionProps {
  sessionId: string;
}
export default function Session(params: ISessionProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string>(params.sessionId);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState<string>("");
  const [total, setTotal] = useState(0);
  const [totalTime, setTotalTime] = useState<number>(0);

  const [alert, setAlert] = useState<{
    show: boolean;
    message: string;
    severity: "success" | "error";
  } | null>(null);

  useEffect(() => {
    const startQuiz = async (sessionId: string) => {
      try {
        const response = await axios.get<StartResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/sessions?session_id=${sessionId}`
        );
        const newSessionId = response.data.session_id;
        if (sessionId.length > 0 && newSessionId != sessionId) {
          router.replace(`/sessions/${newSessionId}`);
          return;
        }
        setSessionId(newSessionId);
        setCurrentQuestion(response.data.question);
        setTotalTime(response.data.total_time_taken)
        setTotal(response.data.total);
        setAnswer("");
        setLoading(false);
      } catch (error) {
        console.error("Error starting quiz:", error);
      }
    };
    startQuiz(sessionId);
  }, [sessionId]);

  useEffect(() => {
    if (!currentQuestion) return;

    // Start or continue total time tracking
    const timer = setInterval(() => {
        setTotalTime((prev) => prev + 1);
    }, 1000);

    // Cleanup timer on unmount or quiz completion
    return () => clearInterval(timer);
}, [currentQuestion]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post<Response>(
        `${process.env.NEXT_PUBLIC_API_URL}/sessions/next`,
        { answer, session_id: sessionId, question_id: currentQuestion?.id, total_time_taken: totalTime}
      );
      setAlert({
        message: response.data.last_right
          ? "Correct Answer!"
          : `Incorrect! Answer is ${response.data.last_answer}`,
        show: true,
        severity: response.data.last_right ? "success" : "error",
      });
      setTimeout(() => setAlert(null), 3000);
      setTotalTime(response.data.total_time_taken)
      if (response.data.completed) {
        router.push(`/results/${sessionId}`);
      } else {
        setCurrentQuestion(response.data.question!);
        setAnswer("");
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  if (loading || !currentQuestion) {
    return (
      <Box sx={{ display: "flex" }}>
        <CircularProgress />
      </Box>
    );
  }
  const currentNumber = parseInt(currentQuestion.number) - 1;
  const progress = (currentNumber / total) * 100;

  const minutes = Math.floor(totalTime / 60);
  const seconds = totalTime % 60;
  // const timeDisplay = `${minutes}m ${seconds}s`;

  return (
    <Container maxWidth="md">
      <Head>
        <title>Australian Citizenship Quiz</title>
      </Head>
      <Box my={4}>
        <Paper elevation={3} sx={{ p: 3 }}>
          {alert && alert.show && (
            <Slide in={alert.show} timeout={500}>
              <Box mt={2}>
                <Alert
                  severity={alert.severity}
                  sx={{ justifyContent: "center" }}
                >
                  {alert.message}
                </Alert>
              </Box>
            </Slide>
          )}
          <Typography variant="h5" gutterBottom>
            Question {currentQuestion.number} of {total}
          </Typography>
          <Box mb={2}>
          <Box mb={2} display="flex" justifyContent="center">
            <div className="fancy-clock">
                <Typography variant="h6" component="span" className="clock-time">
                    {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                </Typography>
                <Typography variant="body2" component="span" className="clock-label">
                    Total Time
                </Typography>
            </div>
            </Box>
            <Typography
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              Completed
            </Typography>
            <LinearProgress
              variant="determinate"
              color="success"
              value={progress}
            />
            <Typography variant="body2" color="text.secondary" align="center">
              {currentNumber} / {total} ({Math.round(progress)}%)
            </Typography>
          </Box>
          <Typography variant="h4" gutterBottom>
            {currentQuestion.question}
          </Typography>
          <form onSubmit={handleSubmit}>
            <RadioGroup
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            >
              {currentQuestion.options.map((option) => (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
            <Box mt={2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={answer.length <= 0}
                fullWidth
              >
                Next
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}
