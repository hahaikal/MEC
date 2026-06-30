import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';

// Load variables explicitly from .env.local
config({ path: '.env.local' });

// Initialize Supabase using environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY tidak ditemukan di .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const filePath = path.join(process.cwd(), 'students.csv');
  if (!fs.existsSync(filePath)) {
    console.error('Error: File students.csv tidak ditemukan di folder root (sejajar dengan package.json)!');
    process.exit(1);
  }

  // Dapatkan satu ID Admin untuk dijadikan pengisi wajib 'created_by'
  const { data: users, error: userError } = await supabase
    .from('users')
    .select('id')
    .limit(1);

  if (userError || !users || users.length === 0) {
    console.error('Gagal mendapatkan admin user untuk created_by', userError);
    process.exit(1);
  }
  const adminId = users[0].id;

  console.log('Membaca file students.csv...');
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n').filter(l => l.trim() !== '');
  
  console.log(`Ditemukan ${lines.length - 1} baris data (mengabaikan baris judul). Memulai import...`);

  // Mulai dari i = 1 untuk mengabaikan baris 0 (header)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    // Memisahkan kolom berdasarkan koma (asumsi format CSV standard)
    // Jika ada koma di dalam nama, bisa ganti dengan split(';') jika export dari Excel
    const columns = line.split(',');
    
    // Asumsi: Kolom 1 adalah nama, Kolom 2 adalah class_id
    const name = columns[0]?.trim();
    const classId = columns[1]?.trim();
    
    if (!name || !classId) {
      console.warn(`Baris ${i + 1} dilewati karena format tidak lengkap (Pastikan dipisah dengan koma)`);
      continue;
    }

    console.log(`Memproses: ${name}...`);

    // 1. Masukkan ke tabel students
    const { data: student, error: studentError } = await supabase
      .from('students')
      .insert({
        name: name,
        created_by: adminId,
        status: 'ACTIVE'
      })
      .select('id')
      .single();

    if (studentError) {
      console.error(`❌ Gagal menambahkan student ${name}:`, studentError.message);
      continue;
    }

    // 2. Relasikan student ke tabel class_enrollments (class_id)
    const { error: enrollError } = await supabase
      .from('class_enrollments')
      .insert({
        student_id: student.id,
        class_id: classId
      });

    if (enrollError) {
      console.error(`❌ Gagal mendaftarkan kelas untuk ${name}:`, enrollError.message);
    } else {
      console.log(`✅ Berhasil: ${name} dimasukkan ke database.`);
    }
  }

  console.log('\nImport selesai sepenuhnya! 🎉');
}

main();
