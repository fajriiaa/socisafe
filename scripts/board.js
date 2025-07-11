/**
 * Data untuk boardgame socisafe
 * Berisi 40 kotak
 */
const BOARD_DATA = [
    // Kotak sudut (0, 10, 20, 30)
    {
        id: 0,
        type: 'corner',
        name: 'Mission Start',
        description: 'Mulai perjalanan keamanan siber Anda',
        action: 'collect',
        value: 200,
        position: { row: 10, col: 10 }
    },
    {
        id: 10,
        type: 'corner',
        name: 'Cyber Investigation',
        description: 'Pusat investigasi digital untuk pelanggaran UU ITE',
        action: 'jail',
        position: { row: 10, col: 0 }
    },
    {
        id: 20,
        type: 'corner',
        name: 'Secure Spot',
        description: 'Area bebas ancaman',
        action: 'free',
        position: { row: 0, col: 0 }
    },
    {
        id: 30,
        type: 'corner',
        name: 'GO TO INVESTIGASI',
        description: 'Terdeteksi melakukan aktivitas mencurigakan',
        action: 'goto-jail',
        position: { row: 0, col: 10 }
    },

    // Properti Kelompok 1: Keamanan Dasar (Biru Muda)
    {
        id: 1,
        type: 'property',
        group: 'basic-security',
        color: '#91C8E4',
        name: 'SafeKey',
        description: 'Alat untuk mengelola password dengan aman',
        price: 20,
        position: { row: 10, col: 9 }
    },
    {
        id: 3,
        type: 'property',
        group: 'basic-security',
        color: '#91C8E4',
        name: 'PassQuiz',
        description: 'Verifikasi dua langkah untuk keamanan tambahan',
        price: 60,
        position: { row: 10, col: 7 }
    },

    {
        id: 4,
        type: 'property',
        name: 'VerifyMe',
        color: '#91C8E4',
        description: 'Memastikan keamanan akun dengan verifikasi dua langkah',
        price: 20,
        position: { row: 10, col: 6 }
    },

    // Properti Kelompok 2: Keamanan Jaringan (Ungu)
    {
        id: 6,
        type: 'property',
        group: 'network-security',
        color: '#F97A00',
        name: 'Phishing',
        description: 'Perlindungan jaringan dari akses tidak sah',
        price: 100,
        position: { row: 10, col: 4 }
    },
    {
        id: 8,
        type: 'property',
        group: 'network-security',
        color: '#F97A00',
        name: 'LinkTrap',
        description: 'Jaringan pribadi virtual untuk koneksi aman',
        price: 100,
        position: { row: 10, col: 2 }
    },
    {
        id: 9,
        type: 'property',
        group: 'network-security',
        color: '#F97A00',
        name: 'Don\'t Click!',
        description: 'Terkena serangan phishing',
        price: 20,
        position: { row: 10, col: 1 }
    },

    // Properti Kelompok 3: Keamanan Perangkat (Oranye)
    {
        id: 11,
        type: 'property',
        group: 'device-security',
        color: '#FFE8CD',
        name: 'Akun Palsu',
        description: 'Perlindungan dari malware dan virus',
        price: 140,
        position: { row: 9, col: 0 }
    },
    {
        id: 13,
        type: 'property',
        group: 'device-security',
        color: '#FFE8CD',
        name: '❓Akun Palsu',
        description: 'Enkripsi data pada penyimpanan',
        price: 140,
        position: { row: 7, col: 0 }
    },
    {
        id: 14,
        type: 'property',
        group: 'device-security',
        color: '#FFE8CD',
        name: '⚠️Akun Palsu',
        description: 'Perlindungan menyeluruh untuk perangkat',
        price: 160,
        position: { row: 6, col: 0 }
    },

    // Properti Kelompok 4: Keamanan Data (Merah)
    {
        id: 16,
        type: 'property',
        group: 'data-security',
        color: '#7965C1',
        name: 'Privasi Akun',
        description: 'Cadangan data untuk mencegah kehilangan',
        price: 180,
        position: { row: 4, col: 0 }
    },
    {
        id: 18,
        type: 'property',
        group: 'data-security',
        color: '#7965C1',
        name: '❓Privasi Akun',
        description: 'Mencegah kebocoran data sensitif',
        price: 180,
        position: { row: 2, col: 0 }
    },
    {
        id: 19,
        type: 'property',
        group: 'data-security',
        color: '#7965C1',
        name: '⚠️Privasi Akun',
        description: 'Mengamankan data dengan enkripsi',
        price: 200,
        position: { row: 1, col: 0 }
    },

    // Properti Kelompok 5: Keamanan Aplikasi (Kuning)
    {
        id: 21,
        type: 'property',
        group: 'app-security',
        color: '#4E71FF',
        name: 'Malware',
        description: 'Praktik pengkodean yang aman',
        price: 220,
        position: { row: 0, col: 1 }
    },
    {
        id: 23,
        type: 'property',
        group: 'app-security',
        color: '#4E71FF',
        name: '❓Malware',
        description: 'Static Application Security Testing',
        price: 220,
        position: { row: 0, col: 3 }
    },
    {
        id: 24,
        type: 'property',
        group: 'app-security',
        color: '#4E71FF',
        name: '⚠️Malware',
        description: 'Dynamic Application Security Testing',
        price: 240,
        position: { row: 0, col: 4 }
    },

    // Properti Kelompok 6: Keamanan Cloud (Hijau)
    {
        id: 26,
        type: 'property',
        group: 'cloud-security',
        color: '#2ecc71',
        name: 'Deepfake',
        description: 'Mengamankan akses ke layanan cloud',
        price: 260,
        position: { row: 0, col: 6 }
    },
    {
        id: 27,
        type: 'property',
        group: 'cloud-security',
        color: '#2ecc71',
        name: '❓Deepfake',
        description: 'Enkripsi data di lingkungan cloud',
        price: 260,
        position: { row: 0, col: 7 }
    },
    {
        id: 29,
        type: 'property',
        group: 'cloud-security',
        color: '#2ecc71',
        name: '⚠️Deepfake',
        description: 'Pemantauan keamanan di cloud',
        price: 280,
        position: { row: 0, col: 9 }
    },

    // Properti Kelompok 7: Keamanan Lanjutan (Biru Tua)
    {
        id: 31,
        type: 'property',
        group: 'advanced-security',
        color: '#89A8B2',
        name: 'Digital Privacy',
        description: 'Security Information and Event Management',
        price: 300,
        position: { row: 1, col: 10 }
    },
    {
        id: 32,
        type: 'property',
        group: 'advanced-security',
color: '#89A8B2',
        name: 'Privacy Violation',
        description: 'Security Operations Center',
        price: 300,
        position: { row: 2, col: 10 }
    },
    {
        id: 34,
        type: 'property',
        group: 'advanced-security',
        color: '#FF76CE',
        name: 'CyberLaw Puzzle',
        description: 'Informasi tentang ancaman keamanan',
        price: 320,
        position: { row: 4, col: 10 }
    },

    // Properti Kelompok 8: Keamanan Kritis (Ungu Tua)
    {
        id: 37,
        type: 'property',
        group: 'critical-security',
        color: '#FF76CE',
        name: 'Hate Post',
        description: 'Pengujian keamanan dengan simulasi serangan',
        price: 350,
        position: { row: 7, col: 10 }
    },
    {
        id: 39,
        type: 'property',
        group: 'critical-security',
        color: '#8e44ad',
        name: 'Mission Complete',
        description: 'Model keamanan tanpa kepercayaan implisit',
        price: 400,
        position: { row: 9, col: 10 }
    },

    // Kotak Stasiun (Sertifikasi Keamanan)
    {
        id: 5,
        type: 'station',
        name: 'Cyberpedia',
        description: 'Sertifikasi keamanan dasar',
        price: 20,
        position: { row: 10, col: 5 }
    },
    {
        id: 12,
        type: 'station',
        name: 'Cyberpedia',
        description: 'Asuransi untuk risiko keamanan siber',
        price: 150,
        position: { row: 8, col: 0 }
    },
    {
        id: 28,
        type: 'station',
        name: 'Cyberpedia',
        description: 'Pelatihan keamanan untuk karyawan',
        price: 150,
        position: { row: 0, col: 8 }
    },
    {
        id: 38,
        type: 'station',
        name: 'Cyberpedia',
        description: 'Serangan ransomware yang meminta tebusan',
        value: 100,
        position: { row: 8, col: 10 }
    },
    {
        id: 15,
        type: 'station',
        name: 'PassReset',
        description: 'Certified Information Systems Security Professional',
        price: 200,
        position: { row: 5, col: 0 }
    },
    {
        id: 25,
        type: 'station',
        name: 'PassReset',
        description: 'Sertifikasi keamanan dasar',
        price: 200,
        position: { row: 0, col: 5 }
    },
    {
        id: 35,
        type: 'station',
        name: 'PassReset',
        description: 'Offensive Security Certified Professional',
        price: 200,
        position: { row: 5, col: 10 }
    },

    // Kotak Kartu
    {
        id: 2,
        type: 'card',
        cardType: 'cyber-event',
        name: 'EVENT',
        description: 'Peristiwa dalam dunia keamanan siber',
        position: { row: 10, col: 8 }
    },
    {
        id: 7,
        type: 'card',
        cardType: 'cyber-chance',
        name: 'CHANCE',
        description: 'Peluang dalam dunia keamanan siber',
        position: { row: 10, col: 3 }
    },
    {
        id: 17,
        type: 'card',
        cardType: 'cyber-event',
        name: 'EVENT',
        description: 'Peristiwa dalam dunia keamanan siber',
        position: { row: 3, col: 0 }
    },
    {
        id: 22,
        type: 'card',
        cardType: 'cyber-chance',
        name: 'CHANCE',
        description: 'Peluang dalam dunia keamanan siber',
        position: { row: 0, col: 2 }
    },
    {
        id: 33,
        type: 'card',
        cardType: 'cyber-event',
        name: 'EVENT',
        description: 'Peristiwa dalam dunia keamanan siber',
        position: { row: 3, col: 10 }
    },
    {
        id: 36,
        type: 'card',
        cardType: 'cyber-chance',
        name: 'CHANCE',
        description: 'Peluang dalam dunia keamanan siber',
        position: { row: 6, col: 10 }
    }
    
];

