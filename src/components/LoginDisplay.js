import React, { useState } from "react";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme();

const LoginDisplay = (props) => {
  const [attemptedLogin, setAttemptedLogin] = useState(false);

  // Prevent the form from refreshing the page and used to set the error message if incorrect login
  const handleSubmit = (event) => {
    event.preventDefault();
    setTimeout(() => {
      setAttemptedLogin(true);
    }, 500);
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component='main' sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7} className='login-bg' />
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          component={Paper}
          elevation={6}
          square
          className='login-content-area-wrapper'
        >
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            className='login-content-area'
          >
            <Avatar>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component='h1' variant='h5'>
              Please enter your private API key below
            </Typography>
            <Box component='form' noValidate onSubmit={handleSubmit}>
              <TextField
                margin='normal'
                required
                fullWidth
                name='private-key'
                label='Private API key'
                type='password'
                id='password'
                onChange={(e) => props.setPrivateKey(e.target.value)}
              />
              <Button
                type='submit'
                fullWidth
                variant='contained'
                sx={{ mt: 3, mb: 2 }}
                onClick={() => props.getLists()}
              >
                Sign In
              </Button>
              <Typography
                align='center'
                className={`login-error ${attemptedLogin}`}
              >
                Your Private API Key is invalid. Please try again.
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default LoginDisplay;
