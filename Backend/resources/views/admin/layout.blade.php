<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title ?? 'Roomix Admin' }}</title>
    <style>
        :root {
            --bg: #0f172a;
            --panel: #111827;
            --panel-soft: #1f2937;
            --card: #ffffff;
            --text: #0f172a;
            --muted: #6b7280;
            --accent: #2563eb;
            --accent-soft: #dbeafe;
            --danger: #dc2626;
            --success: #16a34a;
            --border: #e5e7eb;
        }
        * { box-sizing: border-box; }
        body {
            margin: 0;
            font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%);
            color: var(--text);
        }
        a { color: inherit; text-decoration: none; }
        .shell { display: flex; min-height: 100vh; }
        .sidebar {
            width: 270px;
            background: linear-gradient(180deg, #0f172a 0%, #111827 100%);
            color: #fff;
            padding: 28px 20px;
            position: sticky;
            top: 0;
            height: 100vh;
        }
        .brand { font-size: 24px; font-weight: 800; letter-spacing: .4px; }
        .brand span { color: #60a5fa; }
        .sidebar p { color: #cbd5e1; line-height: 1.5; margin: 12px 0 24px; font-size: 14px; }
        .nav a {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 14px;
            border-radius: 14px;
            margin-bottom: 8px;
            color: #e5e7eb;
        }
        .nav a.active, .nav a:hover { background: rgba(96, 165, 250, .18); color: #fff; }
        .main { flex: 1; padding: 28px; }
        .topbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
        }
        .badge { display: inline-flex; padding: 8px 12px; border-radius: 999px; background: var(--accent-soft); color: var(--accent); font-weight: 700; font-size: 13px; }
        .logout-btn, .btn, .btn-danger, .btn-ghost {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            border: none;
            border-radius: 14px;
            padding: 12px 16px;
            font-weight: 700;
            cursor: pointer;
        }
        .logout-btn, .btn { background: var(--accent); color: #fff; }
        .btn-danger { background: var(--danger); color: #fff; }
        .btn-ghost { background: #fff; color: var(--text); border: 1px solid var(--border); }
        .card, .table-card, .hero {
            background: rgba(255,255,255,.84);
            backdrop-filter: blur(14px);
            border: 1px solid rgba(255,255,255,.7);
            border-radius: 24px;
            box-shadow: 0 20px 45px rgba(15, 23, 42, .08);
        }
        .content-grid { display: grid; gap: 20px; }
        .stats { grid-template-columns: repeat(5, minmax(0, 1fr)); }
        .stat { padding: 20px; }
        .stat .label { color: var(--muted); font-size: 13px; margin-bottom: 8px; }
        .stat .value { font-size: 32px; font-weight: 800; }
        .section { padding: 24px; }
        .section h2, .section h3 { margin-top: 0; }
        .muted { color: var(--muted); }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 14px 12px; text-align: left; border-bottom: 1px solid var(--border); vertical-align: top; }
        th { font-size: 12px; text-transform: uppercase; letter-spacing: .06em; color: var(--muted); }
        .table-actions { display: flex; gap: 10px; flex-wrap: wrap; }
        .grid-2 { display: grid; grid-template-columns: 1.2fr .8fr; gap: 20px; }
        .form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
        .field { display: flex; flex-direction: column; gap: 8px; }
        .field label { font-weight: 700; font-size: 14px; }
        .field input, .field select, .field textarea {
            width: 100%;
            padding: 13px 14px;
            border: 1px solid var(--border);
            border-radius: 14px;
            font: inherit;
            background: #fff;
        }
        .field textarea { min-height: 120px; resize: vertical; }
        .field .help { color: var(--muted); font-size: 12px; }
        .actions { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 24px; }
        .alert { padding: 14px 16px; border-radius: 14px; margin-bottom: 20px; }
        .alert-success { background: #dcfce7; color: #166534; }
        .alert-error { background: #fee2e2; color: #991b1b; }
        .hero { padding: 24px; margin-bottom: 20px; }
        .hero h1 { margin: 0 0 10px; font-size: 34px; }
        .hero p { color: var(--muted); margin: 0; line-height: 1.6; }
        .section-head { display: flex; justify-content: space-between; gap: 16px; align-items: center; margin-bottom: 18px; }
        .mobile-only { display: none; }
        @media (max-width: 1100px) {
            .stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            .grid-2 { grid-template-columns: 1fr; }
        }
        @media (max-width: 860px) {
            .shell { flex-direction: column; }
            .sidebar { width: 100%; height: auto; position: relative; }
            .main { padding: 18px; }
            .form-grid { grid-template-columns: 1fr; }
            .stats { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="shell">
        <aside class="sidebar">
            <div class="brand">Room<span>ix</span></div>
            <p>Panel administrativo del monolito. Gestiona roles, tipos de habitación, habitaciones, usuarios y pagos.</p>
            <nav class="nav">
                <a class="{{ request()->routeIs('admin.dashboard') ? 'active' : '' }}" href="{{ route('admin.dashboard') }}">Dashboard</a>
                @php
                    $links = [
                        ['key' => 'roles', 'label' => 'Roles'],
                        ['key' => 'room_types', 'label' => 'Tipos de habitación'],
                        ['key' => 'rooms', 'label' => 'Habitaciones'],
                        ['key' => 'users', 'label' => 'Usuarios'],
                        ['key' => 'payments', 'label' => 'Pagos'],
                    ];
                @endphp
                @foreach ($links as $link)
                    <a
                        class="{{ request()->is('admin/'.$link['key'].'*') ? 'active' : '' }}"
                        href="{{ route('admin.resource.index', ['resource' => $link['key']]) }}"
                    >
                        <span>{{ $link['label'] }}</span>
                        <span>›</span>
                    </a>
                @endforeach
            </nav>
        </aside>

        <main class="main">
            <div class="topbar">
                <div>
                    <div class="badge">Monolito administrador</div>
                    @isset($title)
                        <h1 style="margin: 10px 0 0;">{{ $title }}</h1>
                    @endisset
                </div>
                <form method="POST" action="{{ route('logout') }}">
                    @csrf
                    <button class="logout-btn" type="submit">Cerrar sesión</button>
                </form>
            </div>

            @if (session('success'))
                <div class="alert alert-success">{{ session('success') }}</div>
            @endif

            @if ($errors->any())
                <div class="alert alert-error">
                    {{ $errors->first() }}
                </div>
            @endif

            @yield('content')
        </main>
    </div>
</body>
</html>