import { LeaderboardEntry } from "../types";

// --- KONFIGURASI DATABASE ---
// Connection String: mongodb+srv://mrharjulianto_db_user:FF6pW3HHdnfh4bLF@db-fayash.tewsvom.mongodb.net/?appName=db-fayash
// 
// CATATAN TEKNIS:
// Aplikasi ini berjalan 100% di browser (Client-Side). Browser tidak bisa melakukan koneksi langsung 
// ke MongoDB Atlas menggunakan connection string di atas karena alasan keamanan (CORS & TCP Protocol).
// 
// Kode di bawah ini mensimulasikan koneksi database (Async/Await) agar UX terasa seperti menggunakan DB.
// Jika nanti dipasang Backend (Node.js), cukup ganti isi fungsi ini dengan `fetch('/api/leaderboard')`.

const DB_KEY = 'huntr_db_leaderboard_v1';

const MOCK_DATA: LeaderboardEntry[] = [
  { name: "AGENT FAYASH", score: 2500, date: "2026-02-01" },
  { name: "HUNTR ZERO", score: 1800, date: "2026-02-01" },
  { name: "V-SQUAD", score: 1200, date: "2026-02-01" },
];

export const fetchLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  // Simulasi network delay (koneksi ke database)
  await new Promise(resolve => setTimeout(resolve, 800));

  try {
    const data = localStorage.getItem(DB_KEY);
    if (data) {
        return JSON.parse(data);
    }
    return MOCK_DATA;
  } catch (error) {
    console.error("DB Connection Error:", error);
    return MOCK_DATA;
  }
};

export const submitScoreToDb = async (entry: LeaderboardEntry): Promise<LeaderboardEntry[]> => {
  // Simulasi proses insert ke database
  await new Promise(resolve => setTimeout(resolve, 1500));

  const currentData = await fetchLeaderboard();
  
  // Logika sort MongoDB (descending score) & Limit 5
  const newData = [...currentData, entry]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  localStorage.setItem(DB_KEY, JSON.stringify(newData));
  return newData;
};