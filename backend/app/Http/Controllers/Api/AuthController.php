<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|in:Pembeli,Investor,Mitra UMKM',
            'phone_number' => 'nullable|string',
            'address' => 'nullable|string',
            // fields for UMKM
            'umkm_name' => 'required_if:role,Mitra UMKM|string',
            'umkm_owner' => 'required_if:role,Mitra UMKM|string',
            'umkm_nib' => 'required_if:role,Mitra UMKM|string',
            'umkm_ktp' => 'required_if:role,Mitra UMKM|string',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'phone_number' => $request->phone_number,
            'address' => $request->address,
            'wallet_balance' => 0.00
        ]);

        if ($request->role === 'Mitra UMKM') {
            // Create Umkm Profile
            \App\Models\Umkm::create([
                'user_id' => $user->id,
                'name' => $request->umkm_name,
                'owner' => $request->umkm_owner,
                'nib' => $request->umkm_nib,
                'ktp' => $request->umkm_ktp,
                'address' => $request->address,
                'status' => 'Pending'
            ]);

            // Submit KYC for verification
            \App\Models\KycVerification::create([
                'user_id' => $user->id,
                'umkm' => $request->umkm_name,
                'owner' => $request->umkm_owner,
                'nib' => $request->umkm_nib,
                'ktp' => $request->umkm_ktp,
                'status' => 'Pending'
            ]);
        } elseif ($request->role === 'Investor') {
            // Create Investor Profile
            \App\Models\Investor::create([
                'user_id' => $user->id,
                'name' => $request->name,
                'phone' => $request->phone_number,
                'address' => $request->address
            ]);
        } else {
            // Create Pembeli Profile
            \App\Models\Pembeli::create([
                'user_id' => $user->id,
                'name' => $request->name,
                'phone' => $request->phone_number,
                'address' => $request->address
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Credentials invalid.'], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }

    public function profile(Request $request)
    {
        return response()->json($request->user());
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully.']);
    }
}
