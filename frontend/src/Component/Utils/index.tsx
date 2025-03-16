import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import "../../styles/flag.css";

export const Loader = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <CircularProgress />
    </Box>
  );
};

export const AusFlag = () => {
  return (
    <Box display="flex" justifyContent="center">
      <div className="flag-container">
        <img
          src="/australian-flag.svg"
          alt="Australian Flag"
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </Box>
  );
};
