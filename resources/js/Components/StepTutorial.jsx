import { useEffect, useState } from 'react';
import Modal from '@/Components/Modal';

// Reusable step-by-step onboarding modal.
// - steps: [{ icon, title, desc }]
// - storageKey: localStorage flag so it auto-opens only once
// - autoOpen: show automatically on mount (once, gated by storageKey)
// - eventName: window event that re-opens it (e.g. from a "Panduan" button)
export default function StepTutorial({ steps, storageKey, autoOpen = false, eventName }) {
    const [show, setShow] = useState(false);
    const [i, setI] = useState(0);

    useEffect(() => {
        if (autoOpen && storageKey && !localStorage.getItem(storageKey)) {
            localStorage.setItem(storageKey, '1'); // tandai langsung agar tak muncul lagi saat pindah halaman
            setI(0);
            setShow(true);
        }
    }, [autoOpen]);

    useEffect(() => {
        if (!eventName) return;
        const open = () => { setI(0); setShow(true); };
        window.addEventListener(eventName, open);
        return () => window.removeEventListener(eventName, open);
    }, [eventName]);

    const close = () => setShow(false);
    const step = steps[i];
    const Icon = step.icon;
    const isLast = i === steps.length - 1;

    return (
        <Modal show={show} onClose={close} maxWidth="md">
            <div className="text-center p-2">
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-base-content/70">{step.desc}</p>

                <div className="flex justify-center gap-1.5 my-5">
                    {steps.map((_, idx) => (
                        <span key={idx} className={`w-2 h-2 rounded-full transition ${idx === i ? 'bg-primary' : 'bg-base-300'}`} />
                    ))}
                </div>

                <div className="flex items-center justify-between gap-2">
                    <button type="button" className="btn btn-ghost btn-sm" onClick={close}>Lewati</button>
                    <div className="flex gap-2">
                        {i > 0 && (
                            <button type="button" className="btn btn-outline btn-sm" onClick={() => setI(i - 1)}>Sebelumnya</button>
                        )}
                        {!isLast ? (
                            <button type="button" className="btn btn-primary btn-sm" onClick={() => setI(i + 1)}>Lanjut</button>
                        ) : (
                            <button type="button" className="btn btn-primary btn-sm" onClick={close}>Selesai</button>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
}
