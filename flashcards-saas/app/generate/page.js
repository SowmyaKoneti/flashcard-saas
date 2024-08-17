'use client';
import { Bookmark, BookmarkBorder, Delete } from '@mui/icons-material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import {
    IconButton, Container, Box, Typography, Button, Grid, Card, CardActionArea, CardContent,
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Tabs, Tab
} from '@mui/material';
import { doc, collection, writeBatch, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import HomeIcon from '@mui/icons-material/Home';

const gradients = [
    'linear-gradient(135deg, #FFDEE9 0%, #B5AAFF 100%)',
    'linear-gradient(135deg, #C3E0E5 0%, #D4B2E2 100%)',
    'linear-gradient(135deg, #F6F9FC 0%, #E6E9F0 100%)',
    'linear-gradient(135deg, #F3E0F3 0%, #E7A2A2 100%)',
    'linear-gradient(135deg, #D6A4A4 0%, #B9FBC0 100%)'
];

export default function Generate() {
    const [savedCards, setSavedCards] = useState([]);
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

    const handleSaveCard = (index) => {
        const cardToSave = flashcards[index];
        setSavedCards(prev => {
            if (prev.includes(cardToSave)) {
                return prev.filter(card => card !== cardToSave);
            }
            return [...prev, cardToSave];
        });
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

    const handleDeleteCard = (index) => {
        setSavedCards((prevSavedCards) => {

            return prevSavedCards.filter((_, i) => i !== index);
        });
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
                    backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.5)), url(/image.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    opacity: 0.9,
                    zIndex: -1,
                }
            }}
        >
            <br/>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', mb: 2 }}>
                <Button href="/" sx={{ color: '#9c27b0', display: 'flex', alignItems: 'center' }}>
                    <HomeIcon fontSize="large" sx={{ mr: 1 }} /> {/* Add margin-right to space icon from text */}
                    Home
                </Button>
            </Box>
            <Container maxWidth="md">
                <Box sx={{ mb: 6, textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ paddingTop: 4, color: 'white', fontWeight: 'bold' }} gutterBottom>
                        Create Flashcards
                    </Typography>
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
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                boxShadow: '0 4px 8px rgba(255, 255, 255, 0.1), 0 6px 20px rgba(255, 255, 255, 0.1)', // Light shadow for black background
                                transition: 'box-shadow 0.3s ease-in-out',
                                '&:hover': {
                                    boxShadow: '0 8px 16px rgba(255, 255, 255, 0.2), 0 12px 40px rgba(255, 255, 255, 0.3), 0 0 15px rgba(255, 255, 255, 0.3)', // Enhanced shadow and light effect on hover
                                },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'grey.800',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'grey.800',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#9c27b0',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'white',
                                    '&.Mui-focused': {
                                        color: '#9c27b0',
                                    },
                                },
                            }}
                            InputProps={{
                                sx: {
                                    color: 'white',
                                }
                            }}
                        />

                        <Button
                            variant="contained"
                            sx={{
                                borderRadius: 2,
                                backgroundColor: '#9c27b0', // Button color
                                '&:hover': {
                                    backgroundColor: '#6d1b7b', // Darker shade of button color
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
                        boxShadow: '0 4px 8px rgba(255, 255, 255, 0.1), 0 8px 16px rgba(255, 255, 255, 0.1)', // Lighter shadow to contrast with the black background
                        padding: 3,
                        margin: 'auto',
                        transition: 'box-shadow 0.3s ease, background-color 0.3s ease',
                        '&:hover': {
                            boxShadow: '0 6px 12px rgba(255, 255, 255, 0.2), 0 12px 24px rgba(255, 255, 255, 0.2), 0 0 15px rgba(255, 255, 255, 0.3)', // Increased shadow intensity and light glow effect
                        },
                    }}
                >
                    <Tabs value={selectedTab} onChange={handleTabChange} centered>
                        <Tab label="Preview" sx={{ minWidth: 'unset', color: selectedTab === 0 ? '#9c27b0' : 'white', fontWeight: selectedTab === 0 ? 'bold' : 'normal' }} />
                        <Tab label="Saved Cards" sx={{ minWidth: 'unset', color: selectedTab === 1 ? '#9c27b0' : 'white', fontWeight: selectedTab === 1 ? 'bold' : 'normal' }} />
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
                                                        // boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                                                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1), 0px 0px 10px rgba(255, 255, 255, 0.2)',
                                                        borderRadius: 2,
                                                        position: 'relative',
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
                                                    <IconButton
                                                        sx={{
                                                            position: 'absolute',
                                                            top: 8,
                                                            right: 8,
                                                            color: savedCards.includes(flashcard) ? '#9c27b0' : '#757575',
                                                        }}
                                                        onClick={() => handleSaveCard(index)}
                                                    >
                                                        {savedCards.includes(flashcard) ? <Bookmark /> : <BookmarkBorder />}
                                                    </IconButton>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            ) : (
                                <Typography variant="body1" sx={{ textAlign: 'center', color: 'white' }}>No flashcards to display.</Typography>
                            )}
                        </Box>
                    )}

                    {selectedTab === 1 && (
                        <Box sx={{ p: 3 }}>
                            {savedCards.length > 0 ? (
                                <Grid container spacing={2}>
                                    {savedCards.map((flashcard, index) => (
                                        <Grid item xs={12} sm={6} md={4} key={index}>
                                            <Card
                                                sx={{
                                                    height: 250,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    perspective: 1000,
                                                    background: gradients[index % gradients.length],
                                                    //   boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                                                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1), 0px 0px 10px rgba(255, 255, 255, 0.2)',
                                                    borderRadius: 2,
                                                    position: 'relative',
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
                                                        transform: flipped[index + flashcards.length] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                                    }}
                                                    onClick={() => handleCardClick(index + flashcards.length)}
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
                                                <IconButton
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 8,
                                                        left: 8,
                                                        color: '#757575',
                                                    }}
                                                    onClick={() => handleDeleteCard(index)}
                                                >
                                                    <Delete />
                                                </IconButton>

                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : (
                                <Typography variant="body1" sx={{ textAlign: 'center', color: 'white' }}>No saved cards available.</Typography>
                            )}
                        </Box>
                    )}
                </Box>
            </Container>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle sx={{ color: '#9c27b0', fontFamily: 'Lobster' }}>Save Flashcards</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: 'grey.700', fontFamily: 'Lobster' }}>
                        Please enter a name for your flashcard set.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Set Name"
                        type="text"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        sx={{
                            mb: 2,
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'grey.500',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'grey.500',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#9c27b0',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: 'grey.700',
                                '&.Mui-focused': {
                                    color: '#9c27b0',
                                },
                            },
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="outlined"
                        onClick={handleClose}
                        sx={{
                            borderRadius: 2,
                            borderColor: '#9c27b0',
                            color: '#9c27b0',
                            '&:hover': {
                                borderColor: '#6d1b7b',
                                color: '#6d1b7b',
                            }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{
                            borderRadius: 2,
                            backgroundColor: '#9c27b0',
                            '&:hover': {
                                backgroundColor: '#6d1b7b',
                            }
                        }}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}    