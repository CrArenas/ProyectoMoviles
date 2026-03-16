<?php

namespace App\Http\Controllers;
use App\Models\Example;

use Illuminate\Http\Request;

class ExampleController extends Controller
{

    public function index()
    {
        $examples = Example::all();
        return response()->json($examples);
    }

    public function store(Request $request)
    {
        $example = new Example();
        $example->name = $request->name;
        $example->save();
        return response()->json($example);
    }

    public function show(string $id)
    {
        $example = Example::find($id);
        return response()->json($example);
    }

    public function update(Request $request, string $id)
    {
        //
    }


    public function destroy(string $id)
    {
        //
    }
}
