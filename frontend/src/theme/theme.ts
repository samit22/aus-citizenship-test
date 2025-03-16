import { createTheme } from "@mui/material/styles";
import { blue, grey } from "@mui/material/colors";

const gold = {
  50: "#fff8e1",
  100: "#ffecb3",
  200: "#ffe082",
  300: "#ffd54f",
  400: "#ffca28",
  500: "#ffc107",
  600: "#ffb300", // Secondary main
  700: "#ffa000",
  800: "#ff8f00",
  900: "#ff6f00",
};

const theme = createTheme({
  palette: {
    primary: {
      main: blue[700],
      light: blue[500],
      dark: blue[900],
      contrastText: "#ffffff",
    },
    secondary: {
      main: gold[600],
      light: gold[400],
      dark: gold[800],
      contrastText: "#ffffff",
    },
    background: { default: grey[100], paper: "#ffffff" },
    text: { primary: grey[900], secondary: grey[700] },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      letterSpacing: "-0.01562em",
      color: blue[700],
    },
    h4: { fontSize: "2rem", fontWeight: 600, color: blue[700] },
    h5: { fontSize: "1.5rem", fontWeight: 500 },
    h6: { fontSize: "1.25rem", fontWeight: 500, color: grey[800] },
    body1: { fontSize: "1rem", lineHeight: 1.6, color: grey[900] },
    body2: { fontSize: "0.875rem", lineHeight: 1.5, color: grey[700] },
    button: { fontWeight: 600, textTransform: "none" },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          background: "linear-gradient(135deg, #ffffff 0%, #f0f4f8 100%)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          padding: "10px 20px",
          borderRadius: 8,
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          transition: "all 0.3s ease",
          "&:hover": { boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" },
        },
        containedPrimary: {
          backgroundColor: blue[700],
          "&:hover": { backgroundColor: blue[800] },
        },
        containedSecondary: {
          backgroundColor: gold[600],
          "&:hover": { backgroundColor: gold[800] },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { height: 8, borderRadius: 4, backgroundColor: grey[300] },
        bar: { backgroundColor: gold[600] },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: { color: grey[600], "&.Mui-checked": { color: gold[600] } },
      },
    },
  },
  shape: { borderRadius: 8 },
});

export default theme;