/**
 * Kartu Chance
 */
const CYBER_CHANCE_CARDS = [
    {
        id: 1,
        title: 'Vulnerability Disclosure',
        description: 'Anda menemukan kerentanan dan melaporkannya. Dapatkan hadiah bug bounty.',
        action: 'collect',
        value: 150,
        icon: '🔍'
    },
    {
        id: 2,
        title: 'Phishing Attack',
        description: 'Anda menjadi korban serangan phishing. Bayar untuk pemulihan.',
        action: 'pay',
        value: 100,
        icon: '🎣'
    },
    {
        id: 3,
        title: 'Security Conference',
        description: 'Anda diundang sebagai pembicara di konferensi keamanan. Maju 3 langkah.',
        action: 'move',
        value: 3,
        icon: '🎤'
    },
    {
        id: 4,
        title: 'Malware Infection',
        description: 'Sistem Anda terinfeksi malware. Mundur 3 langkah.',
        action: 'move',
        value: -3,
        icon: '🦠'
    },
    {
        id: 5,
        title: 'Security Audit',
        description: 'Audit keamanan menemukan masalah di semua sistem Anda. Bayar untuk perbaikan di setiap properti.',
        action: 'pay-per-property',
        value: 25,
        icon: '📋'
    },
    {
        id: 6,
        title: 'Security Upgrade',
        description: 'Anda meningkatkan keamanan di semua sistem. Bayar untuk setiap properti.',
        action: 'pay-per-property',
        value: 40,
        icon: '🔄'
    },
    {
        id: 7,
        title: 'Zero-Day Vulnerability',
        description: 'Kerentanan zero-day ditemukan di sistem Anda. Pergi ke Cyber Jail.',
        action: 'goto-jail',
        value: 0,
        icon: '⚠️'
    },
    {
        id: 8,
        title: 'Security Certification',
        description: 'Anda mendapatkan sertifikasi keamanan baru. Dapatkan bonus.',
        action: 'collect',
        value: 50,
        icon: '🏆'
    },
    {
        id: 9,
        title: 'Secure Development',
        description: 'Praktik pengembangan aman Anda mencegah kerentanan. Dapatkan bonus dari setiap pemain.',
        action: 'collect-from-players',
        value: 50,
        icon: '💻'
    },
    {
        id: 10,
        title: 'Security Awareness',
        description: 'Anda menyelenggarakan pelatihan kesadaran keamanan. Dapatkan bonus.',
        action: 'collect',
        value: 100,
        icon: '🧠'
    }
];

