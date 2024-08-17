'use client';
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button, Container, Typography, Box, Grid, Stack } from "@mui/material";
import Head from "next/head";
import { useState } from 'react';
import { useRef } from 'react';

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

  const pricingRef = useRef(null);
  const checkoutRef = useRef(null);

  const handlePricingHover = () => {
    if (checkoutRef.current) {
      checkoutRef.current.scrollIntoView({ behavior: 'smooth' });
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
          bgcolor: 'black',
          backgroundImage: 'url(/cover.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 1,
          zIndex: -1,
        }
      }}
    >
      <Container maxWidth="lg">
        <Head>
          <title>Flashcard SaaS</title>
          <meta name="description" content="Create flashcard from your text" />
        </Head>
        <br />
        <Stack direction="row" spacing={3} justifyContent="flex-end">
          <SignedOut>
            <Button
              variant="contained"
              sx={{
                bgcolor: '#9c27b0', // light lavender
                '&:hover': {
                  bgcolor: '#6d1b7b', // Darker shade of lavender
                },
              }}
              href="/sign-in"
            >
              Sign In
            </Button>
            <Button
              variant="contained"
              sx={{
                bgcolor: '#9c27b0', // light lavender
                '&:hover': {
                  bgcolor: '#6d1b7b', // Darker shade of lavender
                },
              }}
              href="/sign-up"
            >
              Sign Up
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Stack>
        <Box sx={{ textAlign: 'center', my: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
          <span style={{ color: 'white' }}>Custom</span> 
          <span style={{ color: '#9c27b0' }}> AI </span> 
          <span style={{ color: 'white' }}>Flashcards</span>
        </Typography>
          <Typography variant="h5" component="h2" gutterBottom color="white" sx={{ fontFamily: 'Lobster', fontStyle: 'italic', fontWeight: 'light' }}>
            Master Any Subject with Intelligent Flashcards
            <br />
            Boost your learning efficiency with our customizable flashcards. 
            <br />
            Create, save, and review cards effortlessly—anytime, anywhere.
          </Typography>
          <Button
            variant="contained"
            sx={{
              mt: 2,
              mr: 2,
              bgcolor: '#9c27b0', // light lavender
              '&:hover': {
                bgcolor: '#6d1b7b', // Darker shade of lavender
              },
            }}
            href="/generate"
          >
            Create Now
          </Button>
        </Box>
        <Box
          sx={{ my: 5, textAlign: 'left' }}
          onMouseEnter={handlePricingHover}
          ref={pricingRef}
        >
          <Typography variant="h3" component="h2" gutterBottom color="white" sx={{ textAlign: 'center', fontWeight: 700 }}>
            Pricing
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={6}>
              <Box sx={{
                p: 3,
                border: "1px solid",
                borderColor: "grey.800", // Darker grey to match app background
                borderRadius: 2,
                transition: 'box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out', // Smooth transition for the shadow and transform
                boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)', // Initial subtle shadow
                '&:hover': {
                  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.5), 0px 0px 15px rgba(255, 255, 255, 0.3)', // Shadow with light effect on hover
                  transform: 'scale(1.05)', // Slightly scale the box up to create the pop effect
                }
              }}>
                <Typography variant="h4" gutterBottom color="white" sx={{ fontWeight: 'bold' }}>
                  Basic
                </Typography>
                <Typography variant="h6" gutterBottom color="white" sx={{ fontWeight: 'bold' }}>
                  $5 / month
                </Typography>
                <Typography color="white" sx={{ fontFamily: 'Lobster', fontStyle: 'italic', fontWeight: 'medium' }}>
                  {" "}
                  Access to basic flashcard features and limited storage.
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    mt: 2,
                    bgcolor: '#9c27b0', // light lavender
                    '&:hover': {
                      bgcolor: '#6d1b7b', // Darker shade of lavender
                    },
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
              <Box sx={{
                p: 3,
                border: "1px solid",
                borderColor: "grey.800", // Darker grey to match app background
                borderRadius: 2,
                transition: 'box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out', // Smooth transition for the shadow and transform
                boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)', // Initial subtle shadow
                '&:hover': {
                  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.5), 0px 0px 15px rgba(255, 255, 255, 0.3)', // Shadow with light effect on hover
                  transform: 'scale(1.05)', // Slightly scale the box up to create the pop effect
                }
              }}>
                <Typography variant="h4" gutterBottom color="white" sx={{ fontWeight: 'bold' }}>
                  Pro
                </Typography>
                <Typography variant="h6" gutterBottom color="white" sx={{ fontWeight: 'bold' }}>
                  $10 / month
                </Typography>
                <Typography color="white" sx={{ fontFamily: 'Lobster', fontStyle: 'italic', fontWeight: 'medium' }}>
                  {" "}
                  Unlimited flashcards and storage, with priority support.
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    mt: 2,
                    bgcolor: '#9c27b0', // light lavender
                    '&:hover': {
                      bgcolor: '#6d1b7b', // Darker shade of lavender
                    },
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
          <Box
            sx={{ mt: 4 }}
            ref={checkoutRef}
          >
            <Button
              variant="contained"
              color="primary"
              disabled={!subscriptionType}
              sx={{
                bgcolor: '#9c27b0', // light lavender
                '&:hover': {
                  bgcolor: '#6d1b7b', // Darker shade of lavender
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