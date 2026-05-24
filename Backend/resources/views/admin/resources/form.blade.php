@extends('admin.layout')

@section('content')

<div class="section-head">
    <div>
        <h2>{{ $config['label'] }}</h2>

        <p class="muted">
            {{
                $mode === 'create'
                ? 'Crear un nuevo registro.'
                : (
                    $mode === 'edit'
                    ? 'Editar el registro seleccionado.'
                    : 'Detalle del registro.'
                )
            }}
        </p>
    </div>

    <a
        class="btn-ghost"
        href="{{ route('admin.resource.index', ['resource' => $resource]) }}"
    >
        Volver al listado
    </a>
</div>

<div class="table-card section">

    <form method="POST" action="{{ $action ?? '#' }}">

        @csrf

        @if ($method && $method !== 'POST')
            @method($method)
        @endif

        <div class="form-grid">

            @foreach ($config['fields'] as $field)

                @php

                    $fieldValue = old(
                        $field['name'],
                        data_get($item, $field['name'])
                    );

                    $isReadonly = $mode === 'show';

                    $isDisabled =
                        $isReadonly
                        || (
                            $field['name'] === 'amount'
                            && $resource === 'payments'
                            && $mode === 'create'
                        );

                    $isRequired =
                        $mode !== 'show'
                        && ($field['required'] ?? false);

                @endphp

                <div
                    class="field"
                    @if (($field['type'] ?? 'text') === 'textarea')
                        style="grid-column: 1 / -1;"
                    @endif
                >

                    <label for="{{ $field['name'] }}">
                        {{ $field['label'] }}
                    </label>

                    @if (($field['type'] ?? 'text') === 'textarea')

                        <textarea
                            id="{{ $field['name'] }}"
                            name="{{ $field['name'] }}"
                            @if ($isDisabled) disabled @endif
                            @if ($isRequired) required @endif
                        >{{ $fieldValue }}</textarea>

                    @elseif (($field['type'] ?? 'text') === 'select')

                        <select
                            id="{{ $field['name'] }}"
                            name="{{ $field['name'] }}"
                            @if ($isDisabled) disabled @endif
                            @if ($isRequired) required @endif
                        >

                            <option value="">
                                Selecciona una opción
                            </option>

                            @foreach ($field['options'] ?? [] as $option)

                                <option
                                    value="{{ $option['value'] }}"
                                    @selected(
                                        (string) $fieldValue
                                        === (string) $option['value']
                                    )
                                >
                                    {{ $option['label'] }}
                                </option>

                            @endforeach

                        </select>

                    @else

                        <input
                            id="{{ $field['name'] }}"
                            type="{{ $field['type'] ?? 'text' }}"
                            name="{{ $field['name'] }}"
                            value="{{ $fieldValue }}"

                            @if (!empty($field['step']))
                                step="{{ $field['step'] }}"
                            @endif

                            @if ($isDisabled)
                                disabled
                            @endif

                            @if ($isRequired)
                                required
                            @endif

                            @if (
                                $field['name'] === 'password'
                                && $mode === 'edit'
                            )
                                placeholder="Dejar en blanco para conservar la contraseña"
                            @endif
                        >

                    @endif

                    @error($field['name'])

                        <span
                            style="
                                color:red;
                                font-size:13px;
                                margin-top:4px;
                                display:block;
                            "
                        >
                            {{ $message }}
                        </span>

                    @enderror

                    @if (
                        $field['name'] === 'amount'
                        && $resource === 'payments'
                    )

                        <div class="help">
                            En pagos, el monto puede ajustarse manualmente
                            o mantenerse según la reserva.
                        </div>

                    @endif

                </div>

            @endforeach

        </div>

        @if ($mode !== 'show')

            <div class="actions">

                <button class="btn" type="submit">
                    Guardar cambios
                </button>

                <a
                    class="btn-ghost"
                    href="{{ route('admin.resource.index', ['resource' => $resource]) }}"
                >
                    Cancelar
                </a>

            </div>

        @endif

    </form>

    @if ($mode === 'show')

        <div class="actions">

            @if ($config['allowEdit'])

                <a
                    class="btn"
                    href="{{ route('admin.resource.edit', [
                        'resource' => $resource,
                        'id' => $item->id
                    ]) }}"
                >
                    Editar
                </a>

            @endif

            <form
                method="POST"
                action="{{ route('admin.resource.destroy', [
                    'resource' => $resource,
                    'id' => $item->id
                ]) }}"
                onsubmit="return confirm('¿Eliminar este registro?');"
            >

                @csrf
                @method('DELETE')

                <button class="btn-danger" type="submit">
                    Eliminar
                </button>

            </form>

        </div>

    @endif

</div>

@endsection