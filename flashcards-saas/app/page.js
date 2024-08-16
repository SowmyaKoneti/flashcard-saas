'use client';
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { AppBar, Button, Container, Toolbar, Typography, Box, Grid, Stack } from "@mui/material";
import { light } from "@mui/material/styles/createPalette";
import Head from "next/head";
import { useState } from 'react';

export default function Home() {
  const [subscriptionType, setSubscriptionType] = useState(null);

  const handleSubmit = async () => {
    if (!subscriptionType) {
      console.warn('No subscription type selected');
      return;
    }

    const checkoutSession = await fetch('/api/checkout_session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        origin: 'http://localhost:3000',
      },
      body: JSON.stringify({ subscriptionType })
    });

    if (!checkoutSession.ok) {
      throw new Error(`HTTP error! status: ${checkoutSession.status}`);
    }

    const checkoutSessionJson = await checkoutSession.json();
    if (checkoutSession.statusCode === 500) {
      console.log(checkoutSessionJson.message);
      return;
    }

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    });

    if (error) {
      console.warn(error.message);
    }
  };

  return (
    <Box
            sx={{
                position: 'relative',
                minHeight: '100vh',
                padding: 0,
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: 'url(/image.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    opacity: 0.5,
                    zIndex: -1,
                }
            }}
    >
    <Container maxWidt="lg">
      <Head>
        <title>Flashcard SaaS</title>
        <meta name="description" content="Create flashcard from your text" />
      </Head>
      <br></br>
      {/* <AppBar position="static"> */}
        {/* <Toolbar> */}
          {/* <Typography variant="h6" style={{ flexGrow: 1 }}>Flashcard SaaS</Typography> */}
          <Stack direction="row" spacing={3} justifyContent="flex-end">
            <SignedOut>
              <Button variant="contained" color="inherit" href="/sign-in" >Sign In</Button>
              <Button variant="contained" color="inherit" href="/sign-up">Sign Up</Button>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </Stack>
        {/* </Toolbar> */}
      {/* </AppBar> */}
      <Box sx={{ textAlign: 'center', my: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontFamily: 'Lobster, cursive', fontWeight: 700 }}>
          Custom Flashcards
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontFamily: 'Lobster', fontStyle: 'italic', fontWeight: 'light' }}>
          The easiest way to create flashcards from your text.
        </Typography>
        {/* <Button variant="contained" color="primary" sx={{ mt: 2, mr: 2 }} href="/generate"> */}
        <Button
          variant="contained"
          sx={{
            mt: 2,
            mr: 2,
            bgcolor: '#C4A3C4', // light lavender
            '&:hover': {
              bgcolor: '#B48CB9', // Darker shade of lavender
            },
          }}
          href="/generate"
        >
          Get Started
        </Button>
      </Box>
      <Box sx={{ my: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontFamily: 'Dancing Script', fontWeight: 700 }}>
          Featured
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>

          </Grid>
          <Grid item xs={12} md={4}>

          </Grid>
          <Grid item xs={12} md={4}>

          </Grid>
        </Grid>
      </Box>
      <Box sx={{ my: 6, textAlign: 'left' }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontFamily: 'Dancing Script', fontWeight: 700 }}>
          Pricing
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, border: "1px solid", borderColor: "grey.300", borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom sx={{ fontFamily: 'Dancing Script', fontWeight: 700 }}>
                Basic
              </Typography>
              <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Lobster', fontWeight: 'medium' }}>
                $5 / month
              </Typography>
              <Typography sx={{ fontFamily: 'Lobster', fontStyle: 'italic', fontWeight: 'medium' }}>
                {" "}
                Access to basic flashcard features and limited storage.
              </Typography>
              <Button
                variant="contained"
                sx={{
                  mt: 2,
                  bgcolor: subscriptionType === 'basic' ? '#D8BFD8' : '#808080',
                  '&:hover': {
                    bgcolor: subscriptionType === 'basic' ? '#C4A3C4' : '#C4A3C4',
                  }
                }}
                onClick={() => {
                  setSubscriptionType('basic');
                  handleSubmit();
                }}
              >
                Choose Basic
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, border: "1px solid", borderColor: "grey.300", borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom sx={{ fontFamily: 'Dancing Script', fontWeight: 700 }}>
                Pro
              </Typography>
              <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Lobster', fontWeight: 'medium' }}>
                $10 / month
              </Typography>
              <Typography sx={{ fontFamily: 'Lobster', fontStyle: 'italic', fontWeight: 'medium' }}>
                {" "}
                Unlimited flashcards and storage, with priority support.
              </Typography>
              <Button
                variant="contained"
                sx={{
                  mt: 2,
                  bgcolor: subscriptionType === 'pro' ? '#D8BFD8' : '#808080',
                  '&:hover': {
                    bgcolor: subscriptionType === 'pro' ? '#C4A3C4' : '#C4A3C4',
                  }
                }}
                onClick={() => {
                  setSubscriptionType('pro');
                  handleSubmit();
                }}
              >
                Choose Pro
              </Button>
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            disabled={!subscriptionType}
            sx={{
              bgcolor: '#C4A3C4', // Use the state for background color
              '&:hover': {
                bgcolor: '#C4A3C4' ? '#B48CB9' : 'primary.dark', // Darker shade on hover
              },
            }}
            onClick={handleSubmit}
          >
            Proceed to Checkout
          </Button>
        </Box>
      </Box>
    </Container>
    </Box>
  );
}
