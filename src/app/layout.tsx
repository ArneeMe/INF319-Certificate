import RootLayoutProvider from '@/app/style/rootLayout';
import {Suspense} from "react";

export const metadata = {
    title: 'Min Next.js App',
    description: 'En beskrivelse av appen min',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <RootLayoutProvider>
            <body>
                <Suspense fallback={<div>Laster...</div>}>
                    {children}
                </Suspense>
            </body>
        </RootLayoutProvider>
        </html>
    );
}