'use client'
import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { collection, doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/firebase"
import { useRouter } from 'next/navigation';
import { Box, Container, Grid, Card, CardContent, Typography, Button, CircularProgress } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import Link from 'next/link';

export default function Flashcards() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        async function getFlashcards() {
            if (!user) return;
            try {
                const docRef = doc(collection(db, 'users'), user.id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const collections = docSnap.data().flashcards || [];
                    setFlashcards(collections);
                } else {
                    await setDoc(docRef, { flashcards: [] });
                    setFlashcards([]); // Set to empty array
                }
            } catch (error) {
                console.error("Error fetching flashcards: ", error);
            } finally {
                setLoading(false); // Stop loading once done
            }
        }
        getFlashcards();
    }, [user]);

    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`)
    }

    if (!isLoaded || !isSignedIn) {
        return <></>;
    }

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Loading flashcards...
                </Typography>
            </Container>
        );
    }

    return (
        <Box sx={{
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
        }}>
          <Container maxWidth="lg" sx={{ mt: 4 }}>
            {/* Home Icon */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Button href="/" sx={{ color: '#C4A3C4' }}>
                <HomeIcon fontSize="large" />
              </Button>
            </Box>
    
            {/* Flashcards Grid */}
            {flashcards.length === 0 ? (
              <Typography
                variant="h6"
                sx={{
                  textAlign: 'center',
                  fontFamily: 'Lobster, cursive',
                  color: '#C4A3C4'  // Matching the color palette
                }}
              >
                No flashcards found.
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {flashcards.map((flashcard, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card
                      sx={{
                        height: '100%',
                        backgroundColor: '#F9F7FC',  // Light background color to match the palette
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow
                        '&:hover': {
                          boxShadow: '0 6px 12px rgba(0, 0, 0, 0.5)', // Shadow on hover
                        },
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="h4"
                          component="div"
                          sx={{
                            fontFamily: 'Dancing Script, cursive',
                            fontWeight: 700,
                            color: '#B48CB9',  // Matching text color
                          }}
                        >
                          {flashcard.name}
                        </Typography>
                        <Button
                          variant="contained"
                          onClick={() => handleCardClick(flashcard.name)}
                          sx={{
                            mt: 2,
                            backgroundColor: '#C4A3C4', // Matching button color
                            '&:hover': {
                              backgroundColor: '#B48CB9', // Darker shade on hover
                            },
                            borderRadius: 2,
                          }}
                        >
                          View Flashcards
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
    
                {/* Add Flashcard Button */}
                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#F9F7FC',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                      '&:hover': {
                        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.5)', // Shadow on hover
                      },
                    }}
                  >
                    <Link href="/generate" passHref>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: '#C4A3C4', // Matching button color
                          '&:hover': {
                            backgroundColor: '#B48CB9', // Darker shade on hover
                          },
                          borderRadius: '50%',
                          minWidth: '56px',
                          minHeight: '56px',
                        }}
                      >
                        <AddIcon fontSize="large" />
                      </Button>
                    </Link>
                  </Card>
                </Grid>
              </Grid>
            )}
          </Container>
        </Box>
      );
}
