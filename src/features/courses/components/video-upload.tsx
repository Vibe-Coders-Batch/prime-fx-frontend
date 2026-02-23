"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle, X, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import axios from "axios";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
interface VideoUploadProps {
    currentUrl?: string | null;
    onUploadComplete: (url: string) => void;
    onDurationChange?: (duration: number) => void;
    courseId: string;
    lessonId: string;
}
export function VideoUpload({ currentUrl, onUploadComplete, onDurationChange, courseId, lessonId, }: VideoUploadProps) {
    const [removed, setRemoved] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [encoding, setEncoding] = useState(false);
    const startEncodingJob = async () => {
        setEncoding(true);
        try {
            await apiClient.post(`/video-encoding/start/${lessonId}`);
            toast.success("Encoding started. You'll be notified when it's complete.");
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message || "Failed to start encoding");
        } finally {
            setEncoding(false);
        }
    };
    const handleRemove = () => {
        onUploadComplete("");
        setRemoved(true);
    };
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        if (!file.type.startsWith("video/")) {
            toast.error("Please select a video file");
            return;
        }
        if (onDurationChange) {
            const video = document.createElement("video");
            video.preload = "metadata";
            video.onloadedmetadata = () => {
                window.URL.revokeObjectURL(video.src);
                const durationSeconds = Math.round(video.duration);
                onDurationChange(durationSeconds);
            };
            video.src = URL.createObjectURL(file);
        }
        setUploading(true);
        setProgress(0);
        let uploadData: {
            uploadUrl: string;
            inputPath: string;
            expiresIn: number;
        } | null = null;
        try {
            const response = await apiClient.post<{
                uploadUrl: string;
                inputPath: string;
                expiresIn: number;
            }>("/video-encoding/upload-url", {
                courseId,
                lessonId,
            });
            uploadData = response.data;
            if (!uploadData.uploadUrl || !uploadData.uploadUrl.startsWith("http")) {
                throw new Error("Invalid upload URL received from server");
            }
            await axios.put(uploadData.uploadUrl, file, {
                headers: {
                    "Content-Type": file.type,
                },
                onUploadProgress: (progressEvent) => {
                    let percentCompleted = 0;
                    if (progressEvent.total && progressEvent.total > 0) {
                        percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    }
                    else if (file.size > 0) {
                        percentCompleted = Math.round((progressEvent.loaded * 100) / file.size);
                    }
                    setProgress(Math.min(Math.max(percentCompleted, 0), 100));
                },
                timeout: 300000,
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
                validateStatus: (status) => status < 500,
            });
            setProgress(100);
            toast.success("Video uploaded successfully");
            setUploading(false);
            setEncoding(true);
            onUploadComplete(uploadData.inputPath);
            try {
                const { data: encodingData } = await apiClient.post<{
                    jobId: string;
                    status: string;
                }>(`/video-encoding/start/${lessonId}`);
                toast.success("Encoding started. You'll be notified when it's complete.");
                setEncoding(false);
            }
            catch (error: any) {
                setEncoding(false);
                toast.error(`Failed to start encoding: ${error.response?.data?.message || error.message}`);
            }
        }
        catch (error: any) {
            setProgress(0);
            setUploading(false);
            let errorMessage = "Upload failed";
            if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
                errorMessage =
                    "Network error. This is usually a CORS issue. Please configure S3 bucket CORS settings to allow uploads from your domain.";
            }
            else if (error.response) {
                const status = error.response.status;
                if (status === 403) {
                    errorMessage =
                        "Access denied. Presigned URL may have expired or S3 permissions are incorrect.";
                }
                else if (status === 400) {
                    errorMessage =
                        error.response.data?.message ||
                            "Invalid request. Check file format and size.";
                }
                else {
                    errorMessage =
                        error.response.data?.message ||
                            error.response.statusText ||
                            error.message;
                }
            }
            else {
                errorMessage = error.message || "Unknown error occurred";
            }
            toast.error(errorMessage);
        }
    };
    const showUpload = !currentUrl || removed;
    return (<div className="space-y-4 border rounded-lg p-4 bg-muted/30">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-medium">Video Content</h4>
      </div>

      {currentUrl && !removed && (<div className="flex flex-col gap-2 bg-background p-3 rounded border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4"/>
              <span className="truncate max-w-[200px]">Video uploaded</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleRemove} disabled={uploading || encoding}>
              <X className="h-4 w-4 mr-2"/>
              Remove
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            If encoding did not start, click &quot;Start encoding&quot; to process the video for playback.
          </p>
          <Button variant="outline" size="sm" onClick={startEncodingJob} disabled={uploading || encoding}>
            {encoding ? <><Loader2 className="h-4 w-4 animate-spin mr-2"/> Starting...</> : "Start encoding"}
          </Button>
        </div>)}

      {uploading && (<div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Uploading video...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress}/>
        </div>)}

      {encoding && (<div className="flex items-center gap-2 text-sm text-blue-600">
          <Loader2 className="h-4 w-4 animate-spin"/>
          <span>Starting encoding job...</span>
        </div>)}

      {showUpload && !uploading && (<div className="space-y-2">
          <Input type="file" accept="video/*" onChange={handleFileChange} disabled={uploading || encoding} className="cursor-pointer"/>
          <p className="text-xs text-muted-foreground">
            Supported formats: MP4, MOV, WebM. Max file size: 5GB
          </p>
        </div>)}
    </div>);
}
