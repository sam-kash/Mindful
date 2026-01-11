"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GmailConnectedPage() {
    const router = useRouter();

    useEffect(() => {
        // Show success message briefly then redirect
        const timer = setTimeout(() => {
            router.push("/inbox");
        }, 2000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            <h1>Gmail Connected Successfully!</h1>
            <p>Redirecting you to your inbox...</p>
        </div>
    );
}
