import { SignUp } from '@clerk/nextjs';
import { Button, AppBar, Box, Container, Toolbar, Typography } from '@mui/material';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <Container maxWidth="sm">
      <AppBar position="static" sx={{ backgroundColor: "#3f51b5" }}>
        <Toolbar>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
            }}
          >
            Flashcard Saas
          </Typography>
          <Button color="inherit">
            <Link href="/sign-in" passHref>
              Sign In
            </Link>
          </Button>
          <Button color="inherit">
            <Link href="/login" passHref>
              Login
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
        <Typography variant="h4">
          Sign Up
        </Typography>
        <SignUp routing="hash" /> 
        
      </Box>
    </Container>
  );
}
