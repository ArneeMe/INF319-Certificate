import React from 'react';
import ConfirmDialog from '@/app/components/confirmDialog';
import { Typography, Link } from '@mui/material';
import {formatVolunteerDetails} from "@/app/components/formatVolunteer";
import {Volunteer} from "@/app/util/Volunteer";

interface ConfirmDialogsProps {
    openDialog: boolean;
    openDeleteDialog: boolean;
    openPDFDialog: boolean;
    selectedVolunteer?: Volunteer | null;
    pdfUrl?: string;
    handleConfirm: () => void;
    handleDeleteConfirm: () => void;
    handleClose: () => void;
    setOpenPDFDialog: (open: boolean) => void;
    setOpenDeleteDialog: (open: boolean) => void;
}

const ConfirmDialogs: React.FC<ConfirmDialogsProps> = ({
                                                           openDialog,
                                                           openDeleteDialog,
                                                           openPDFDialog,
                                                           selectedVolunteer,
                                                           pdfUrl,
                                                           handleConfirm,
                                                           handleDeleteConfirm,
                                                           handleClose,
                                                           setOpenPDFDialog,
                                                           setOpenDeleteDialog,
                                                       }) => {
    return (
        <>
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
                open={openPDFDialog}
                title="PDF-en er Generert"
                message="Husk å les over og sørg for at alt er riktig, så slett brukeren fra databasen."
                details={
                    <Typography variant="body1">
                        Her er verifiserings URL-en:
                        <Link href={pdfUrl} target="_blank" rel="">
                            {pdfUrl}
                        </Link>
                    </Typography>
                }
                onConfirm={() => setOpenPDFDialog(false)}
                onClose={() => setOpenPDFDialog(false)}
                confirmButtonText="OK"
                showCancelButton={false}
            />

            <ConfirmDialog
                open={openDeleteDialog}
                title="Bekreft sletting"
                message={`Er du sikker på at du vil slette denne PDF-en til ${selectedVolunteer?.personName}?`}
                onConfirm={handleDeleteConfirm}
                onClose={() => setOpenDeleteDialog(false)}
                confirmButtonText="Slett"
            />
        </>
    );
};

export default ConfirmDialogs;