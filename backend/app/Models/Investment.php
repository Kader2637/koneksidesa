<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Investment extends Model
{
    use HasFactory;

    protected $table = 'investasis';
    protected $guarded = ['id'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function umkm()
    {
        return $this->belongsTo(User::class, 'umkm_id');
    }

    public function campaign()
    {
        return $this->belongsTo(Campaign::class, 'pendanaan_id');
    }
}
