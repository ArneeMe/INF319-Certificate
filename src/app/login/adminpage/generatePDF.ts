import {Volunteer} from '../../util/Volunteer'
import {barcodes, image, text} from '@pdfme/schemas';
import {generate} from '@pdfme/generator';
import {customTemplate} from '@/app/pdfinfo/customTemplate';
import {baseURL, generateURL} from "@/app/login/adminpage/generateURL";
import {generic_echo, undergrupper} from "@/app/pdfinfo/echoInfo";
import {signaturePerson1, signaturePerson2} from "@/app/pdfinfo/signatureInfo";
import { formatDate } from '@/app/util/formatDate';

const getPdfInput = (volunteer: Volunteer) => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();
    const name = volunteer.personName;
    const fullURL = generateURL(volunteer)
    const getVervText = (index: number) => {
        if (volunteer.extraRole && volunteer.extraRole.length > index) {
            const role = volunteer.extraRole[index];
            if (role.role && role.groupName && role.startDate && role.endDate) {
                return `${name} har og hatt en stilling som ${role.role} i ${role.groupName} fra ${role.startDate} til ${role.endDate}`;
            }
        }
        return '';
    };

    return [{
        signature_date: dd + '.' + mm + '.' + yyyy,
        student_name_date: `Attest til ${name}`,
        student_role: `${name} har vært ${volunteer.role} i ${volunteer.groupName} fra ${formatDate(volunteer.startDate)} til ${formatDate(volunteer.endDate)}`,
        group_info: undergrupper[volunteer.groupName],
        echo_info: generic_echo,
        verv_1: getVervText(0),
        verv_2: getVervText(1),
        verv_3: getVervText(2),
        signature_photo_1: signaturePerson1.photo,
        signature_photo_2: signaturePerson2.photo,
        signature_name_1: signaturePerson1.name,
        signature_name_2: signaturePerson2.name,
        signature_role_1: signaturePerson1.role,
        signature_role_2: signaturePerson2.role,
        signature_phone_1: signaturePerson1.phone,
        signature_phone_2: signaturePerson2.phone,
        qr_code: `${fullURL}`,
        qr_info: `Scan for å verifisere`,
        qr_page: `${baseURL}`,

    }
    ]
}

export const generatePDF = async (volunteer: Volunteer) => {
    const pdfInput = getPdfInput(volunteer);
    try {
        const pdf = await generate({
            template: customTemplate,
            inputs: pdfInput,
            plugins: {
                text,
                image,
                qrcode: barcodes.qrcode,
            },
        });

        const buffer = new Uint8Array(pdf.buffer);
        const blob = new Blob([buffer], {type: 'application/pdf'});
        const link = document.createElement('a');
        link.href =  URL.createObjectURL(blob);
        link.setAttribute('download', `${volunteer.personName}_attest.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Feil ved generering av PDF:', error);
    }
};