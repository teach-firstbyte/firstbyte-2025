"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QRCodeSVG } from "qrcode.react";
import { absoluteUrl } from "@/lib/paths";
import { useEffect, useState } from "react";

interface CheckInQRProps {
  meetingTitle: string;
  code: string;
  path: string;
}

export function CheckInQR({ meetingTitle, code, path }: CheckInQRProps) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    //window only exists in the browser - build hte absolute URL after mount
    // absoluteUrl adds the /dashboard base path; without it this QR points at a
    // 404 on the marketing site, which is only discoverable by scanning it.
    setUrl(absoluteUrl(path));
  }, [path]);

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Check in</CardTitle>
        <CardDescription>{meetingTitle}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6">
        {url ? (
          // QR stays black-on-white for scanner reliability; the explicit plate
          // keeps it looking deliberate rather than stray on a dark background.
          <div className="rounded-lg bg-white p-3">
            <QRCodeSVG value={url} size={240} />
          </div>
        ) : (
          <div className="h-[240px] w-[240px] animate-pulse rounded-md bg-muted" />
        )}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Or enter this code:</p>
          <p className="text-3xl font-bold tracking-widest">{code}</p>
        </div>
      </CardContent>
    </Card>
  );
}
