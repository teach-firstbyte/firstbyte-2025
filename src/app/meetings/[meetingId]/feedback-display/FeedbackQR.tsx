'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";

interface FeedbackQRProps {
    meetingTitle: string;
    path: string;
}

export function FeedbackQR({ meetingTitle, path } : FeedbackQRProps) {
    const [url, setUrl] = useState<string | null>(null);

    useEffect(() => {
        //window only exists in the browser - build hte absolute URL after mount
        setUrl(`${window.location.origin}${path}`);
    }, [path]);

    return (
        <Card>
            <CardHeader className="text-center">
                <CardTitle>Leave Feedback</CardTitle>
                <CardDescription>{meetingTitle}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-6">
                {url ? (
                    <QRCodeSVG className="mb-4" value={url} size={240} />
                ) : (
                    <div className="h-[240px] w-[240px] animate-pulse rounded-md bg-muted" />
                )}
            </CardContent>
        </Card>
    )
}