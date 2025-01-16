'use client'
import React, {useEffect, useState} from 'react';
import {db} from '@/app/firebase/fb_config';
import {collection, getDocs} from 'firebase/firestore';
import {Button, Grid, Link, Paper, Typography} from '@mui/material';
import {Volunteer} from '@/app/util/Volunteer'
import {generatePDF} from "@/app/login/adminpage/generatePDF"
import {deleteVolunteer} from "@/app/util/deleteVolunteer";
import ConfirmDialog from "@/app/util/confirmDialog";
import {generateURL} from "@/app/login/adminpage/generateURL";
import {submitHash} from "@/app/login/adminpage/submitHash";
import {formatVolunteerDetails} from "@/app/util/formatVolunteer";


const AdminPage: React.FC = () => {
    const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openPDFDialog, setOpenPDFDialog] = useState(false);
    const [pdfUrl, setPdfUrl] = useState('');

    useEffect(() => {
        const fetchVolunteers = async () => {
            const querySnapshot = await getDocs(collection(db, 'volunteers'));
            const volunteersData: Volunteer[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data() as Omit<Volunteer, 'id'>;
                volunteersData.push({
                    id: doc.id,
                    ...data,
                });
            });
            setVolunteers(volunteersData);
        };
        fetchVolunteers();
    }, []);

    const handleDelete = async (id: string) => {
        await deleteVolunteer(id);
        setVolunteers(volunteers.filter(volunteer => volunteer.id !== id));
    }

    const handleDeleteClick = (volunteer: Volunteer) => {
        setSelectedVolunteer(volunteer);
        setOpenDeleteDialog(true);
    };

    const handleDeleteConfirm = async () => {
        if (selectedVolunteer) {
            try {
                await handleDelete(selectedVolunteer.id);
                setOpenDeleteDialog(false);
                setSelectedVolunteer(null);
            } catch (error) {
                console.log(error);
                alert('Feil ved sletting av data');
            }
        }
    };

    const handleClick = (volunteer: Volunteer) => {
        setSelectedVolunteer(volunteer);
        setOpenDialog(true);
    };
    const handleConfirm = async () => {
        if (selectedVolunteer) {
            try {
                await generatePDF(selectedVolunteer);
                setPdfUrl(generateURL(selectedVolunteer));
                submitHash(selectedVolunteer)
                setOpenPDFDialog(true);
                setOpenDialog(false);
            } catch (error) {
                console.log(error);
                alert('Feil ved generering av PDF');
            }
        }
    };

    const handleClose = () => {
        setOpenDialog(false);
        setSelectedVolunteer(null);
    };

    return (
        <>
            <Typography variant="h4" gutterBottom>
                Oversikt
            </Typography>
            <Grid container spacing={2}>
                {volunteers.map((volunteer: Volunteer) => (
                    <Grid item xs={12} sm={6} key={volunteer.id}>
                        <Paper elevation={3} style={{ padding: '20px', marginTop: '10px' }}>
                            {formatVolunteerDetails(volunteer)}
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleClick(volunteer)}
                            >
                                <Typography>
                                    Generer PDF
                                </Typography>
                            </Button>
                            <Button
                                onClick={() => handleDeleteClick(volunteer)}
                                color="primary"
                                size="small"
                            >
                                <Typography color={"error"}>
                                    Slett data
                                </Typography>
                            </Button>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <ConfirmDialog
                open={openDialog}
                title="Bekreft generering av PDF"
                message={`Er du sikker på at du vil generere PDF for ${selectedVolunteer?.personName}?`}
                details={selectedVolunteer && formatVolunteerDetails(selectedVolunteer)}
                onConfirm={handleConfirm}
                onClose={handleClose}
                confirmButtonText="Generer PDF"
            />

            <ConfirmDialog
                open={openDeleteDialog}
                title="Bekreft sletting"
                message={`Er du sikker på at du vil slette denne PDF-en til ${selectedVolunteer?.personName}`}
                onConfirm={handleDeleteConfirm}
                onClose={() => setOpenDeleteDialog(false)}
                confirmButtonText="Slett"
            />

            <ConfirmDialog
                open={openPDFDialog}
                title="PDF-en er Generert"
                message="Husk å les over og sørg for at alt er riktig, så slett brukeren fra databasen."
                details={<Typography variant="body1">
                    Her er verifiserings URL-en:
                    <Link href={pdfUrl} target="_blank" rel="">
                        {pdfUrl}
                    </Link>
                </Typography>}
                onConfirm={() => setOpenPDFDialog(false)}
                onClose={() => setOpenPDFDialog(false)}
                confirmButtonText="OK"
                showCancelButton={false}
            />
        </>
    );
};

export default AdminPage;