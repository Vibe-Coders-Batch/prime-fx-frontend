"use client";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api/client";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";
interface SecureImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
}
export function SecureImage({ src, alt, className, ...props }: SecureImageProps) {
    const [signedUrl, setSignedUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    useEffect(() => {
        if (!src || src.startsWith("http") || src.startsWith("blob:")) {
            setSignedUrl(src);
            setLoading(false);
            return;
        }
        const fetchSignedUrl = async () => {
            try {
                setLoading(true);
                const { data } = await apiClient.get<{
                    url: string;
                }>(`/files/storage/download-url?key=${encodeURIComponent(src)}`);
                setSignedUrl(data.url);
            }
            catch (err) {
                void err;
                setError(true);
            }
            finally {
                setLoading(false);
            }
        };
        fetchSignedUrl();
    }, [src]);
    if (loading) {
        return <Skeleton className={cn("w-full h-full", className)}/>;
    }
    if (error || !signedUrl) {
        return (<div className={cn("w-full h-full flex items-center justify-center bg-muted text-muted-foreground", className)}>
        <ImageIcon className="h-8 w-8"/>
      </div>);
    }
    return <img src={signedUrl} alt={alt} className={className} {...props}/>;
}
