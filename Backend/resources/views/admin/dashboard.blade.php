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

    <div style="margin-top: 20px; width: 100%;">
        <div class="table-card section">
            <div class="section-head">
                <div>
                    <h2>Accesos rápidos</h2>
                    <p class="muted">
                        Navega por los módulos principales del sistema.
                    </p>
                </div>
            </div>
            <div
                class="content-grid"
                style="
                    width: 100%;
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                "
            >
                @foreach ($resources as $resource)
                    <a
                        class="card stat"
                        href="{{ route('admin.resource.index', [
                            'resource' => $resource['key']
                        ]) }}"
                        style="width: 100%;"
                    >
                        <div class="label">
                            {{ $resource['label'] }}
                        </div>
                        <div
                            class="value"
                            style="font-size: 22px;"
                        >
                            Abrir
                        </div>
                    </a>
                @endforeach
            </div>
        </div>
    </div>
@endsection