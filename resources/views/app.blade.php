<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
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

    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>
