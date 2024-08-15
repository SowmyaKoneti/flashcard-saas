'use client'
import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { collection, doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/firebase"
import { useRouter } from 'next/navigation';
import { Container, Grid, Card, CardContent, Typography, Button, CircularProgress } from "@mui/material";

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
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            {flashcards.length === 0 ? (
                <Typography variant="h6" sx={{ textAlign: 'center' }}>
                    No flashcards found.
                </Typography>
            ) : (
                <Grid container spacing={2}>
                    {flashcards.map((flashcard, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card sx={{ height: '100%' }}>
                                <CardContent>
                                    <Typography variant="h6" component="div">
                                        {flashcard.name}
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleCardClick(flashcard.name)}
                                        sx={{ mt: 2 }}
                                    >
                                        View Flashcards
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
}
