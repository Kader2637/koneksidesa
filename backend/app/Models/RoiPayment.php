<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoiPayment extends Model
{
    use HasFactory;

    protected $table = 'pembayaran_rois';
    protected $guarded = ['id'];

    public function investment()
    {
        return $this->belongsTo(Investment::class, 'investment_id');
    }
}
