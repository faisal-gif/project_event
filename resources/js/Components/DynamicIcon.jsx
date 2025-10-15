import React, { lazy, Suspense } from 'react';
import { icons } from 'lucide-react';

const DynamicIcon = ({ name, ...props }) => {
    const LucideIcon = lazy(() => import('lucide-react').then(module => ({
        default: module[name]
    })));

    if (!icons[name]) {
        return null;
    }

    return (
        <Suspense fallback={<div>...</div>}>
            <LucideIcon {...props} />
        </Suspense>
    );
};

export default DynamicIcon;
