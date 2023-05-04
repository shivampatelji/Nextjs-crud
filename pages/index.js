import Head from 'next/head';
import React from 'react';
import { Button, Typography, Box } from '@mui/material';
import { useRouter } from 'next/router';
import Link from 'next/link';

function Home() {
  const router = useRouter();
  const handleLoginClick = () => {
    router.push('/login');
    // Add your login logic here
  };

  const handleRegisterClick = () => {
    router.push('/register');
    // Add your registration logic here
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
        <title>LandingPage | CrudDemo</title>
        <meta name="description" content="Login to CrudDemo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Link legacyBehavior href="/[postId]" as="/123">
        <a>..</a>
      </Link>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 5,
          width: '100%',
        }}
      >
        <Typography variant="h2">Member Form</Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleLoginClick}
          >
            Login
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={handleRegisterClick}
          >
            Register
          </Button>
        </Box>
      </Box>
    </div>
  );
}

export default Home;
