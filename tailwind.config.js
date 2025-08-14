import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                'inter': ['Inter', 'sans-serif'],
            },
            
        },
    },
    darkMode: ["class"],
    plugins: [require('daisyui')],

    daisyui: {
        themes: [
            {
                light: {
                    ...require("daisyui/src/theming")["light"],
                    "primary": "#0f1729",
                    "primary-content": "#ffffff",
                    "secondary": "#e9edf2",
                    "secondary-content": "#ffffff",
                    "accent": "#0ea5e9",
                    "neutral": "#374151",
                    "base-100": "#ffffff",
                    "base-200": "#f8fafc",
                    "base-300": "#e2e8f0",
                    "info": "#3b82f6",
                    "success": "#10b981",
                    "warning": "#f59e0b",
                    "error": "#ef4444",
                },
                
            },
           
        ],
        base: true,
        styled: true,
        utils: true,
    },
};
