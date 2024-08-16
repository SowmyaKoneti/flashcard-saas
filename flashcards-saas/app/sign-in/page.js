import { SignIn } from '@clerk/nextjs';
import { Button, AppBar, Box, Container, Toolbar, Typography } from '@mui/material';
import Link from 'next/link';
import Head from 'next/head';

export default function SignUpPage() {
  return (
    <Container maxWidth="sm">
      <Head>
        <title>Sign In - Flashcard SaaS</title>
        <meta name="description" content="Sign in to your Flashcard SaaS account" />
        <link href="https://fonts.googleapis.com/css2?family=Lobster&family=Dancing+Script&display=swap" rel="stylesheet" />
      </Head>
      <br></br>
      <AppBar position="static" sx={{ backgroundColor: "#D8BFD8" }}>
        <Toolbar>
          <Typography
            variant="h5"
            sx={{
              flexGrow: 1,
              fontFamily: 'Lobster, cursive',
              fontWeight: 700,
            }}
          >
            Custom Flashcards 
          </Typography>
          <Button color="inherit" sx={{ fontFamily: 'Dancing Script, cursive' }}>
            <Link href="/sign-up" passHref>
              Sign Up
            </Link>
          </Button>
        </Toolbar>
      </AppBar>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={{ mt: 4 }} 
      >
        <Typography
          variant="h4"
          sx={{
            fontFamily: 'Lobster, cursive',
            fontWeight: 700,
            color: '#C4A3C4', // Darker lavender shade matching the "Get Started" button
          }}
        >
          Sign In
        </Typography>
        <br></br>
        <SignIn routing="hash" />
      </Box>
    </Container>
  );
}
