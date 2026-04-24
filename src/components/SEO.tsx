"use client";

import { usePathname } from 'next/navigation';
import Head from 'next/head';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  type?: string;
  name?: string;
  url?: string;
  image?: string;
  jsonLd?: object | string;
}

export default function SEO({ 
  title, 
  description, 
  name = "VenueConnect", 
  type = "website", 
  keywords,
  url = "",
  image = "https://venueconnect.in/og-image.jpg",
  jsonLd
}: SEOProps) {
  const pathname = usePathname();
  const canonicalUrl = url || `https://venueconnect.in${pathname}`;
  
  return (
    <Head>
      {/* Standard metadata tags */}
      <title>{title}</title>
      <meta name='description' content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Canonical link */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph tags for social media sharing */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      {image && <meta property="og:image" content={image} />}
      <meta property="og:site_name" content={name} />

      {/* Twitter tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {/* Structured Data (AEO Optimization) */}
      {jsonLd && (
        <script type="application/ld+json">
          {typeof jsonLd === 'string' ? jsonLd : JSON.stringify(jsonLd)}
        </script>
      )}
    </Head>
  );
}