/**
 * Kartu Event
 */
const CYBER_EVENT_CARDS = [
    {
        id: 1,
        title: 'Webinar Komunitas Sadar SMKI #4',
        description: 'Kamu ikut webinar tentang keamanan siber! Pengetahuan makin mantap.',
        action: 'collect',
        value: 20,
        icon: '🌐'
    },
    {
        id: 2,
        title: 'Report',
        description: 'Kamu membiarkan akun palsu menyebar tipu daya! Waspadalah... .',
        action: 'pay',
        value: 15,
        icon: '🌩️'
    },
    {
        id: 3,
        title: 'Giveaway Palsu',
        description: 'Kamu tergoda giveaway palsu dan kasih data pribadi! Kamu tertipu',
        action: 'pay',
        value: 20,
        icon: '🐛'
    },
    {
        id: 4,
        title: 'Tren Viral',
        description: 'Kamu isi challenge viral yang minta info pribadi! Bahaya tersembunyi…',
        action: 'pay',
        value: 10,
        icon: '📊'
    },
    {
        id: 5,
        title: 'Backup Data',
        description: 'Backup rutin? Good job! Datamu aman dari ancaman',
        action: 'collect',
        value: 10,
        icon: '🔄'
    },
    {
        id: 6,
        title: 'Volunter',
        description: 'Kamu aktif di komunitas kampanye edukasi siber! Aksimu berdampak besar',
        action: 'collect',
        value: 30,
        icon: '👨‍💼'
    },
    {
        id: 7,
        title: 'Insiden Keamanan',
        description: 'Lupa logout dari perangkat umum! Akunmu hampir diretas',
        action: 'pay',
        value: 20,
        icon: '🚨'
    },
    {
        id: 8,
        title: 'Penghargaan Keamanan',
        description: 'Anda menerima penghargaan atas kontribusi di bidang keamanan siber. Dapatkan bonus.',
        action: 'collect',
        value: 10,
        icon: '🏅'
    }
];

