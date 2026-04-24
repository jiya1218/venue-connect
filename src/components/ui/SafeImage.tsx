"use client";

import { useState } from "react";

interface SafeImageProps {
    src?: string;
    alt: string;
    className?: string;
    fallback?: string;
}

const DEFAULT_FALLBACK = "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80";

export function SafeImage({ src, alt, className, fallback = DEFAULT_FALLBACK }: SafeImageProps) {
    const [imgSrc, setImgSrc] = useState(src || fallback);
    const [hasError, setHasError] = useState(false);

    return (
        <img
            src={imgSrc}
            alt={alt}
            className={className}
            onError={() => {
                if (!hasError) {
                    setHasError(true);
                    setImgSrc(fallback);
                }
            }}
        />
    );
}
