"use client";

import { useState } from "react";
import { getVarietyFallback } from "@/lib/imageUtils";

interface SafeImageProps {
    src?: string;
    alt: string;
    className?: string;
    fallback?: string;
}

export function SafeImage({ src, alt, className, fallback }: SafeImageProps) {
    const [imgSrc, setImgSrc] = useState(src || fallback || getVarietyFallback(alt));
    const [hasError, setHasError] = useState(false);

    return (
        <img
            src={imgSrc}
            alt={alt}
            className={className}
            onError={() => {
                if (!hasError) {
                    setHasError(true);
                    setImgSrc(fallback || getVarietyFallback(alt));
                }
            }}
        />
    );
}
