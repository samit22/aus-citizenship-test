"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ResultResponse } from "../../types";
import { Fireworks } from '@fireworks-js/react'
import type { FireworksHandlers } from '@fireworks-js/react'
import axios from "axios";
import { Loader } from "../Utils";
import {
  Container,
  Chip,
  Typography,
  Box,
  Button,
  Paper,
  Divider,
  Fade,
  Zoom,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import WarningIcon from "@mui/icons-material/Warning";

interface IResultProps {
  sessionId?: string;
}

const ResultPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: "center",
  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.8) 10%, rgba(240, 244, 248, 0.8) 80%)",
  borderRadius: theme.shape.borderRadius * 2,
}));

const StatusBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: theme.spacing(2),
}));

export default function Results(props: IResultProps) {
  const router = useRouter();
  const [result, setResult] = useState<ResultResponse | null>(null);
  const firework = useRef<FireworksHandlers>(null)
  const getResult = async (sessionId: string) => {
    try {
      const response = await axios.get<ResultResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/sessions/result?session_id=${sessionId}`
      );
      setResult(response.data);
    } catch (error) {
      console.error("Error starting quiz:", error);
    }
  };

  useEffect(() => {
    if (!props.sessionId) {
      return;
    }
    getResult(props.sessionId);
  }, [props.sessionId]);

  console.log("result", result)

  const handleReset = () => {
    router.push("/");
  };

  if (!result) {
    return <Loader />;
  }

  if (!result.completed) {
    return (
      <Container maxWidth="md">
        <Box my={6}>
          <ResultPaper elevation={3}>
            <Typography variant="h4" gutterBottom>
              Quiz Results
            </Typography>
            <StatusBox>
              <Zoom in={true} timeout={500}>
                <Box display="flex" alignItems="center">
                  <WarningIcon
                    sx={{ fontSize: 60, color: "warning.main", mr: 2 }}
                  />
                  <Typography variant="h5" color="warning.main">
                    Quiz Not Completed
                  </Typography>
                </Box>
              </Zoom>
            </StatusBox>
            <Fade in={true} timeout={1000}>
              <Box>
                <Typography variant="body1" gutterBottom>
                  It looks like you haven’t finished the quiz yet. Please
                  complete all questions to see your results.
                </Typography>
              </Box>
            </Fade>
            <Box mt={4}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => router.push(`/sessions/${result.session_id}`)}
                sx={{ px: 4, py: 1.5 }}
              >
                Return to Quiz
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                size="large"
                onClick={handleReset}
                sx={{ ml: 2, px: 4, py: 1.5 }}
              >
                Start Over
              </Button>
            </Box>
          </ResultPaper>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      {result?.score == 100 &&
        <Fireworks
          ref={firework}
          options={{ opacity: 2,
            mouse: {
              click: true,
              move: true,
              max: 5
            },
            acceleration: 1.02,
           }}
          style={{
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            position: 'absolute',
            background: '#fff',
            zIndex: -1,
        }}
      />
      }
      <Box my={6} zIndex={2}>
        <ResultPaper elevation={3}>
          <Typography variant="h4" gutterBottom>
            Quiz Results
          </Typography>
          <StatusBox>
            {result.pass ? (
              <Zoom in={true} timeout={500}>
                <Box display="flex" alignItems="center">
                  <CheckCircleIcon
                    sx={{ fontSize: 60, color: "green", mr: 2 }}
                  />
                  <Typography variant="h5" color="green">
                    Passed!
                  </Typography>
                </Box>
              </Zoom>
            ) : (
              <Zoom in={true} timeout={500}>
                <Box display="flex" alignItems="center">
                  <CancelIcon
                    sx={{ fontSize: 60, color: "error.main", mr: 2 }}
                  />
                  <Typography variant="h5" color="error">
                    Failed
                  </Typography>
                </Box>
              </Zoom>
            )}
          </StatusBox>
          <Fade in={true} timeout={1000}>
            <Box>
              <Typography variant="body1" gutterBottom>
                You scored {result.score}%
                ({result.total_questions - (result.incorrect_answers?.length || 0)} out of {result.total_questions} questions.)
              </Typography>
              <Typography
                variant="body1"
                gutterBottom
                color={result.pass ? "success" : "error"}
              >
                {result.feedback}
              </Typography>
            </Box>
          </Fade>
          {result.incorrect_answers?.length > 0 && (
            <Box mt={4}>
              <Typography variant="h6" gutterBottom>
                Incorrect Answers ({result.incorrect_answers.length})
              </Typography>
              <Divider />
              {result.incorrect_answers.map((question, index) => (
                <Chip
                  key={index}
                  label={question}
                  color="warning"
                  sx={{ m: 1 }}
                />
              ))}
            </Box>
          )}
          <Box mt={4}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleReset}
              sx={{ px: 4, py: 1.5 }}
            >
              Try Again
            </Button>
          </Box>
        </ResultPaper>
      </Box>
    </Container>
  );
}
