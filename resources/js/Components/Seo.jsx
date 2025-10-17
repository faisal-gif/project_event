import React from 'react';
import { Head } from '@inertiajs/react';

export default function Seo({ title, description, image, url, type = 'article' }) {
    const siteName = "TIMESEvents"; 

    return (
        <Head>
            <title>{`${title} - ${siteName}`}</title>
            <meta name="description" content={description} />

            <meta property="og:site_name" content={siteName} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content={type} />
            {url && <meta property="og:url" content={url} />}
            {image && <meta property="og:image" content={image} />}

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            {image && <meta name="twitter:image" content={image} />}
        </Head>
    );
}