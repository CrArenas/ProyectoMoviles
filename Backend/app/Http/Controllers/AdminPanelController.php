<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Reservation;
use App\Models\Role;
use App\Models\Room;
use App\Models\RoomType;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AdminPanelController extends Controller
{
    public function showLogin()
    {
        if (Auth::check() && Auth::user()?->role?->label === 'admin') {
            return redirect()->route('admin.dashboard');
        }

        return view('admin.auth.login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (!Auth::attempt($credentials, $request->boolean('remember'))) {
            return back()
                ->withErrors(['email' => 'Credenciales inválidas'])
                ->onlyInput('email');
        }

        $request->session()->regenerate();

        $user = Auth::user();

        if (!$user?->role || $user->role->label !== 'admin') {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return back()->withErrors([
                'email' => 'No tienes permisos para acceder al panel administrativo'
            ]);
        }

        return redirect()->route('admin.dashboard');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }

    public function dashboard()
    {
        $totalRooms = Room::count();

        $availableRooms = Room::where('status', 'Disponible')
            ->count();

        $reservedRooms = Reservation::whereIn('status', [
                'Activa',
                'Pendiente de pago'
            ])
            ->count();

        $monthlyRevenue = Payment::whereMonth('date', now()->month)
            ->whereYear('date', now()->year)
            ->sum('amount');

        $reservationStats = [];

        for ($i = 9; $i >= 0; $i--) {

            $date = now()->subDays($i);

            $count = Reservation::whereDate('created_at', $date)
                ->count();

            $reservationStats[] = [
                'day' => $date->format('d'),
                'count' => $count,
            ];
        }

        return view('admin.dashboard', [

            'stats' => [
                'total_rooms' => $totalRooms,
                'available_rooms' => $availableRooms,
                'reserved_rooms' => $reservedRooms,
                'monthly_revenue' => $monthlyRevenue,
            ],

            'reservationStats' => $reservationStats,

            'resources' => $this->adminResources(),
        ]);
    }

    public function index(string $resource)
    {
        $config = $this->resourceConfig($resource);

        $items = $config['query']();

        return view('admin.resources.index', [
            'resource' => $resource,
            'config' => $config,
            'items' => $items,
        ]);
    }

    public function create(string $resource)
    {
        $config = $this->resourceConfig($resource);

        if (!$config['allowCreate']) {
            abort(404);
        }

        return view('admin.resources.form', [
            'resource' => $resource,
            'config' => $config,
            'item' => null,
            'mode' => 'create',
            'action' => route('admin.resource.store', ['resource' => $resource]),
            'method' => 'POST',
        ]);
    }

    public function store(Request $request, string $resource)
    {
        $config = $this->resourceConfig($resource);

        if (!$config['allowCreate']) {
            abort(404);
        }

        $rules = $config['rules']['create'];

        if ($rules instanceof \Closure) {
            $rules = $rules();
        }

        $validated = $request->validate($rules);

        $validated = $this->preparePayload(
            $resource,
            $validated,
            'create'
        );

        $model = $config['model'];

        $model::create($validated);

        return redirect()
            ->route('admin.resource.index', [
                'resource' => $resource
            ])
            ->with('success', 'Registro creado correctamente');
    }

    public function show(string $resource, int $id)
    {
        $config = $this->resourceConfig($resource);

        $item = $this->findResourceItem($config, $id);

        return view('admin.resources.form', [
            'resource' => $resource,
            'config' => $config,
            'item' => $item,
            'mode' => 'show',
            'action' => null,
            'method' => null,
        ]);
    }

    public function edit(string $resource, int $id)
    {
        $config = $this->resourceConfig($resource);

        if (!$config['allowEdit']) {
            abort(404);
        }

        $item = $this->findResourceItem($config, $id);

        return view('admin.resources.form', [
            'resource' => $resource,
            'config' => $config,
            'item' => $item,
            'mode' => 'edit',
            'action' => route('admin.resource.update', [
                'resource' => $resource,
                'id' => $id
            ]),
            'method' => 'PUT',
        ]);
    }

    public function update(Request $request, string $resource, int $id)
    {
        $config = $this->resourceConfig($resource);

        $item = $this->findResourceItem($config, $id);

        $rules = $config['rules']['update'];

        if ($rules instanceof \Closure) {
            $rules = $rules($id);
        }

        $validated = $request->validate($rules);

        $validated = $this->preparePayload(
            $resource,
            $validated,
            'update',
            $item
        );

        $item->update($validated);

        return redirect()
            ->route('admin.resource.index', [
                'resource' => $resource
            ])
            ->with('success', 'Registro actualizado correctamente');
    }

    public function destroy(string $resource, int $id)
    {
        $config = $this->resourceConfig($resource);

        $item = $this->findResourceItem($config, $id);

        $item->delete();

        return redirect()
            ->route('admin.resource.index', [
                'resource' => $resource
            ])
            ->with('success', 'Registro eliminado correctamente');
    }

    private function adminResources(): array
    {
        return [
            ['key' => 'roles', 'label' => 'Roles'],
            ['key' => 'room_types', 'label' => 'Tipos de habitación'],
            ['key' => 'rooms', 'label' => 'Habitaciones'],
            ['key' => 'users', 'label' => 'Usuarios'],
            ['key' => 'payments', 'label' => 'Pagos'],
        ];
    }

    private function resourceConfig(string $resource): array
    {
        $resources = [

            'roles' => [
                'label' => 'Roles',
                'model' => Role::class,
                'allowCreate' => true,
                'allowEdit' => true,

                'query' => fn () =>
                    Role::orderByDesc('id')->paginate(10),

                'with' => [],

                'columns' => [
                    ['label' => 'ID', 'key' => 'id'],
                    ['label' => 'Nombre', 'key' => 'name'],
                    ['label' => 'Etiqueta', 'key' => 'label'],
                ],

                'fields' => [
                    [
                        'name' => 'name',
                        'label' => 'Nombre',
                        'type' => 'text',
                        'required' => true
                    ],
                    [
                        'name' => 'label',
                        'label' => 'Etiqueta',
                        'type' => 'text',
                        'required' => true
                    ],
                ],

                'rules' => [
                    'create' => [
                        'name' => ['required', 'string', 'max:255'],
                        'label' => ['required', 'string', 'max:255'],
                    ],

                    'update' => fn (int $id = null) => [
                        'name' => ['required', 'string', 'max:255'],
                        'label' => ['required', 'string', 'max:255'],
                    ],
                ],
            ],

            'room_types' => [
                'label' => 'Tipos de habitación',
                'model' => RoomType::class,
                'allowCreate' => true,
                'allowEdit' => true,

                'query' => fn () =>
                    RoomType::orderByDesc('id')->paginate(10),

                'with' => [],

                'columns' => [
                    ['label' => 'ID', 'key' => 'id'],
                    ['label' => 'Nombre', 'key' => 'name'],
                ],

                'fields' => [
                    [
                        'name' => 'name',
                        'label' => 'Nombre',
                        'type' => 'text',
                        'required' => true
                    ],
                ],

                'rules' => [
                    'create' => [
                        'name' => ['required', 'string', 'max:255'],
                    ],

                    'update' => fn (int $id = null) => [
                        'name' => ['required', 'string', 'max:255'],
                    ],
                ],
            ],

            'rooms' => [
                'label' => 'Habitaciones',
                'model' => Room::class,
                'allowCreate' => true,
                'allowEdit' => true,

                'query' => fn () =>
                    Room::with('roomType')
                        ->orderByDesc('id')
                        ->paginate(10),

                'with' => ['roomType'],

                'columns' => [
                    ['label' => 'ID', 'key' => 'id'],
                    ['label' => 'Número', 'key' => 'number'],
                    ['label' => 'Tipo', 'key' => 'roomType.name'],
                    ['label' => 'Precio', 'key' => 'price'],
                    ['label' => 'Estado', 'key' => 'status'],
                ],

                'fields' => [
                    [
                        'name' => 'number',
                        'label' => 'Número',
                        'type' => 'text',
                        'required' => true
                    ],

                    [
                        'name' => 'room_type_id',
                        'label' => 'Tipo de habitación',
                        'type' => 'select',
                        'required' => true,

                        'options' => fn () =>
                            RoomType::orderBy('name')
                                ->get()
                                ->map(fn ($roomType) => [
                                    'value' => $roomType->id,
                                    'label' => $roomType->name,
                                ])->all(),
                    ],

                    [
                        'name' => 'price',
                        'label' => 'Precio',
                        'type' => 'number',
                        'step' => '0.01',
                        'required' => true
                    ],

                    [
                        'name' => 'status',
                        'label' => 'Estado',
                        'type' => 'select',
                        'required' => true,

                        'options' => [
                            [
                                'value' => 'disponible',
                                'label' => 'Disponible'
                            ],
                            [
                                'value' => 'ocupada',
                                'label' => 'Ocupada'
                            ],
                            [
                                'value' => 'mantenimiento',
                                'label' => 'Mantenimiento'
                            ],
                        ],
                    ],

                    [
                        'name' => 'description',
                        'label' => 'Descripción',
                        'type' => 'textarea',
                        'required' => true
                    ],
                ],

                'rules' => [
                    'create' => fn () => [
                        'number' => [
                            'required',
                            'string',
                            'max:255',
                            'unique:rooms,number'
                        ],

                        'room_type_id' => [
                            'required',
                            'integer',
                            'exists:room_types,id'
                        ],

                        'price' => [
                            'required',
                            'numeric',
                            'min:0'
                        ],

                        'status' => [
                            'required',
                            Rule::in([
                                'disponible',
                                'ocupada',
                                'mantenimiento'
                            ])
                        ],

                        'description' => [
                            'required',
                            'string',
                            'max:255'
                        ],
                    ],

                    'update' => fn (int $id) => [
                        'number' => [
                            'required',
                            'string',
                            'max:255',
                            Rule::unique('rooms', 'number')->ignore($id)
                        ],

                        'room_type_id' => [
                            'required',
                            'integer',
                            'exists:room_types,id'
                        ],

                        'price' => [
                            'required',
                            'numeric',
                            'min:0'
                        ],

                        'status' => [
                            'required',
                            Rule::in([
                                'disponible',
                                'ocupada',
                                'mantenimiento'
                            ])
                        ],

                        'description' => [
                            'required',
                            'string',
                            'max:255'
                        ],
                    ],
                ],
            ],

            'users' => [
                'label' => 'Usuarios',
                'model' => User::class,
                'allowCreate' => true,
                'allowEdit' => true,

                'query' => fn () =>
                    User::with('role')
                        ->orderByDesc('id')
                        ->paginate(10),

                'with' => ['role'],

                'columns' => [
                    ['label' => 'ID', 'key' => 'id'],
                    ['label' => 'Nombre', 'key' => 'name'],
                    ['label' => 'Apellido', 'key' => 'last_name'],
                    ['label' => 'Correo', 'key' => 'email'],
                    ['label' => 'Rol', 'key' => 'role.label'],
                ],

                'fields' => [
                    [
                        'name' => 'name',
                        'label' => 'Nombre',
                        'type' => 'text',
                        'required' => true
                    ],

                    [
                        'name' => 'last_name',
                        'label' => 'Apellido',
                        'type' => 'text',
                        'required' => true
                    ],

                    [
                        'name' => 'email',
                        'label' => 'Correo',
                        'type' => 'email',
                        'required' => true
                    ],

                    [
                        'name' => 'password',
                        'label' => 'Contraseña',
                        'type' => 'password',
                        'required' => true
                    ],

                    [
                        'name' => 'role_id',
                        'label' => 'Rol',
                        'type' => 'select',
                        'required' => true,

                        'options' => fn () =>
                            Role::orderBy('name')
                                ->get()
                                ->map(fn ($role) => [
                                    'value' => $role->id,
                                    'label' => $role->label,
                                ])->all(),
                    ],

                    [
                        'name' => 'phone',
                        'label' => 'Teléfono',
                        'type' => 'text',
                        'required' => true
                    ],

                    [
                        'name' => 'birth_date',
                        'label' => 'Fecha de nacimiento',
                        'type' => 'date',
                        'required' => true
                    ],
                ],

                'rules' => [
                    'create' => fn () => [
                        'name' => ['required', 'string', 'max:255'],
                        'last_name' => ['required', 'string', 'max:255'],
                        'email' => [
                            'required',
                            'email',
                            'max:255',
                            'unique:users,email'
                        ],
                        'password' => [
                            'required',
                            'string',
                            'min:8'
                        ],
                        'role_id' => [
                            'required',
                            'integer',
                            'exists:roles,id'
                        ],
                        'phone' => [
                            'required',
                            'string',
                            'max:20'
                        ],
                        'birth_date' => [
                            'required',
                            'date'
                        ],
                    ],

                    'update' => fn (int $id) => [
                        'name' => ['required', 'string', 'max:255'],
                        'last_name' => ['required', 'string', 'max:255'],

                        'email' => [
                            'required',
                            'email',
                            'max:255',
                            Rule::unique('users', 'email')->ignore($id)
                        ],

                        'password' => [
                            'nullable',
                            'string',
                            'min:8'
                        ],

                        'role_id' => [
                            'required',
                            'integer',
                            'exists:roles,id'
                        ],

                        'phone' => [
                            'required',
                            'string',
                            'max:20'
                        ],

                        'birth_date' => [
                            'required',
                            'date'
                        ],
                    ],
                ],
            ],

            'payments' => [
                'label' => 'Pagos',
                'model' => Payment::class,

                'allowCreate' => true,
                'allowEdit' => true,

                'query' => fn () =>
                    Payment::with([
                        'reservation.user',
                        'reservation.room'
                    ])
                    ->orderByDesc('id')
                    ->paginate(10),

                'with' => [
                    'reservation.user',
                    'reservation.room'
                ],

                'columns' => [
                    ['label' => 'ID', 'key' => 'id'],
                    ['label' => 'Reserva', 'key' => 'reservation.id'],
                    ['label' => 'Usuario', 'key' => 'reservation.user.name'],
                    ['label' => 'Habitación', 'key' => 'reservation.room.number'],
                    ['label' => 'Monto', 'key' => 'amount'],
                    ['label' => 'Método', 'key' => 'method'],
                    ['label' => 'Fecha', 'key' => 'date'],
                ],

                'fields' => [
                    [
                        'name' => 'reservation_id',
                        'label' => 'Reserva',
                        'type' => 'select',
                        'required' => true,

                        'options' => fn () =>
                            Reservation::with(['user', 'room'])
                                ->orderByDesc('id')
                                ->get()
                                ->map(fn ($reservation) => [
                                    'value' => $reservation->id,

                                    'label' =>
                                        'Reserva #' .
                                        $reservation->id .
                                        ' - ' .
                                        $reservation->user?->name .
                                        ' - Habitación ' .
                                        $reservation->room?->number,
                                ])->all(),
                    ],

                    [
                        'name' => 'amount',
                        'label' => 'Monto',
                        'type' => 'number',
                        'step' => '0.01',
                        'required' => false
                    ],

                    [
                        'name' => 'method',
                        'label' => 'Método',
                        'type' => 'select',
                        'required' => true,

                        'options' => [
                            [
                                'value' => 'efectivo',
                                'label' => 'Efectivo'
                            ],
                            [
                                'value' => 'tarjeta',
                                'label' => 'Tarjeta'
                            ],
                            [
                                'value' => 'transferencia',
                                'label' => 'Transferencia'
                            ],
                        ],
                    ],

                    [
                        'name' => 'date',
                        'label' => 'Fecha',
                        'type' => 'date',
                        'required' => true
                    ],
                ],

                'rules' => [
                    'create' => fn () => [
                        'reservation_id' => [
                            'required',
                            'integer',
                            'exists:reservations,id'
                        ],

                        'amount' => [
                            'nullable',
                            'numeric',
                            'min:0'
                        ],

                        'method' => [
                            'required',
                            Rule::in([
                                'efectivo',
                                'tarjeta',
                                'transferencia'
                            ])
                        ],

                        'date' => [
                            'required',
                            'date'
                        ],
                    ],

                    'update' => fn (int $id = null) => [
                        'reservation_id' => [
                            'required',
                            'integer',
                            'exists:reservations,id'
                        ],

                        'amount' => [
                            'required',
                            'numeric',
                            'min:0'
                        ],

                        'method' => [
                            'required',
                            Rule::in([
                                'efectivo',
                                'tarjeta',
                                'transferencia'
                            ])
                        ],

                        'date' => [
                            'required',
                            'date'
                        ],
                    ],
                ],
            ],
        ];

        if (!array_key_exists($resource, $resources)) {
            abort(404);
        }

        $config = $resources[$resource];

        $config['resource'] = $resource;

        $config['fields'] = array_map(function (array $field) {

            if (
                array_key_exists('options', $field)
                && $field['options'] instanceof \Closure
            ) {
                $field['options'] = ($field['options'])();
            }

            return $field;

        }, $config['fields']);

        return $config;
    }

    private function findResourceItem(array $config, int $id)
    {
        $model = $config['model'];

        $query = $model::query();

        if (!empty($config['with'])) {
            $query->with($config['with']);
        }

        return $query->findOrFail($id);
    }

    private function preparePayload(
        string $resource,
        array $payload,
        string $mode,
        $item = null
    ): array {

        if (
            $resource === 'users'
            && array_key_exists('password', $payload)
        ) {

            if (
                $mode === 'update'
                && (
                    $payload['password'] === null
                    || $payload['password'] === ''
                )
            ) {

                unset($payload['password']);

            } else {

                $payload['password'] = Hash::make(
                    $payload['password']
                );
            }
        }

        if ($resource === 'payments') {

            $reservation = Reservation::findOrFail(
                $payload['reservation_id']
            );

            if (
                !array_key_exists('amount', $payload)
                || $payload['amount'] === null
                || $payload['amount'] === ''
            ) {

                $payload['amount'] = $reservation->total;
            }
        }

        return $payload;
    }
}