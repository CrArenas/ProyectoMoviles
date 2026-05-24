@extends('admin.layout')

@section('content')
    <div class="hero">
        <h1>Dashboard administrativo</h1>
        <p>Vista general del hotel y accesos rápidos a cada módulo del monolito.</p>
    </div>

    <div class="content-grid stats">
        @foreach ($counts as $key => $value)
            <div class="card stat">
                <div class="label">{{ ucfirst(str_replace('_', ' ', $key)) }}</div>
                <div class="value">{{ $value }}</div>
            </div>
        @endforeach
    </div>

    <div class="grid-2" style="margin-top: 20px;">
        <div class="table-card section">
            <div class="section-head">
                <div>
                    <h2>Accesos rápidos</h2>
                    <p class="muted">Navega por los módulos principales del sistema.</p>
                </div>
            </div>

            <div class="content-grid" style="grid-template-columns: repeat(2, minmax(0, 1fr));">
                @foreach ($resources as $resource)
                    <a class="card stat" href="{{ route('admin.resource.index', ['resource' => $resource['key']]) }}">
                        <div class="label">{{ $resource['label'] }}</div>
                        <div class="value" style="font-size: 22px;">Abrir</div>
                    </a>
                @endforeach
            </div>
        </div>

        <div class="table-card section">
            <h2>Orientación visual</h2>
            <p class="muted">El panel sigue una composición de bloques: encabezado informativo, tarjetas de estado, navegación lateral y formularios claros para edición de datos, alineado con el wireframe del monolito descrito en el informe.</p>
            <div class="card stat" style="margin-top: 18px; background: #eff6ff;">
                <div class="label">Flujo</div>
                <div style="font-weight: 700; line-height: 1.6;">Login → Dashboard → Módulo → Lista → Crear / Editar / Eliminar</div>
            </div>
        </div>
    </div>
@endsection