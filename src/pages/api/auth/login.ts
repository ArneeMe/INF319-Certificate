import type { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '@/app/firebase/fb_config';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { email, password } = req.body;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            res.status(200).json({ success: true });
        } catch (error) {
            console.error('Login failed:', error);
            res.status(401).json({ error: 'Invalid credentials.' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}