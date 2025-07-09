import React from "react";
import bubbleTexture from "../../../assets/bubbleTexture.svg";
import paperTexture from "../../../assets/paperTexture.svg";
import logoPolicia from "../../../assets/logoPolicia.png";
import ContainerLogin from "../../components/login/ContainerLogin/ContainerLogin";
import { Box, Container, Typography } from "@mui/material";

const Login: React.FC = () => {
  return (
    <Box
      data-testid="login-container"
      position="relative"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      fontFamily="'Inter', sans-serif"
      sx={{
        backgroundColor: "#000000",
        backgroundImage: `url(${bubbleTexture})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <Box
        position="absolute"
        top={0}
        left={0}
        width="100%"
        height="100%"
        data-testid="background-image"
        sx={{
          backgroundColor: "#000000",
          backgroundImage: `url(${paperTexture})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          opacity: 0.09,
          pointerEvents: "none",
        }}
      />

      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "1rem",
          padding: "1rem",
        }}
      > 
        <Box
          component="img"
          alt="logo da policia"
          src={logoPolicia}
          sx={{
            width: {
              sm: "18rem",
              md: "21rem",
              lg: "25rem",
            },
            height: "auto",
          }}
        />

        <Typography
          variant="h4"
          color="#ffffff"
          fontFamily="'Inter', sans-serif"
          fontWeight="bold"
          textAlign="center"
          sx={{ 
            fontSize: {
              xs: "1.0rem",
              sm: "1.5rem",
              md: "2.1rem",
              lg: "2.5rem",
            },
          }}
        >
          Dashboard Operacional
        </Typography>

        <ContainerLogin />
      </Container>
    </Box>
  );
};

export default Login;
