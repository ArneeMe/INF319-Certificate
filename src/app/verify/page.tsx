'use client'
import React, {useEffect, useState} from 'react';
import {useSearchParams} from 'next/navigation';
import {ExtraRole, Volunteer} from '@/app/util/Volunteer';
import {Box, Grid, Palette, TextField, Typography} from '@mui/material';
import {customTheme} from "@/app/style/customTheme";
import {formatDate} from "@/app/util/formatDate";

const Verify: React.FC = () => {
    const paramsString: string = useSearchParams()?.toString() || "";
    const paramsArray: string[] = paramsString.split('_').map(param => decodeURIComponent(param.replace(/\+/g, ' ')));
    paramsArray[paramsArray.length - 1] = paramsArray[paramsArray.length - 1].slice(0, -1); //removed because = char in URL

    const [isValid, setIsValid] = useState<boolean | null>(null);
    const colorTheme: Palette = customTheme.palette

    const verifyHash = async () => {
        try {
            const response = await fetch('/api/verify/verifyHash', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ formData }),
            });
            if (response.ok) {
                setIsValid(true)
            } else {
                setIsValid(false)
            }
        } catch (error) {
            setIsValid(null)
        }
    };

    const [formData, setFormData] = useState<Volunteer>({
        id: paramsArray[0] || '',
        personName: paramsArray[1] || '',
        groupName: paramsArray[2] || '',
        startDate: paramsArray[3] || '',
        endDate: paramsArray[4] || '',
        role: paramsArray[5] || '',
        extraRole: [
            {
                groupName: paramsArray[6] || '',
                startDate: paramsArray[7] || '',
                endDate: paramsArray[8] || '',
                role: paramsArray[9] || '',
            },
            {
                groupName: paramsArray[10] || '',
                startDate: paramsArray[11] || '',
                endDate: paramsArray[12] || '',
                role: paramsArray[13] || '',
            },
            {
                groupName: paramsArray[14] || '',
                startDate: paramsArray[15] || '',
                endDate: paramsArray[16] || '',
                role: paramsArray[17] || '',
            }
        ],
    });

    const formFields: Array<{ label: string; key: keyof Volunteer }> = [
        { label: 'Rolle', key: 'role' },
        { label: 'Gruppe', key: 'groupName' },
        { label: 'Startdato', key: 'startDate' },
        { label: 'Sluttdato', key: 'endDate' },
    ];

    const getColor = () => {
        if (isValid === true) {
            return colorTheme.primary.main;
        } else if (isValid === false) {
            return colorTheme.error.main;
        } else {
            return colorTheme.secondary.main;
        }
    };

    const handleChange = (field: keyof Volunteer, value: string) => {
        setFormData((prev: Volunteer) => ({...prev, [field]: value}));
    };

    const handleExtraRoleChange = (index: number, field: keyof ExtraRole, value: string) => {
        const updatedExtraRoles = [...formData.extraRole!];
        updatedExtraRoles[index] = {...updatedExtraRoles[index], [field]: value};
        setFormData((prev: Volunteer) => ({...prev, extraRole: updatedExtraRoles}));
    };


    useEffect(() => {
        verifyHash();
    },[formData]);

    return (
        <Box color={getColor}
            sx={{
            border: `5px solid ${getColor()}`,
            padding: 1,
            borderRadius: 2,
            margin: 2,
        }}>
            <Typography variant="h3">Verifikasjon</Typography>
            <Grid item xs={12} md={6}>
                <Typography variant="h6" color={getColor()}>
                    {isValid === null
                        ? "Laster..."
                        : isValid
                            ? "Attesten er gyldig!"
                            : "Attesten er ugyldig."}
                </Typography>
            </Grid>
            <Box>
                <Grid container spacing={2} paddingTop={2}>
                    <Grid item xs={10} md={12}>
                        <TextField
                            label="Navn"
                            variant="outlined"
                            fullWidth
                            value={formData.personName}
                            onChange={(e) => handleChange('personName', e.target.value)}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2} paddingTop={3}>
                    {formFields.map((field) => (
                        <Grid item xs={5} md={3} key={field.key}>
                            <TextField
                                label={field.label}
                                variant="outlined"
                                fullWidth
                                value={
                                    field.key === 'startDate'
                                        ? formatDate(formData.startDate)
                                        : field.key === 'endDate'
                                            ? formatDate(formData.endDate)
                                            : formData[field.key]
                                }
                                sx={{color:{getColor}}}
                                onChange={(e) => handleChange(field.key, e.target.value)}
                            />
                        </Grid>
                    ))}
                </Grid>

                {formData.extraRole?.filter(extraRole =>
                    extraRole.role || extraRole.groupName || extraRole.startDate || extraRole.endDate
                ).map((extraRole, index) => (
                    <Box key={index} sx={{ marginTop: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={5} md={3}>
                                <TextField
                                    label={`Rolle ${index + 1}`}
                                    variant="outlined"
                                    fullWidth
                                    value={extraRole.role}
                                    onChange={(e) => handleExtraRoleChange(index, 'role', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={5} md={3}>
                                <TextField
                                    label={`Ekstra Rolle Gruppe ${index + 1}`}
                                    variant="outlined"
                                    fullWidth
                                    value={extraRole.groupName}
                                    onChange={(e) => handleExtraRoleChange(index, 'groupName', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={5} md={3}>
                                <TextField
                                    label={`Startdato ${index + 1}`}
                                    variant="outlined"
                                    fullWidth
                                    value={formatDate(extraRole.startDate)}
                                    onChange={(e) => handleExtraRoleChange(index, 'startDate', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={5} md={3}>
                                <TextField
                                    label={`Sluttdato ${index + 1}`}
                                    variant="outlined"
                                    fullWidth
                                    value={formatDate(extraRole.endDate)}
                                    onChange={(e) => handleExtraRoleChange(index, 'endDate', e.target.value)}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}

export default Verify;