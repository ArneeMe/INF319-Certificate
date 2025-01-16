import React, {useState} from 'react';
import {
    Button,
    Container,
    FormHelperText,
    Grid,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    Typography,
} from '@mui/material';
import {db} from "./firebase/fb_config";
import {addDoc, collection} from "firebase/firestore";
import Link from "next/link";
import {v4 as uuidv4} from 'uuid';
import {Volunteer} from "@/app/util/Volunteer";
import ConfirmDialog from "@/app/util/confirmDialog";
import {formatVolunteerDetails} from "@/app/util/formatVolunteer";
import {undergrupper} from "@/app/pdfinfo/echoInfo";


const VolunteerForm = () => {
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [openSummaryDialog, setOpenSummaryDialog] = useState(false);
    const [showExtraRoles, setShowExtraRoles] = useState(false);
    const [formData, setformData] = useState<Volunteer>({
        id: '',
        personName: '',
        groupName: '',
        startDate: '',
        endDate: '',
        role: '',
        extraRole: [
            {groupName: '', startDate: '', endDate: '', role: ''},
            {groupName: '', startDate: '', endDate: '', role: ''},
            {groupName: '', startDate: '', endDate: '', role: ''},
        ],
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setformData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        const {name, value} = event.target;
        setformData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const handleIndexChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const {name, value} = event.target;
        setformData(prevState => {
            const updatedRoles = [...(prevState.extraRole || [])];
            console.log(updatedRoles, index)
            updatedRoles[index] = {...updatedRoles[index], [name]: value};
            return {...prevState, extraRole: updatedRoles};
        });
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        setOpenConfirmDialog(true); // Åpne bekreftelsesdialogen
    };
    const handleCloseSummary = () => {
        setOpenSummaryDialog(false);
    };

    const handleConfirmSubmit = async () => {
        const uuid = uuidv4();
        try {
            const docRef = await addDoc(collection(db, 'volunteers'), {
                ...formData,
                id: uuid,
                timestamp: new Date()
            });
            console.log('Data saved with ID:', docRef.id);
            setOpenConfirmDialog(false);
            setOpenSummaryDialog(true);
        } catch (error) {
            console.error('Error adding document: ', error);
            alert('Feil ved lagring av data.');
        }
    };

    return (
        <Container component="main">
            <Grid container spacing={0}>
                <Grid item xs={8}>
                    <Typography variant="h5">
                        Frivillig Attest
                    </Typography>
                </Grid>
                <Grid
                    item xs={2}
                    justifyContent="center"
                    sx={{
                        border: '1px solid',
                        borderColor: '#009ffe.300',
                        borderRadius: '4px',
                    }}>
                    {/*todo gjør finere*/}
                        <Link href={"/login"}>
                            <Typography variant="h6">Admin innlogging</Typography>
                        </Link>

                </Grid>
            </Grid>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={10}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Fulle navn"
                            name="personName"
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={6} md={5}>
                        <Select
                            required
                            fullWidth
                            label="Gruppe"
                            name="groupName"
                            value={formData.groupName}
                            onChange={handleSelectChange}
                            sx={{ marginTop: '16px' }}
                        >
                            {Object.keys(undergrupper).map((key) => (
                                <MenuItem key={key} value={key}>
                                    {key}
                                </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>
                            <Typography>Velg UGP eller HS</Typography>
                        </FormHelperText>
                    </Grid>
                    <Grid item xs={6} md={5}>
                        <TextField
                            required
                            margin="normal"
                            fullWidth
                            label="Rolle/Stilling"
                            name="role"
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={6} md={5}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Når startet du?"
                            name="startDate"
                            type="date"
                            slotProps={{ inputLabel: { shrink: true } }}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={6} md={5}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Når sluttet du?"
                            name="endDate"
                            type="date"
                            slotProps={{ inputLabel: { shrink: true } }}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={6} md={5}>
                        <Button
                            type="button"
                            onClick={() => setShowExtraRoles(prev => !prev)}
                            style={{marginTop: '16px'}}
                        >
                            {showExtraRoles ? 'Skjul andre roller' : 'Legg til andre roller'}
                        </Button>
                    </Grid>
                    {/*todo gjør finere, er ikke linet opp med resten*/}
                    {showExtraRoles && (formData.extraRole || []).map((role, index) => (
                        <Grid container spacing={2} key={index}>
                            <Grid item xs={12}>
                                <Typography variant={"h6"}>Ekstra rolle {index + 1}</Typography>
                            </Grid>
                            <Grid item xs={6} md={5}>
                                <TextField
                                    margin="normal"
                                    fullWidth
                                    label={"Hvilken UGP / Interessegruppe / Komite?"}
                                    name={"groupName"}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleIndexChange(e, index)}
                                />
                            </Grid>
                            <Grid item xs={6} md={5}>
                                <TextField
                                    margin="normal"
                                    fullWidth
                                    label="Rolle/Stilling"
                                    name={"role"}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleIndexChange(e, index)}
                                />
                            </Grid>
                            <Grid item xs={6} md={5}>
                                <TextField
                                    margin="normal"
                                    fullWidth
                                    label="Når startet du?"
                                    name="startDate"
                                    type="date"
                                    slotProps={{ inputLabel: { shrink: true } }}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleIndexChange(e, index)}
                                />
                            </Grid>
                            <Grid item xs={6} md={5}>
                                <TextField
                                    margin="normal"
                                    fullWidth
                                    label="Når sluttet du?"
                                    name="endDate"
                                    type="date"
                                    slotProps={{ inputLabel: { shrink: true } }}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleIndexChange(e, index)}
                                />
                            </Grid>

                        </Grid>
                    ))}
                    <Grid item xs={6} md={5}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                        >
                            Send inn PDF
                        </Button>
                    </Grid>
                </Grid>
            </form>

            <ConfirmDialog
                open={openConfirmDialog}
                title="Bekreft innsending"
                message="Er du sikker på at du vil lagre disse dataene?"
                onConfirm={handleConfirmSubmit}
                onClose={() => setOpenConfirmDialog(false)}
                confirmButtonText="Ja, lagre"
            />

            <ConfirmDialog
                open={openSummaryDialog}
                title="PDF sendt inn"
                message="Denne PDF-en ble sendt inn:"
                onConfirm={handleCloseSummary}
                details={formatVolunteerDetails(formData)}
                onClose={handleCloseSummary}
                confirmButtonText="OK"
                showCancelButton={false}
            />


        </Container>
    );
};

export default VolunteerForm;