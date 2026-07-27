import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { CheckCircle2, Info, XCircle } from 'lucide-react';

const TYPES = {
    success: { cls: 'alert-success', Icon: CheckCircle2 },
    info: { cls: 'alert-info', Icon: Info },
    error: { cls: 'alert-error', Icon: XCircle },
};

// Renders session flash (success/info/error) as a dismissible daisyUI alert.
export default function FlashAlert() {
    const { flash } = usePage().props;
    const [visible, setVisible] = useState(true);

    const type = flash?.success ? 'success' : flash?.info ? 'info' : flash?.error ? 'error' : null;
    const message = type ? flash[type] : null;

    // Re-show whenever a new flash message arrives.
    useEffect(() => {
        if (message) setVisible(true);
    }, [message]);

    if (!message || !visible) return null;

    const { cls, Icon } = TYPES[type];

    return (
        <div className={`alert ${cls} shadow`}>
            <Icon className="w-5 h-5" />
            <span className="flex-1">{message}</span>
            <button type="button" className="btn btn-sm btn-ghost" onClick={() => setVisible(false)}>✕</button>
        </div>
    );
}
