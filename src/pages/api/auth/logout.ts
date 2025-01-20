import type { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '@/app/firebase/fb_config';
import { signOut } from 'firebase/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            await signOut(auth);
            res.status(200).json({ success: true });
        } catch (error) {
            console.error('Logout failed:', error);
            res.status(500).json({ error: 'Logout failed.' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}