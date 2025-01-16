import RootLayoutProvider from '@/app/style/rootLayout';

export const metadata = {
    title: 'Min Next.js App',
    description: 'En beskrivelse av appen min',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <RootLayoutProvider>
            <body>
            {children}
            </body>
        </RootLayoutProvider>
        </html>
    );
}