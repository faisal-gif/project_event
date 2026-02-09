import React, { useEffect, useRef } from 'react';

export default function Modal({
    children,
    show = false,
    maxWidth = '2xl',
    closeable = true,
    onClose = () => { },
}) {
    // 1. Kita butuh 'ref' untuk mengakses elemen <dialog> secara imperatif
    const modalRef = useRef(null);

    // 2. Map 'maxWidth' prop ke class DaisyUI (tanpa prefix 'sm:')
    const maxWidthClass = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl' : 'max-w-3xl',
        '5xl' : 'max-w-5xl',
    }[maxWidth];

    // 3. Gunakan useEffect untuk menyinkronkan prop 'show' dengan .showModal() / .close()
    useEffect(() => {
        const modal = modalRef.current;
        if (!modal) {
            return;
        }

        // Tampilkan modal jika 'show' true dan modal sedang tidak terbuka
        if (show && !modal.open) {
            modal.showModal();
        }
        // Tutup modal jika 'show' false dan modal sedang terbuka
        else if (!show && modal.open) {
            modal.close();
        }
    }, [show]);

    // 4. Gunakan useEffect untuk menangani event 'close' dan 'cancel' dari <dialog>
    useEffect(() => {
        const modal = modalRef.current;
        if (!modal) {
            return;
        }

        // Event 'close' dipicu saat dialog ditutup (baik via ESC, form, atau .close())
        // Kita panggil 'onClose' prop untuk memberi tahu parent agar update state 'show'
        const handleClose = () => {
            if (closeable) {
                onClose();
            }
        };

        // Event 'cancel' dipicu saat tombol 'ESC' ditekan
        const handleCancel = (event) => {
            // Jika 'closeable' false, kita cegah 'ESC' menutup modal
            if (!closeable) {
                event.preventDefault();
            }
        };

        modal.addEventListener('close', handleClose);
        modal.addEventListener('cancel', handleCancel);

        // Cleanup listener saat komponen unmount
        return () => {
            modal.removeEventListener('close', handleClose);
            modal.removeEventListener('cancel', handleCancel);
        };
    }, [closeable, onClose]);

    return (
        // Gunakan ref untuk 'dialog'
        <dialog ref={modalRef} className="modal  modal-bottom sm:modal-middle">
            <div className={`modal-box ${maxWidthClass}`}>
                {closeable && (
                    <form method="dialog" className="modal-backdrop">
                        <button className="btn btn-sm btn-circle absolute right-2 top-2">✕</button>
                    </form>
                )}
                {children}
            </div>

            {/* DaisyUI menggunakan <form method="dialog"> untuk backdrop
              yang bisa diklik untuk menutup modal.
              Kita render ini hanya jika 'closeable' true.
            */}

        </dialog>
    );
}