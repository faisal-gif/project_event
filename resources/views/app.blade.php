<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" data-theme="times">

<head>
    <script>
        // Terapkan tema sebelum render (anti-flash).
        // - ?theme=dark : paksa (mis. iframe embed eksplisit dari situs induk)
        // - halaman widget : ikuti mode gelap sistem/induk (prefers-color-scheme)
        // - halaman biasa : pakai pilihan toggle yang tersimpan
        (function () {
            try {
                var params = new URLSearchParams(location.search);
                var forced = params.get('theme');
                var isWidget = location.pathname.indexOf('/widget') !== -1;
                var t;
                if (forced) {
                    t = forced;
                } else if (isWidget) {
                    t = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'times-dark' : 'times';
                } else {
                    t = localStorage.getItem('theme');
                }
                document.documentElement.setAttribute('data-theme', (t === 'times-dark' || t === 'dark') ? 'times-dark' : 'times');
            } catch (e) {}
        })();
    </script>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">


    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    <meta property="og:title" content="{{ $ogTitle ?? config('app.name', 'Laravel') }}">
    <meta property="og:description" content="{{ $ogDescription ?? 'Tempat mencari event menarik untuk liburanmu' }}">
    <meta property="og:image" content="{{ $ogImage ?? asset('icon/logo-times-event.png') }}">
    <meta property="og:url" content="{{ $ogUrl ?? url()->current() }}">
    <meta property="og:type" content="website">
    <meta property="og:locale" content="id_ID" />
    <meta name="twitter:card" content="summary_large_image">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />




    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
    @inertiaHead
</head>


<!-- Meta (Facebook) Pixel -->
<script>
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', 'YOUR_PIXEL_ID');
    fbq('track', 'PageView');
</script>

<script async src="https://www.googletagmanager.com/gtag/js?id=G-YJY95LNFYX"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-YJY95LNFYX', { 'debug_mode': true });
</script>

<body class="font-sans antialiased">
    @inertia

  
</body>

</html>
