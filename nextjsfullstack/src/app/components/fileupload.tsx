"use client" // This component must be a client component

import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/next";
import { useRef, useState } from "react";

interface FileUpoadProps {
    onSuccess: (res: any) => void,
    onProgress?: (progress: number) => void,
    fileType?: "image" | "video"
}

// UploadExample component demonstrates file uploading using ImageKit's Next.js SDK.
const FileUpload = ({ onSuccess, onProgress, fileType }: FileUpoadProps) => {
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    //optional validation...
    const validateFile = (file: File) => {
        if (fileType === "video") {
            if (!file.type.startsWith("video/")) {
                setError("Please upload a valid video file.")
            }
        }
        if (file.size > 100 * 1024 * 1024) {
            setError("File size must be less than 100MB.")
        }
        return true;
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !validateFile(file)) {
            return
        }
        setUploading(true)
        setError(null)

        try {
            const authRes = await fetch("/api/auth/imagekit-auth")
            const auth = await authRes.json()

            const res = await upload({
                file,
                expire: auth.expire,
                token: auth.token,
                signature: auth.signature,
                publicKey: process.env.IMAGEKIT_PUBLIC_PUBLIC_KEY!,
                fileName: file.name,
                onProgress: (event) => {
                    if (event.lengthComputable && onProgress) {
                        const percent = (event.loaded / event.total) * 100;
                        onProgress(Math.round(percent))
                    }
                },
            });
            onSuccess(res)
        } catch (error) {
            console.error("Uploading Failed.")
        } finally {
            setUploading(false)
        }
    }

    return (
        <>
            <input
                type="file"
                accept={fileType === "video" ? "video/*" : "image/*"}
                onChange={handleFileChange}
            />
            {uploading && (
                <span>
                    Loading...
                </span>

            )}
        </>
    );
};

export default FileUpload;