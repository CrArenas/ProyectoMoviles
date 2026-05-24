<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Roomix Admin | Login</title>
    <style>
        :root {
            --accent: #2563eb;
            --bg: #f8fafc;
            --panel: rgba(255,255,255,.86);
            --text: #0f172a;
            --muted: #64748b;
            --border: #e2e8f0;
        }
        * { box-sizing: border-box; }
        body {
            margin: 0;
            font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            min-height: 100vh;
            background:
                radial-gradient(circle at top left, rgba(37, 99, 235, .22), transparent 30%),
                radial-gradient(circle at bottom right, rgba(14, 165, 233, .18), transparent 25%),
                linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%);
            color: var(--text);
            display: grid;
            place-items: center;
            padding: 24px;
        }
        .wrap {
            width: min(1100px, 100%);
            display: grid;
            grid-template-columns: 1.1fr .9fr;
            overflow: hidden;
            border-radius: 30px;
            box-shadow: 0 30px 80px rgba(15, 23, 42, .16);
            background: var(--panel);
            backdrop-filter: blur(16px);
            border: 1px solid rgba(255,255,255,.6);
        }
        .hero {
            padding: 42px;
            background: linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%);
            color: #fff;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .brand { font-size: 34px; font-weight: 900; }
        .brand span { color: #93c5fd; }
        .hero h1 { font-size: 44px; line-height: 1.05; margin: 24px 0 14px; }
        .hero p { max-width: 520px; color: rgba(255,255,255,.82); line-height: 1.7; margin: 0; }
        .chips { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 28px; }
        .chip { padding: 10px 14px; border-radius: 999px; background: rgba(255,255,255,.12); color: #e2e8f0; font-size: 13px; }
        .form {
            padding: 42px;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        h2 { margin: 0 0 10px; font-size: 30px; }
        .muted { color: var(--muted); margin: 0 0 28px; line-height: 1.6; }
        .field { display: flex; flex-direction: column; gap: 8px; margin-bottom: 18px; }
        label { font-size: 14px; font-weight: 700; }
        input {
            width: 100%;
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 14px 16px;
            font: inherit;
            background: #fff;
        }
        .btn {
            border: 0;
            border-radius: 16px;
            padding: 14px 18px;
            background: var(--accent);
            color: #fff;
            font-weight: 800;
            cursor: pointer;
            width: 100%;
            margin-top: 8px;
        }
        .error {
            background: #fee2e2;
            color: #991b1b;
            padding: 14px 16px;
            border-radius: 14px;
            margin-bottom: 18px;
        }
        .small { font-size: 13px; color: var(--muted); margin-top: 14px; }
        @media (max-width: 900px) {
            .wrap { grid-template-columns: 1fr; }
            .hero { padding: 28px; }
            .form { padding: 28px; }
        }
    </style>
</head>
<body>
    <div class="wrap">
        <section class="hero">
            <div>
                <div class="brand">Room<span>ix</span></div>
                <h1>Panel administrativo para el hotel.</h1>
                <p>Accede al monolito web para administrar habitaciones, tipos de habitación, usuarios, roles y pagos desde una interfaz clara y consistente con el proyecto móvil.</p>
                <div class="chips">
                    <div class="chip">Login seguro</div>
                    <div class="chip">CRUD administrativo</div>
                    <div class="chip">Sesión web</div>
                </div>
            </div>
            <p class="small" style="color: rgba(255,255,255,.72);">Universidad Nacional de Colombia · Programación con tecnologías móviles</p>
        </section>

        <section class="form">
            <h2>Iniciar sesión</h2>
            <p class="muted">Ingresa con una cuenta administradora para acceder al panel del monolito.</p>

            @if ($errors->any())
                <div class="error">{{ $errors->first() }}</div>
            @endif

            <form method="POST" action="{{ route('login.store') }}">
                @csrf

                <div class="field">
                    <label for="email">Correo</label>
                    <input id="email" type="email" name="email" value="{{ old('email') }}" required autofocus>
                </div>

                <div class="field">
                    <label for="password">Contraseña</label>
                    <input id="password" type="password" name="password" required>
                </div>

                <button class="btn" type="submit">Entrar al panel</button>
            </form>
        </section>
    </div>
</body>
</html>