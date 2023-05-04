import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  FormControl,
  FormHelperText,
} from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
  };

  const onForgotPassword = () => {
    if (validateEmail(email)) {
      console.log('Email:', email, 'Password:', password);

      axios
        .post('http://localhost:5000/forgot-password', { email })
        .then((response) => {
          console.log('User created:', response);
          // if (response.data.success) {
          //   console.log(response.data.message.firstName)
          //   sessionStorage.setItem('isLoggedIn', true);
          //   router.push("/home", {
          //     state: {
          //       displayName: response.data.message.firstName
          //     }
          //   })
          // }
          // else {
          //   Swal.fire({
          //     title: response.data.message,
          //     icon: 'warning',
          //   })
          // }
          // Add logic to display a success message to the user
        })
        .catch((error) => {
          console.error('Error creating user:', error);
          Swal.fire('Error', 'Server Down', 'error');
          // Add logic to display an error message to the user
        });

      // Add your login logic here
    } else {
      Swal.fire({
        title: 'Please Enter Valid Email',
        icon: 'warning',
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEmailError(!validateEmail(email));
    // setPasswordError(password.trim().length < 6);

    if (validateEmail(email) && password.trim().length >= 6) {
      console.log('Email:', email, 'Password:', password);
      // Add your login logic here
    }
    let data = { email, password };
    let axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };
    axios
      .post('/api/login', data, axiosConfig)
      .then((response) => {
        console.log('User created:', response);
        if (response.data.success) {
          console.log(response.data.message.firstName);
          sessionStorage.setItem('isLoggedIn', true);
          //router.push('/homepage');
          router.push({
            pathname: '/homepage',
            query: { name: response.data.message.firstName },
          });
        } else {
          Swal.fire({
            title: response.data.message,
            icon: 'warning',
          });
        }
        // Add logic to display a success message to the user
      })
      .catch((error) => {
        console.error('Error creating user:', error);
        Swal.fire('Error', 'Server Down', 'error');
        // Add logic to display an error message to the user
      });
  };

  return (
    <div
      style={{
        backgroundColor: '#F7EFE5',
        height: '100vh',
        display: 'flex',
        justifyContent: 'content',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <Head>
        <title>Login | CrudDemo</title>
        <meta name="description" content="Login to CrudDemo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            width: '500px',
            // maxWidth: '300px',
            // margin: 'auto',
          }}
        >
          <Typography variant="h4">Login</Typography>
          <FormControl fullWidth error={emailError}>
            <TextField
              label="Email"
              type="email"
              value={email}
              autoComplete={false}
              onChange={(e) => setEmail(e.target.value)}
              error={emailError}
            />
            {emailError && (
              <FormHelperText>
                Incorrect email. Enter a valid email.
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth error={passwordError}>
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={passwordError}
            />
            {passwordError && (
              <FormHelperText>
                Password must be at least 6 characters long.
              </FormHelperText>
            )}
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            type="submit"
            style={{ width: '100%' }}
          >
            Login
          </Button>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Typography>Dont have An Account?</Typography>
            <Typography
              style={{ color: 'blue', cursor: 'pointer' }}
              onClick={() => {
                router.push('/register');
              }}
            >
              Register
            </Typography>
            <Typography
              style={{ color: 'blue', cursor: 'pointer' }}
              onClick={onForgotPassword}
            >
              Forgot Password
            </Typography>
          </div>
        </Box>
      </div>
    </div>
  );
};

export default Login;
