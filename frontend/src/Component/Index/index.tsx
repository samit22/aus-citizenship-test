"use client";
import React from "react";
import Head from "next/head";
import axios from "axios";
import { StartResponse } from "../../types";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Container,
  Grid2 as Grid,
  Paper,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { AusFlag } from "../Utils";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: "center",
  position: "relative",
  overflow: "hidden",
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`,
  marginBottom: theme.spacing(3),
}));

const FooterBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  paddingTop: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

export default function Home() {
  const router = useRouter();

  const startQuiz = () => {
		console.log("start quiz")
    axios
      .get<StartResponse>(`${process.env.NEXT_PUBLIC_API_URL}/sessions`)
      .then((response) => {
        router.push(`/sessions/${response.data.session_id}`);
      })
      .catch((e) => {
        console.error("Error starting quiz:", e);
      });
  };

  return (
    <Container maxWidth="md">
      <Head>
        <title>Australian Citizenship Quiz</title>
      </Head>
      <Box my={6} display="flex" justifyContent="center">
        <StyledPaper elevation={3}>
          <AusFlag />
          <HeaderBox>
            <Typography variant="h4" component="h1">
              Australian Citizenship Quiz
            </Typography>
          </HeaderBox>
          <Grid container spacing={3} alignItems="center">
            <Grid>
              <Typography variant="h6" gutterBottom>
                Ready to Test Your Knowledge?
              </Typography>
              <Typography variant="body1">
                Embark on a journey through Australia’s rich history, democratic
                values, and unique culture. This quiz features 200 questions,
                each one a step closer to understanding what it means to be an
                Australian citizen.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                With randomized questions and a progress tracker, you’ll enjoy a
                fresh challenge every time. Start now and see how well you know
                Australia!
              </Typography>
            </Grid>
          </Grid>
          <FooterBox>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={startQuiz}
              sx={{ px: 4, py: 1.5, fontWeight: "bold" }}
            >
              Start Your Quiz Now
            </Button>
          </FooterBox>
        </StyledPaper>
      </Box>
    </Container>
  );
}