/**
 * Fungsi untuk membuat papan permainan
 */
class GameBoard {
    constructor() {
        this.tiles = BOARD_DATA;
        this.chanceCards = CYBER_CHANCE_CARDS;
        this.eventCards = CYBER_EVENT_CARDS;
        this.boardElement = document.querySelector('.game-board');
    }

    /**
     * Inisialisasi papan permainan
     */
    initialize() {
        this.renderBoard();
        this.shuffleCards();
    }

    /**
     * Render papan permainan ke DOM
     */
    renderBoard() {
        // Bersihkan papan
        this.boardElement.innerHTML = '';

        // Buat grid 11x11 untuk papan
        for (let row = 0; row <= 10; row++) {
            for (let col = 0; col <= 10; col++) {
                // Hanya buat tile untuk tepi papan (baris/kolom 0 dan 10)
                // atau kotak kosong di tengah
                if (row === 0 || row === 10 || col === 0 || col === 10) {
                    const tile = this.getTileAtPosition(row, col);
                    if (tile) {
                        const tileElement = this.createTileElement(tile);
                        this.boardElement.appendChild(tileElement);
                    }
                } else if (row === 5 && col === 5) {
                    // Tambahkan logo di tengah papan
                    const centerElement = document.createElement('div');
                    centerElement.className = 'board-center';
                    centerElement.style.gridRow = '5 / span 2';
                    centerElement.style.gridColumn = '5 / span 2';
                    centerElement.innerHTML = `
                        <h2>CyberSecurity Monopoly</h2>
                        <div class="board-logo">🔒</div>
                    `;
                    this.boardElement.appendChild(centerElement);
                }
            }
        }
    }

