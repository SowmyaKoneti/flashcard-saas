'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import {
    Container, Box, Typography, Button, Grid, Card, CardActionArea, CardContent,
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Tabs, Tab
} from '@mui/material';
import { doc, collection, writeBatch, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';

const gradients = [
    'linear-gradient(135deg, #FFDEE9 0%, #B5AAFF 100%)',
    'linear-gradient(135deg, #C3E0E5 0%, #D4B2E2 100%)',
    'linear-gradient(135deg, #F6F9FC 0%, #E6E9F0 100%)',
    'linear-gradient(135deg, #F3E0F3 0%, #E7A2A2 100%)',
    'linear-gradient(135deg, #D6A4A4 0%, #B9FBC0 100%)'
];

export default function Generate() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [text, setText] = useState('');
    const [selectedTab, setSelectedTab] = useState(0);
    const [previewShown, setPreviewShown] = useState(false);
    const router = useRouter();

    const handleSubmit = async () => {
        try {
            const response = await fetch('api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text }),
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setFlashcards(data);
            setPreviewShown(true);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const handleCardClick = (id) => {
        setFlipped(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const saveFlashCards = async () => {
        if (!name) return alert('Please enter a name');

        const batch = writeBatch(db);
        const userDocRef = doc(collection(db, 'users'), user.id);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
            const collections = docSnap.data().flashcards || [];
            if (collections.some(f => f.name === name)) {
                return alert('Flashcard collection with the same name already exists');
            }
            collections.push({ name });
            batch.set(userDocRef, { flashcards: collections }, { merge: true });
        } else {
            batch.set(userDocRef, { flashcards: [{ name }] });
        }

        const colRef = collection(userDocRef, name);
        flashcards.forEach(flashcard => {
            const cardDocRef = doc(colRef);
            batch.set(cardDocRef, flashcard);
        });

        await batch.commit();
        handleClose();
        router.push('/flashcards');
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
            <Container maxWidth="md">
                <Box sx={{ mb: 6, textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ paddingTop: 4 }} gutterBottom>Create Flashcards</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, maxWidth: 600, mx: 'auto', mt: 4 }}>
                        <TextField
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            label="Enter title to generate flashcard"
                            variant="outlined"
                            size="medium"
                            sx={{
                                flex: 1,
                                minWidth: 200,
                                borderRadius: 2,
                                backgroundColor: 'background.paper',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2), 0 6px 20px rgba(0, 0, 0, 0.19)',
                                transition: 'box-shadow 0.3s ease-in-out',
                                '&:hover': {
                                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4), 0 12px 40px rgba(0, 0, 0, 0.38)',
                                },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'divider',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'divider',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#D3B5E0',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'text.secondary',
                                    '&.Mui-focused': {
                                        color: 'grey',
                                    },
                                },

                            }}
                            InputProps={{
                                sx: {
                                    borderColor: 'divider',
                                }
                            }}
                        />

                        <Button
                            variant="contained"
                            sx={{
                                borderRadius: 5,
                                backgroundColor: '#C3B1E1', // Purple color
                                '&:hover': {
                                    backgroundColor: '#7b1fa2', // Darker shade of purple for hover effect
                                }
                            }}
                            onClick={handleSubmit}
                        >
                            Generate
                        </Button>
                    </Box>
                </Box>

                <Box
                    sx={{
                        width: '100%',
                        maxWidth: '1800px',
                        backgroundColor: 'transparent',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2), 0 8px 16px rgba(0, 0, 0, 0.15)',
                        padding: 3,
                        margin: 'auto',
                        transition: 'box-shadow 0.3s ease, background-color 0.3s ease',
                        '&:hover': {
                            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3), 0 12px 24px rgba(0, 0, 0, 0.25)',
                        },

                    }}
                >
                    <Tabs value={selectedTab} onChange={handleTabChange} centered>
                        <Tab label="Preview" sx={{ minWidth: 'unset', color: selectedTab === 0 ? '#FF6F6F' : '#333', fontWeight: selectedTab === 0 ? 'bold' : 'normal' }} />
                        <Tab label="Saved Cards" sx={{ minWidth: 'unset', color: selectedTab === 1 ? '#FF6F6F' : '#333', fontWeight: selectedTab === 1 ? 'bold' : 'normal' }} />
                        <Tab label="History" sx={{ minWidth: 'unset', color: selectedTab === 2 ? '#FF6F6F' : '#333', fontWeight: selectedTab === 2 ? 'bold' : 'normal' }} />
                    </Tabs>

                    {selectedTab === 0 && (
                        <Box sx={{ p: 3 }}>
                            {flashcards.length > 0 ? (
                                <Box>
                                    <Grid container spacing={2}>
                                        {flashcards.map((flashcard, index) => (
                                            <Grid item xs={12} sm={6} md={4} key={index}>
                                                <Card
                                                    sx={{
                                                        height: 250,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        perspective: 1000,
                                                        background: gradients[index % gradients.length],
                                                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                                                        borderRadius: 2,
                                                    }}
                                                >
                                                    <CardActionArea
                                                        sx={{
                                                            width: '100%',
                                                            height: '100%',
                                                            position: 'relative',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            transformStyle: 'preserve-3d',
                                                            transition: 'transform 0.6s ease',
                                                            transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                                        }}
                                                        onClick={() => handleCardClick(index)}
                                                    >
                                                        <CardContent sx={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backfaceVisibility: 'hidden' }}>
                                                            <Typography variant="h6" sx={{ textAlign: 'center', padding: 2, color: '#000' }}>
                                                                {flashcard.front}
                                                            </Typography>
                                                        </CardContent>
                                                        <CardContent sx={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}>
                                                            <Typography variant="h6" sx={{ textAlign: 'center', padding: 2, color: '#000' }}>
                                                                {flashcard.back}
                                                            </Typography>
                                                        </CardContent>
                                                    </CardActionArea>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                        <Button variant="contained" color="secondary" onClick={handleOpen}>
                                            Save Flashcards
                                        </Button>
                                    </Box>
                                </Box>
                            ) : (
                                <Typography variant="body1" sx={{ textAlign: 'center' }}>No flashcards to display.</Typography>
                            )}
                        </Box>

                    )}

                    {selectedTab === 1 && (
                        <Box sx={{ p: 3 }}>
                            <Typography variant="body1" sx={{ textAlign: 'center' }}>No saved cards available.</Typography>
                        </Box>
                    )}

                    {selectedTab === 2 && (
                        <Box sx={{ p: 3 }}>
                            <Typography variant="body1" sx={{ textAlign: 'center' }}>No viewed cards available.</Typography>
                        </Box>
                    )}

                </Box>


            </Container>

            <Box sx={{ display: open ? 'block' : 'none', position: 'fixed', top: '20%', left: '50%', transform: 'translate(-50%, 0)', width: '90%', maxWidth: 500, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Save Flashcards
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                    Please enter a name for your flashcard set.
                </Typography>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Set Name"
                    type="text"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button variant="outlined" onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" color="primary" onClick={saveFlashCards}>Save</Button>
                </Box>
            </Box>

        </Box>
    );
}

