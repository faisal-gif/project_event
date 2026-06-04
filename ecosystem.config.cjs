module.exports = {
    apps: [
        // 1. Konfigurasi untuk Laravel Queue Worker (Background Jobs)
        {
            name: "times-event-queue",
            script: "artisan",
            args: "queue:work --sleep=3 --tries=3 --max-time=3600",
            interpreter: "php", // Menggunakan PHP untuk menjalankan artisan
            cwd: "/path/to/your/laravel-project", // Ganti dengan path absolut project Laravel kamu
            instances: 1, // Biasanya 1 sudah cukup, tambah jika antrean sangat padat
            autorestart: true,
            watch: false,
            max_memory_restart: "256M", // Restart otomatis jika memakan RAM terlalu besar
            error_file: "./storage/logs/pm2-queue-error.log",
            out_file: "./storage/logs/pm2-queue-out.log",
            env: {
                APP_ENV: "production",
            }
        },
    ]
};