import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const LIGHT = 'times';
const DARK = 'times-dark';

export default function ThemeToggle({ className = '' }) {
    const [theme, setTheme] = useState(LIGHT);

    // Sinkron dengan tema yang sudah di-set skrip anti-flash di <head>.
    useEffect(() => {
        setTheme(document.documentElement.getAttribute('data-theme') === DARK ? DARK : LIGHT);
    }, []);

    const toggle = () => {
        const next = theme === DARK ? LIGHT : DARK;
        document.documentElement.setAttribute('data-theme', next);
        try {
            localStorage.setItem('theme', next);
        } catch (e) {}
        setTheme(next);
    };

    const isDark = theme === DARK;

    return (
        <button
            type="button"
            onClick={toggle}
            className={`btn btn-ghost btn-circle ${className}`}
            title={isDark ? 'Mode terang' : 'Mode gelap'}
            aria-label="Ganti tema"
        >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    );
}
