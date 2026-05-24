@extends('admin.layout')

@section('content')

<div class="hero">
    <h1>Dashboard administrativo</h1>
    <p>
        Vista general del hotel y accesos rápidos
        a cada módulo del sistema.
    </p>

</div>

<div
    style="
        display:grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap:20px;
        margin-top:25px;
    "
>
    <div class="card stat">
        <div class="label">
            Total habitaciones
        </div>
        <div class="value">
            {{ $stats['total_rooms'] }}
        </div>
    </div>
    <div class="card stat">
        <div class="label">
            Habitaciones libres
        </div>
        <div class="value">
            {{ $stats['available_rooms'] }}
        </div>
    </div>
    <div class="card stat">
        <div class="label">
            Habitaciones reservadas
        </div>
        <div class="value">
            {{ $stats['reserved_rooms'] }}
        </div>
    </div>
    <div class="card stat">
        <div class="label">
            Total dinero del mes
        </div>
        <div class="value">
            ${{ number_format($stats['monthly_revenue'], 0, ',', '.') }}
        </div>
    </div>
</div>

<div
    class="table-card section"
    style="margin-top:25px;"
>
    <div class="section-head">
        <div>
            <h2>
                Reservas de los últimos 10 días
            </h2>
            <p class="muted">
                Cantidad de reservas registradas diariamente.
            </p>
        </div>
    </div>
    <div
        style="
            width:100%;
            height:320px;
            display:flex;
            align-items:flex-end;
            justify-content:space-between;
            gap:12px;
            padding:20px;
            border-radius:12px;
            background:#f8fafc;
        "
    >
        @php
            $maxReservations =
                collect($reservationStats)->max('count');

            $maxReservations =
                $maxReservations <= 0 ? 1 : $maxReservations;
        @endphp
        @foreach ($reservationStats as $stat)
            @php

                $height =
                    ($stat['count'] / $maxReservations) * 220;

            @endphp
            <div
                style="
                    flex:1;
                    display:flex;
                    flex-direction:column;
                    align-items:center;
                    justify-content:flex-end;
                    height:100%;
                "
            >
                <div
                    style="
                        font-size:13px;
                        margin-bottom:8px;
                        font-weight:bold;
                    "
                >
                    {{ $stat['count'] }}
                </div>

                <div
                    style="
                        width:100%;
                        max-width:45px;
                        height:{{ $height }}px;
                        background:#3b82f6;
                        border-radius:10px 10px 0 0;
                        transition:0.3s;
                    "
                ></div>
                <div
                    style="
                        margin-top:10px;
                        font-size:13px;
                        color:#64748b;
                    "
                >
                    {{ $stat['day'] }}
                </div>
            </div>
        @endforeach
    </div>
</div>

<div style="margin-top: 25px; width: 100%;">
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
                width:100%;
                display:grid;
                grid-template-columns:
                    repeat(auto-fit, minmax(250px, 1fr));
                gap:20px;
            "
        >
            @foreach ($resources as $resource)
                <a
                    class="card stat"
                    href="{{ route('admin.resource.index', [
                        'resource' => $resource['key']
                    ]) }}"
                    style="
                        width:100%;
                        text-decoration:none;
                    "
                >
                    <div class="label">
                        {{ $resource['label'] }}
                    </div>
                    <div
                        class="value"
                        style="font-size:22px;"
                    >
                        Abrir
                    </div>
                </a>
            @endforeach
        </div>
    </div>
</div>

@endsection