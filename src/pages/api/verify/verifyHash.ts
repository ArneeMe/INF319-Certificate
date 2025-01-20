import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/app/firebase/fb_config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { hashFunction } from '@/app/util/hashFunction';
import { Volunteer, ExtraRole } from '@/app/util/Volunteer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { formData }: { formData: Volunteer } = req.body;

        if (!formData || !formData.id) {
            return res.status(400).json({ error: 'Invalid input data.' });
        }

        const toCheck = [
            formData.id,
            formData.personName,
            formData.groupName,
            formData.startDate,
            formData.endDate,
            formData.role,
            ...((formData.extraRole || []).flatMap((role: ExtraRole) => [
                role.groupName,
                role.startDate,
                role.endDate,
                role.role,
            ])),
        ].join("_");

        try {
            const generatedHash = await hashFunction(toCheck);
            const q = query(collection(db, "hashcollection"), where("id", "==", formData.id));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (generatedHash === data.hash) {
                        return res.status(200).json({ result: 'true' });
                    } else {
                        return res.status(400).json({ result: 'false' });
                    }
                });
            } else {
                return res.status(404).json({ error: "Ingen attester funnet med den spesifikke ID-en." });
            }
        } catch (error) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}