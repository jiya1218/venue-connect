"use client";

import { useState } from "react";
import Image from "next/image";
import { getVarietyFallback } from "@/lib/imageUtils";

interface SafeImageProps {
    src?: string;
    alt: string;
    className?: string;
    fallback?: string;
    fill?: boolean;
    width?: number;
    height?: number;
    priority?: boolean;
    sizes?: string;
}

export function SafeImage({ 
    src, 
    alt, 
    className, 
    fallback, 
    fill, 
    width, 
    height, 
    priority = false,
    sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
}: SafeImageProps) {
    const [errorSrc, setErrorSrc] = useState<string | null>(null);
    const finalSrc = errorSrc || src || fallback || getVarietyFallback(alt);

    const handleError = () => {
        if (!errorSrc) {
            setErrorSrc(fallback || getVarietyFallback(alt));
        }
    };

    return (
        <Image 
            src={finalSrc}
            alt={alt}
            className={className}
            onError={handleError}
            priority={priority}
            {...(fill ? { fill: true, sizes } : { width: width || 800, height: height || 600 })}
        />
    );
}
