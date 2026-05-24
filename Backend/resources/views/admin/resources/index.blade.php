@extends('admin.layout')

@section('content')
    <div class="section-head">
        <div>
            <h2>{{ $config['label'] }}</h2>
            <p class="muted">Listado y administración de registros del módulo.</p>
        </div>

        @if ($config['allowCreate'])
            <a class="btn" href="{{ route('admin.resource.create', ['resource' => $resource]) }}">Nuevo registro</a>
        @endif
    </div>

    <div class="table-card section">
        <table>
            <thead>
                <tr>
                    @foreach ($config['columns'] as $column)
                        <th>{{ $column['label'] }}</th>
                    @endforeach
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($items as $item)
                    <tr>
                        @foreach ($config['columns'] as $column)
                            <td>{{ data_get($item, $column['key']) ?? '—' }}</td>
                        @endforeach
                        <td>
                            <div class="table-actions">
                                <a class="btn-ghost" href="{{ route('admin.resource.show', ['resource' => $resource, 'id' => $item->id]) }}">Ver</a>
                                @if ($config['allowEdit'])
                                    <a class="btn-ghost" href="{{ route('admin.resource.edit', ['resource' => $resource, 'id' => $item->id]) }}">Editar</a>
                                @endif
                                <form method="POST" action="{{ route('admin.resource.destroy', ['resource' => $resource, 'id' => $item->id]) }}" onsubmit="return confirm('¿Eliminar este registro?');">
                                    @csrf
                                    @method('DELETE')
                                    <button class="btn-danger" type="submit">Eliminar</button>
                                </form>
                            </div>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="{{ count($config['columns']) + 1 }}" class="muted">No hay registros para mostrar.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    <div style="margin-top: 18px;">
        {{ $items->links() }}
    </div>
@endsection