'use client'
import React, {useEffect, useState} from 'react';
import {auth} from '@/app/firebase/fb_config';
import {Button, Grid, Paper, Typography} from '@mui/material';
import {Volunteer} from '@/app/util/Volunteer'
import {generatePDF} from "@/app/util/generatePDF"
import {deleteVolunteer} from "@/app/util/deleteVolunteer";
import {generateURL} from "@/app/util/generateURL";
import {submitHash} from "@/app/util/submitHash";
import {formatVolunteerDetails} from "@/app/components/formatVolunteer";
import {useRouter} from "next/navigation";
import {onAuthStateChanged} from 'firebase/auth';
import {fetchVolunteers} from "@/app/util/fetchVolunteers";
import ConfirmAdminDialogs from "@/app/components/confirmAdminDialogs";


const AdminPage: React.FC = () => {
    const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openPDFDialog, setOpenPDFDialog] = useState(false);
    const [pdfUrl, setPdfUrl] = useState('');
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(true);


    useEffect(() => {
        const authStatus = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setLoading(false);
                setVolunteers(await fetchVolunteers())
            } else {
                router.push('/login');
            }
        });

        return () => authStatus();
    }, [router]);

    if (loading) {
        return <div>Loading...</div>;
    }


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
                await submitHash(selectedVolunteer)
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
                        <Paper elevation={3} style={{padding: '20px', marginTop: '10px'}}>
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

            <ConfirmAdminDialogs
                openDialog={openDialog}
                openDeleteDialog={openDeleteDialog}
                openPDFDialog={openPDFDialog}
                selectedVolunteer={selectedVolunteer}
                pdfUrl={pdfUrl}
                handleConfirm={handleConfirm}
                handleDeleteConfirm={handleDeleteConfirm}
                handleClose={handleClose}
                setOpenPDFDialog={setOpenPDFDialog}
                setOpenDeleteDialog={setOpenDeleteDialog}
            />

        </>
    );
};

export default AdminPage;