    /**
     * Mendapatkan tile berdasarkan posisi
     */
    getTileAtPosition(row, col) {
        return this.tiles.find(tile => 
            tile.position.row === row && tile.position.col === col
        );
    }

    /**
     * Membuat elemen HTML untuk tile
     */
    createTileElement(tile) {
        const tileElement = document.createElement('div');
        let extraClass = '';
        if (tile.position.row === 0 || tile.position.row === 10) {
            extraClass = ' horizontal-tile';
        }
        tileElement.className = `board-tile tile-${tile.type}${extraClass}`;
        tileElement.dataset.id = tile.id;
        tileElement.style.gridRow = tile.position.row + 1;
        tileElement.style.gridColumn = tile.position.col + 1;

        // Tambahkan konten berdasarkan jenis tile
        if (tile.type === 'corner') {
            tileElement.className += ' corner-tile';
            tileElement.innerHTML = `
            `;
        } else if (tile.type === 'property') {
            if (tile.id === 39) {
                // Kotak 39 tidak memiliki header
                tileElement.innerHTML = `
                    <div class="tile-content">
                    </div>
                `;
            } else {
                tileElement.innerHTML = `
                    <div class="tile-header" style="background-color: ${tile.color}"></div>
                    <div class="tile-content">
                    </div>
                `;
            }
        } else if (tile.type === 'station') {
            tileElement.innerHTML = `
                <div class="tile-content">
                </div>
            `;
        } else if (tile.type === 'utility') {
            tileElement.innerHTML = `
                <div class="tile-header">UTILITAS</div>
                <div class="tile-content">
                    <div class="tile-icon">⚙️</div>
                </div>
            `;
        } else if (tile.type === 'card') {
            tileElement.innerHTML = `
                <div class="tile-content">
                </div>
            `;
        } else if (tile.type === 'tax') {
            tileElement.innerHTML = `
                <div class="tile-content">
                    <div class="tile-icon">💸</div>
                </div>
            `;
        }

        return tileElement;
    }

    /**
     * Acak kartu kesempatan dan peristiwa
     */
    shuffleCards() {
        // Fisher-Yates shuffle algorithm untuk kartu kesempatan
        for (let i = this.chanceCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.chanceCards[i], this.chanceCards[j]] = [this.chanceCards[j], this.chanceCards[i]];
        }
        
        // Fisher-Yates shuffle algorithm untuk kartu peristiwa
        for (let i = this.eventCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.eventCards[i], this.eventCards[j]] = [this.eventCards[j], this.eventCards[i]];
        }
    }

    /**
     * Mendapatkan tile berdasarkan ID
     */
    getTileById(id) {
        return this.tiles.find(tile => tile.id === id);
    }

    /**
     * Ambil kartu kesempatan teratas
     */
    drawChanceCard() {
        const card = this.chanceCards.shift();
        this.chanceCards.push(card); // Letakkan kembali di bawah tumpukan
        return card;
    }
    
    /**
     * Ambil kartu peristiwa teratas
     */
    drawEventCard() {
        const card = this.eventCards.shift();
        this.eventCards.push(card); // Letakkan kembali di bawah tumpukan
        return card;
    }
}

// Export kelas untuk digunakan di file lain
window.GameBoard = GameBoard; 