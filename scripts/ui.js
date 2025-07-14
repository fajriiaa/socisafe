/**
 * Kelas UI untuk mengelola antarmuka pengguna
 */
class UI {
    constructor(game) {
        this.game = game;
        this.gameStarted = false;
        
        // Set referensi UI ke Game
        this.game.setUI(this);
        
        // Elemen-elemen UI
        this.gameBoard = document.querySelector('.game-board');
        this.playersList = document.getElementById('playersList');

        this.restartGameBtn = document.getElementById('restartGame');
        this.rulesBtn = document.getElementById('rulesBtn');
        this.rollDiceBtn = document.getElementById('rollDice');
        this.rulesModal = document.getElementById('rulesModal');
        this.closeModalBtns = document.querySelectorAll('.close-modal');
        
        // Elemen kartu
        this.actionCardDeck = document.getElementById('actionCardDeck');
        this.eventCardDeck = document.getElementById('eventCardDeck');
        this.cardModal = document.getElementById('cardModal');
        this.cardTitle = document.getElementById('cardTitle');
        this.cardIcon = document.getElementById('cardIcon');
        this.cardDescription = document.getElementById('cardDescription');
        this.cardAction = document.getElementById('cardAction');
        this.cardActionBtn = document.getElementById('cardActionBtn');
        
        // Elemen kartu di tengah board
        this.cardOverlay = document.getElementById('cardOverlay');
        this.cardDisplayContainer = document.getElementById('cardDisplayContainer');
        this.displayedCard = document.getElementById('displayedCard');
        this.cardFront = document.getElementById('cardFront');
        this.frontCardTitle = document.getElementById('frontCardTitle');
        this.frontCardIcon = document.getElementById('frontCardIcon');
        this.cardBack = document.getElementById('cardBack');
        this.cardBackHeader = document.getElementById('cardBackHeader');
        this.backCardIcon = document.getElementById('backCardIcon');
        this.backCardTitle = document.getElementById('backCardTitle');
        this.cardButton = document.getElementById('cardButton');
        
        // Tambahkan variabel untuk menyimpan tipe kartu yang aktif
        this.activeCardType = null;
        // Tambahkan variabel untuk menyimpan kartu yang menunggu diambil
        this.pendingCard = null;
        this.pendingCardType = null;
        
        // Inisialisasi event listeners
        this.initEventListeners();
        
        // Mulai permainan secara otomatis
        this.startGame();
    }

    /**
     * Inisialisasi event listeners
     */
    initEventListeners() {
        // Tombol restart permainan
        this.restartGameBtn.addEventListener('click', () => {
            this.startGame();
        });
        
        // Tombol aturan
        this.rulesBtn.addEventListener('click', () => {
            this.showRulesModal();
        });
        
        // Tombol tutup modal
        this.closeModalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.hideModals();
            });
        });
        
        // Klik di luar modal untuk menutup
        window.addEventListener('click', (e) => {
            if (e.target === this.rulesModal) {
                this.hideModals();
            }
        });
        
        // Tombol lempar dadu
        this.rollDiceBtn.addEventListener('click', () => {
            this.rollDice();
        });
        
        /* ==========================================
         * KODE PERGERAKAN TOKEN DENGAN KLIK KOTAK
         * ------------------------------------------
         * Fungsi: Memungkinkan pemain untuk mengklik kotak 
         * dan token langsung bergerak ke sana
         * 
         * Kode ini bisa dihapus jika nanti tidak digunakan
         * ========================================== */
        document.addEventListener('click', (e) => {
            const tile = e.target.closest('.board-tile');
            if (tile) {
                const tileId = parseInt(tile.getAttribute('data-id'));
                const player = this.game.getPlayer();
                
                // Pindahkan pemain ke kotak yang diklik
                this.game.movePlayerToTile(player.id, tileId);
                
                // Update tampilan token
                this.renderPlayerToken();
                
                // Update UI pemain
                this.updatePlayerUI();
                
                // Tambahkan ke log permainan
                const tileName = this.game.gameBoard.getTileById(tileId).name;

            }
        });
        /* ==========================================
         * AKHIR KODE PERGERAKAN TOKEN DENGAN KLIK KOTAK
         * ========================================== */
        
        // Event listener untuk kartu
        this.actionCardDeck.addEventListener('click', () => {
            if (this.gameStarted && this.activeCardType === 'action' && this.pendingCard) {
                this.hideCardInstructions();
                this.showCardInBoard(this.pendingCard, 'action');
                // Proses efek kartu di sini
                this.processCardAction(this.pendingCard);
                this.activeCardType = null; // Reset tipe kartu aktif
                this.pendingCard = null;
                this.pendingCardType = null;
                this.updateCardDeckStates(); // Update tampilan kartu
                this.rollDiceBtn.disabled = false;
            } else if (this.activeCardType === 'event') {

            }
        });
        
        this.eventCardDeck.addEventListener('click', () => {
            if (this.gameStarted && this.activeCardType === 'event' && this.pendingCard) {
                this.hideCardInstructions();
                this.showCardInBoard(this.pendingCard, 'event');
                // Proses efek kartu di sini
                this.processCardAction(this.pendingCard);
                this.activeCardType = null; // Reset tipe kartu aktif
                this.pendingCard = null;
                this.pendingCardType = null;
                this.updateCardDeckStates(); // Update tampilan kartu
                this.rollDiceBtn.disabled = false;
            } else if (this.activeCardType === 'action') {

            }
        });
        
        // Event listener untuk kartu yang ditampilkan di board
        this.displayedCard.addEventListener('click', () => {
            this.displayedCard.classList.toggle('flipped');
        });
        
        // Tombol OK pada kartu
        this.cardButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Mencegah event klik menyebar ke kartu
            // Jalankan efek kartu di sini
            if (this.pendingCardEffect) {
                const { card } = this.pendingCardEffect;
                const player = this.game.getPlayer();
                const startPosition = player.position;
                
                switch (card.action) {
                    case 'collect':
                        player.points += card.value;
                        break;
                    case 'pay':
                        player.points = Math.max(0, player.points - card.value);
                        break;
                    case 'move':
                        this.game.movePlayer(player.id, card.value);
                        this.animatePlayerMovement(startPosition, player.position, () => {
                            this.showTileInfo(player.position, { action: 'card-move' });
                        });
                        break;
                    case 'goto-jail':
                        this.game.sendPlayerToJail(player.id);
                        this.animatePlayerMovement(startPosition, player.position, () => {
                            this.showTileInfo(player.position, { action: 'card-jail' });
                        });
                        break;
                    case 'goto':
                        this.game.movePlayerToStart(player.id);
                        this.animatePlayerMovement(startPosition, player.position, () => {
                            this.showTileInfo(player.position, { action: 'card-start' });
                        });
                        break;
                }
                this.updatePlayerUI();
                this.pendingCardEffect = null;
            }
            this.hideCardInBoard();
        });
        
        this.cardActionBtn.addEventListener('click', () => {
            this.hideCardModal();
        });
    }

    /**
     * Tampilkan modal aturan
     */
    showRulesModal() {
        this.rulesModal.classList.add('active');
    }

    /**
     * Sembunyikan semua modal
     */
    hideModals() {
        this.rulesModal.classList.remove('active');
    }

    /**
     * Mulai permainan
     */
    startGame() {
        // Buat data pemain (hanya satu pemain)
        const playerData = [
            {}
        ];
        
        // Inisialisasi permainan
        this.game.initialize(playerData);
        
        // Hapus semua token pemain yang ada
        const existingTokens = document.querySelectorAll('.player-token');
        existingTokens.forEach(token => token.remove());
        
        // Update UI
        this.updatePlayerUI();

        
        // Render token pemain
        this.renderPlayerToken();
        
        // Aktifkan tombol lempar dadu
        this.rollDiceBtn.disabled = false;
        
        // Pastikan semua modal tersembunyi
        this.hideModals();
        
        // Hapus semua elemen dadu yang mungkin ada
        const diceContainer = document.querySelector('.dice-container');
        if (diceContainer) {
            diceContainer.innerHTML = `
                <div class="dice" id="dice1">?</div>
            `;
        }
        
        this.gameStarted = true;
    }

    /**
     * Update UI pemain
     */
    updatePlayerUI() {
        this.playersList.innerHTML = '';
        
        const player = this.game.getPlayer();
        
        // Ambil nama dari karakter yang telah dikustomisasi (tidak digunakan lagi untuk tampilan)
        // const characterData = JSON.parse(localStorage.getItem('characterData')) || { nama: 'Pemain' };
        // const playerName = characterData.nama || player.name || 'Pemain';
        
        const playerItem = document.createElement('div');
        playerItem.className = 'player-item';
        playerItem.style.borderLeftColor = player.color;
        
        // Hanya tampilkan poin saja
        playerItem.innerHTML = `
            <div class="player-points">${player.points} pts</div>
        `;
        
        this.playersList.appendChild(playerItem);
    }

    /**
     * Render token pemain di papan
     */
    renderPlayerToken() {
        // Hapus token yang ada
        const existingTokens = document.querySelectorAll('.player-token');
        existingTokens.forEach(token => token.remove());
        
        // Render token pemain
        const player = this.game.getPlayer();
        const tile = this.game.gameBoard.getTileById(player.position);
        
        if (!tile) return;
        
        const tileElement = document.querySelector(`.board-tile[data-id="${tile.id}"]`);
        if (!tileElement) return;
        
        // Buat container untuk karakter
        const token = document.createElement('div');
        token.className = 'player-token';
        
        // Ambil informasi karakter dari localStorage
        const characterData = JSON.parse(localStorage.getItem('characterData')) || {
            nama: 'Pemain',
            hairColor: '#000000',
            hatColor: '#000000',
            shirtColor: '#97A88A',
            tieColor: '#000000',
            pantColor: '#808080',
            skinColor: '#FBE8D3',
            shoesColor: '#FFFFFF',
            hairStyle: 'kartun',
            expression: 'neutral'
        };
        
        // Buat elemen karakter berdasarkan data kustomisasi
        let characterHTML = '';
        
        if (characterData.hairStyle === 'hat') {
            characterHTML = `
                <div class="character" style="background: ${characterData.skinColor}; width: 120px; height: 150px; border-radius: 15px; position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
                    <div class="hair-hat" style="position: absolute; top: -18%; left: 0; width: 100%; height: 32%; pointer-events: none;">
                        <div class="hat-shape" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: ${characterData.hatColor}; border-top-right-radius: 15px; border-top-left-radius: 15px; z-index: 2;"></div>
                        <div class="hat-brim" style="position: absolute; top: 100%; left: 100%; width: 35%; height: 3px; background: ${characterData.hatColor}; transform: translateY(-100%);"></div>
                    </div>
                    <div class="eye right" style="position: absolute; width: 8px; height: 8px; background: black; border-radius: 50%; top: 25%; right: 15%;"></div>
                    <div class="eye left" style="position: absolute; width: 8px; height: 8px; background: black; border-radius: 50%; top: 25%; right: 55%;"></div>
                    <div class="mouth" style="position: absolute; top: 40%; width: 25%; height: 3px; background: black; left: 60%; ${characterData.expression === 'smile' ? 'border-radius: 0 0 15px 15px; height: 10px;' : characterData.expression === 'sad' ? 'border-radius: 0 0 15px 15px; transform: rotate(180deg); height: 10px;' : ''}"></div>
                    <div class="shirt" style="position: absolute; bottom: -1px; width: 105%; height: 50%; left: 50%; transform: translateX(-50%); background: ${characterData.shirtColor}; border-radius: 15px; border-top-right-radius: 0px; border-top-left-radius: 0px; overflow: hidden;">
                        <div class="under" style="position: absolute; left: 60%; top: 0px; width: 40%; height: 99%; transform: translateX(-50%); background: ${characterData.skinColor};"></div>
                        <div class="tie" style="background: ${characterData.tieColor}; width: 12%; height: 70%; position: absolute; top: 0; left: 55%; border-bottom-right-radius: 8px; border-bottom-left-radius: 8px;"></div>
                    </div>
                    <div class="arm right" style="position: absolute; width: 25%; height: 40%; background: ${characterData.skinColor}; border-radius: 10px; top: 60%; transform-origin: 50% 5%; right: -10%; transform: rotate(-0.5rad); z-index: 0;">
                        <div class="sleeve" style="position: absolute; top: 0; left: 0; border-radius: 10px; background: ${characterData.shirtColor}; width: 100%; height: 50%; border-bottom-right-radius: 0px; border-bottom-left-radius: 0px;"></div>
                    </div>
                    <div class="arm left" style="position: absolute; width: 25%; height: 40%; background: ${characterData.skinColor}; border-radius: 10px; top: 60%; transform-origin: 50% 5%; left: -5%;">
                        <div class="sleeve" style="position: absolute; top: 0; left: 0; border-radius: 10px; background: ${characterData.shirtColor}; width: 100%; height: 50%; border-bottom-right-radius: 0px; border-bottom-left-radius: 0px;"></div>
                    </div>
                    <div class="leg right" style="position: absolute; top: 80%; width: 25%; height: 45%; background: ${characterData.skinColor}; border-radius: 10px; z-index: -1; transform-origin: 50% 5%; transform: translateX(-50%); border-bottom: 18px solid ${characterData.shoesColor}; right: -5%;">
                        <div class="pant" style="position: absolute; width: 100%; height: 80%; top: 0; left: 0; background: ${characterData.pantColor};"></div>
                    </div>
                    <div class="leg left" style="position: absolute; top: 80%; width: 25%; height: 45%; background: ${characterData.skinColor}; border-radius: 10px; z-index: -1; transform-origin: 50% 5%; transform: translateX(-50%); border-bottom: 18px solid ${characterData.shoesColor}; left: 20%;">
                        <div class="pant" style="position: absolute; width: 100%; height: 80%; top: 0; left: 0; background: ${characterData.pantColor};"></div>
                    </div>
                    <div class="shadow" style="position: absolute; top: 115%; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.2); z-index: -2; width: 100%; height: 15px; border-radius: 50%;"></div>
                </div>
            `;
        } else {
            characterHTML = `
                <div class="character" style="background: ${characterData.skinColor}; width: 120px; height: 150px; border-radius: 15px; position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
                    <div class="hair-realistic" style="position: absolute; top: -22%; left: 0; width: 100%; height: 44%; pointer-events: none;">
                        <div class="hair-base" style="position: absolute; left: 7%; top: 0; width: 86%; height: 90%; background: linear-gradient(120deg, ${characterData.hairColor} 60%, #444 100%); border-top-left-radius: 60% 90%; border-top-right-radius: 90% 100%; border-bottom-left-radius: 60% 60%; border-bottom-right-radius: 80% 70%; z-index: 2;"></div>
                        <div class="hair-forelock" style="position: absolute; top: 18%; left: 55%; width: 38%; height: 38%; background: linear-gradient(120deg, ${characterData.hairColor} 60%, #444 100%); border-top-left-radius: 0 0; border-top-right-radius: 80% 60%; border-bottom-left-radius: 60% 100%; border-bottom-right-radius: 80% 100%; transform: rotate(18deg); z-index: 4;"></div>
                        <div class="hair-side-left" style="position: absolute; left: -2%; top: 22%; width: 18%; height: 60%; background: linear-gradient(120deg, ${characterData.hairColor} 60%, #444 100%); border-top-left-radius: 60% 80%; border-bottom-left-radius: 60% 80%; border-top-right-radius: 40% 60%; border-bottom-right-radius: 40% 60%; z-index: 3;"></div>
                        <div class="hair-side-right" style="position: absolute; right: -2%; top: 28%; width: 16%; height: 56%; background: linear-gradient(120deg, ${characterData.hairColor} 60%, #444 100%); border-top-right-radius: 60% 80%; border-bottom-right-radius: 60% 80%; border-top-left-radius: 40% 60%; border-bottom-left-radius: 40% 60%; z-index: 3;"></div>
                        <div class="hair-topwave" style="position: absolute; top: 2%; left: 32%; width: 38%; height: 28%; background: linear-gradient(120deg, ${characterData.hairColor} 60%, #555 100%); border-radius: 50% 60% 40% 60% / 60% 80% 40% 60%; transform: rotate(-8deg); z-index: 5; opacity: 0.7;"></div>
                    </div>
                    <div class="eye right" style="position: absolute; width: 8px; height: 8px; background: black; border-radius: 50%; top: 25%; right: 15%;"></div>
                    <div class="eye left" style="position: absolute; width: 8px; height: 8px; background: black; border-radius: 50%; top: 25%; right: 55%;"></div>
                    <div class="mouth" style="position: absolute; top: 40%; width: 25%; height: 3px; background: black; left: 60%; ${characterData.expression === 'smile' ? 'border-radius: 0 0 15px 15px; height: 10px;' : characterData.expression === 'sad' ? 'border-radius: 0 0 15px 15px; transform: rotate(180deg); height: 10px;' : ''}"></div>
                    <div class="shirt" style="position: absolute; bottom: -1px; width: 105%; height: 50%; left: 50%; transform: translateX(-50%); background: ${characterData.shirtColor}; border-radius: 15px; border-top-right-radius: 0px; border-top-left-radius: 0px; overflow: hidden;">
                        <div class="under" style="position: absolute; left: 60%; top: 0px; width: 40%; height: 99%; transform: translateX(-50%); background: ${characterData.skinColor};"></div>
                        <div class="tie" style="background: ${characterData.tieColor}; width: 12%; height: 70%; position: absolute; top: 0; left: 55%; border-bottom-right-radius: 8px; border-bottom-left-radius: 8px;"></div>
                    </div>
                    <div class="arm right" style="position: absolute; width: 25%; height: 40%; background: ${characterData.skinColor}; border-radius: 10px; top: 60%; transform-origin: 50% 5%; right: -10%; transform: rotate(-0.5rad); z-index: 0;">
                        <div class="sleeve" style="position: absolute; top: 0; left: 0; border-radius: 10px; background: ${characterData.shirtColor}; width: 100%; height: 50%; border-bottom-right-radius: 0px; border-bottom-left-radius: 0px;"></div>
                    </div>
                    <div class="arm left" style="position: absolute; width: 25%; height: 40%; background: ${characterData.skinColor}; border-radius: 10px; top: 60%; transform-origin: 50% 5%; left: -5%;">
                        <div class="sleeve" style="position: absolute; top: 0; left: 0; border-radius: 10px; background: ${characterData.shirtColor}; width: 100%; height: 50%; border-bottom-right-radius: 0px; border-bottom-left-radius: 0px;"></div>
                    </div>
                    <div class="leg right" style="position: absolute; top: 80%; width: 25%; height: 45%; background: ${characterData.skinColor}; border-radius: 10px; z-index: -1; transform-origin: 50% 5%; transform: translateX(-50%); border-bottom: 18px solid ${characterData.shoesColor}; right: -5%;">
                        <div class="pant" style="position: absolute; width: 100%; height: 80%; top: 0; left: 0; background: ${characterData.pantColor};"></div>
                    </div>
                    <div class="leg left" style="position: absolute; top: 80%; width: 25%; height: 45%; background: ${characterData.skinColor}; border-radius: 10px; z-index: -1; transform-origin: 50% 5%; transform: translateX(-50%); border-bottom: 18px solid ${characterData.shoesColor}; left: 20%;">
                        <div class="pant" style="position: absolute; width: 100%; height: 80%; top: 0; left: 0; background: ${characterData.pantColor};"></div>
                    </div>
                    <div class="shadow" style="position: absolute; top: 115%; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.2); z-index: -2; width: 100%; height: 15px; border-radius: 50%;"></div>
                </div>
            `;
        }
        
        token.innerHTML = characterHTML;
        
        // Posisikan token di tengah tile
        token.style.left = '50%';
        token.style.top = '50%';
        token.style.transform = 'translate(-50%, -30%) scale(0.32)';
        
        tileElement.appendChild(token);
    }

    /**
     * Lempar dadu
     */
    rollDice() {
        // Jangan izinkan lempar dadu jika masih ada pendingCard
        if (this.pendingCard) {
            return;
        }
        // Nonaktifkan tombol lempar dadu
        this.rollDiceBtn.disabled = true;
        
        // Dapatkan elemen dadu
        const dice1 = document.getElementById('dice1');
        
        // Tambahkan kelas rolling untuk animasi
        dice1.classList.add('rolling');
        dice1.textContent = '?';
        
        // Lempar dadu setelah animasi
        setTimeout(() => {
            // Hapus kelas rolling
            dice1.classList.remove('rolling');
            
            // Lempar dadu dengan angka 1-3
            const diceNumber = Math.floor(Math.random() * 3) + 1;
            const diceResult = {
                dice1: diceNumber,
                total: diceNumber, // Gunakan angka yang sama untuk total
                isDouble: false // Tidak ada dadu double karena hanya satu dadu
            };
            
            // Tampilkan hasil dadu
            dice1.textContent = diceResult.dice1;
            
            // Simpan posisi awal untuk animasi
            const player = this.game.getPlayer();
            const startPosition = player.position;
            
            // Proses giliran
            const turnResult = this.game.processTurn(diceResult);
            
            // Tampilkan animasi pergerakan token dengan informasi kotak
            this.animatePlayerMovement(startPosition, player.position, () => {
                // Setelah animasi selesai, tampilkan informasi kotak
                this.showTileInfo(player.position, turnResult);
            });
            
            // Update UI
            this.updatePlayerUI();
            
        }, 500);
    }

    /**
     * Animasi pergerakan token pemain
     */
    animatePlayerMovement(fromPosition, toPosition, callback) {
        const player = this.game.getPlayer();
        const steps = this.calculateSteps(fromPosition, toPosition);
        let currentStep = 0;
        const moveInterval = 500; // Interval waktu untuk setiap langkah (lebih lambat untuk melihat dengan jelas)
        
        // Zoom ke pion terlebih dahulu
        this.zoomToPlayer(() => {
            // Hapus pemanggilan showMovingNotification
            // Tambahkan jeda 1 detik sebelum mulai bergerak agar pemain bisa melihat posisi awal
            setTimeout(() => {
                // Setelah zoom selesai, mulai animasi pergerakan
                const moveStep = () => {
                    if (currentStep >= steps) {
                        // Hapus highlight setelah selesai bergerak
                        this.clearTileHighlights();
                        
                        // Hapus pemanggilan hideMovingNotification
                        // Setelah selesai bergerak, zoom out dan panggil callback
                        this.zoomOut(() => {
                            if (callback) callback();
                        });
                        return;
                    }
                    
                    currentStep++;
                    // Hitung posisi baru
                    let newPosition;
                    if (toPosition >= fromPosition) {
                        newPosition = fromPosition + currentStep;
                    } else {
                        // Untuk pergerakan mundur atau melewati start
                        newPosition = (fromPosition + currentStep) % 40;
                    }
                    
                    // Update posisi pemain sementara untuk animasi
                    player.position = newPosition;
                    
                    // Render ulang token
                    this.renderPlayerToken();
                    
                    // Highlight kotak yang sedang didatangi
                    this.highlightCurrentTile(newPosition);
                    
                    // Lanjutkan ke langkah berikutnya
                    setTimeout(moveStep, moveInterval);
                };
                
                // Mulai animasi pergerakan
                moveStep();
            }, 1000);
        });
    }

    /**
     * Zoom ke posisi pion
     */
    zoomToPlayer(callback) {
        const player = this.game.getPlayer();
        const tile = this.game.gameBoard.getTileById(player.position);
        const tileElement = document.querySelector(`.board-tile[data-id="${tile.id}"]`);
        
        if (!tileElement) {
            if (callback) callback();
            return;
        }
        
        // Dapatkan posisi tile relatif terhadap viewport
        const tileRect = tileElement.getBoundingClientRect();
        const boardContainer = document.querySelector('.game-board');
        const boardRect = boardContainer.getBoundingClientRect();
        
        // Hitung posisi tengah tile
        const tileCenterX = tileRect.left + tileRect.width / 2 - boardRect.left;
        const tileCenterY = tileRect.top + tileRect.height / 2 - boardRect.top;
        
        // Hitung posisi tengah board
        const boardCenterX = boardRect.width / 2;
        const boardCenterY = boardRect.height / 2;
        
        // Hitung offset untuk memindahkan tile ke tengah
        const offsetX = boardCenterX - tileCenterX;
        const offsetY = boardCenterY - tileCenterY;
        
        // Tambahkan kelas zoom untuk animasi
        boardContainer.classList.add('zooming');
        
        // Set transform untuk zoom dan pan
        boardContainer.style.transform = `scale(1.5) translate(${offsetX / 1.5}px, ${offsetY / 1.5}px)`;
        boardContainer.style.transition = 'transform 1.5s ease-in-out';
        
        // Tambahkan overlay untuk fokus
        const overlay = document.createElement('div');
        overlay.className = 'zoom-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.3);
            z-index: 9999;
            pointer-events: none;
            animation: overlayFadeIn 0.5s ease-out;
        `;
        
        // Tambahkan CSS untuk animasi overlay
        const style = document.createElement('style');
        style.textContent = `
            @keyframes overlayFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            .game-board.zooming {
                z-index: 10000;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(overlay);
        
        // Setelah zoom selesai, panggil callback
        setTimeout(() => {
            if (callback) callback();
        }, 1500);
    }

    /**
     * Zoom out kembali ke tampilan normal
     */
    zoomOut(callback) {
        const boardContainer = document.querySelector('.game-board');
        
        // Reset transform
        boardContainer.style.transform = '';
        boardContainer.style.transition = 'transform 0.5s ease-in-out';
        
        // Hapus kelas zoom
        setTimeout(() => {
            boardContainer.classList.remove('zooming');
        }, 500);
        
        // Hapus overlay
        const overlay = document.querySelector('.zoom-overlay');
        if (overlay) {
            overlay.style.animation = 'overlayFadeOut 0.5s ease-out';
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 500);
        }
        
        // Tambahkan CSS untuk animasi fade out
        const style = document.createElement('style');
        style.textContent = `
            @keyframes overlayFadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        // Setelah zoom out selesai, panggil callback
        setTimeout(() => {
            if (callback) callback();
        }, 800);
    }

    /**
     * Highlight kotak yang sedang didatangi
     */
    highlightCurrentTile(position) {
        // Hapus highlight sebelumnya
        this.clearTileHighlights();
        
        // Tambahkan highlight pada kotak saat ini
        const tileElement = document.querySelector(`.board-tile[data-id="${position}"]`);
        if (tileElement) {
            tileElement.classList.add('highlighted-tile');
            
            // Tambahkan CSS untuk animasi highlight
            const style = document.createElement('style');
            style.textContent = `
                .highlighted-tile {
                    box-shadow: 0 0 20px #ffd700, 0 0 30px #ffd700, 0 0 40px #ffd700 !important;
                    animation: tilePulse 0.5s ease-in-out;
                    z-index: 1000;
                    position: relative;
                }
                
                @keyframes tilePulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Hapus semua highlight kotak
     */
    clearTileHighlights() {
        const highlightedTiles = document.querySelectorAll('.highlighted-tile');
        highlightedTiles.forEach(tile => {
            tile.classList.remove('highlighted-tile');
        });
    }

    /**
     * Hitung jumlah langkah yang diperlukan
     */
    calculateSteps(fromPosition, toPosition) {
        if (toPosition >= fromPosition) {
            return toPosition - fromPosition;
        } else {
            return (40 - fromPosition) + toPosition;
        }
    }

    /**
     * Tampilkan informasi kotak yang didatangi
     */
    showTileInfo(tileId, turnResult) {
        // Khusus kotak Cyberpedia (id 5, 12, 28, 38), tunggu zoomOut SELESAI PASTI dengan callback, bukan setTimeout
        if ([5, 12, 28, 38].includes(parseInt(tileId))) {
            const boardContainer = document.querySelector('.game-board');
            if (boardContainer && boardContainer.classList.contains('zooming')) {
                this.zoomOut(() => {
                    this.processTurnResult(turnResult);
                    if (turnResult && typeof turnResult.afterTileInfo === 'function') {
                        turnResult.afterTileInfo();
                    }
                });
            } else {
                this.processTurnResult(turnResult);
                if (turnResult && typeof turnResult.afterTileInfo === 'function') {
                    turnResult.afterTileInfo();
                }
            }
            return;
        }
        // Hilangkan pengecekan langsung untuk draw-card, agar info kotak tetap muncul
        const tile = this.game.gameBoard.getTileById(tileId);
        const player = this.game.getPlayer();

        // Buat notifikasi informasi kotak
        const notification = document.createElement('div');
        notification.className = 'tile-info-notification';

        // Tentukan warna berdasarkan tipe kotak
        let tileColor = '#333';
        if (tile.type === 'property') {
            tileColor = tile.color || '#333';
        } else if (tile.type === 'chance') {
            tileColor = '#3498db';
        } else if (tile.type === 'event') {
            tileColor = '#e74c3c';
        } else if (tile.type === 'jail') {
            tileColor = '#f39c12';
        } else if (tile.type === 'start') {
            tileColor = '#27ae60';
        } else if (tile.type === 'game') {
            tileColor = '#9b59b6';
        }

        // Tentukan label tombol
        let buttonLabel = 'OK';
        if (turnResult && turnResult.action === 'draw-card') {
            buttonLabel = 'Ambil Kartu';
        }

        notification.innerHTML = `
            <div class="tile-info-content">
                <div class="tile-info-header" style="background-color: ${tileColor}; min-height: 32px; padding: 10px 0; justify-content: center; font-size: 1.1em;">
                    <span class="tile-number">${tileId}</span>
                </div>
                <div class="tile-info-body" style="text-align: center;">
                    <h3 class="tile-name" style="margin-bottom: 10px;">${tile.name}</h3>
                    <p class="tile-description" style="margin-bottom: 10px;">${tile.description}</p>
                    <button class="tile-info-ok-btn" style="margin-top: 10px; padding: 5px 18px; border-radius: 6px; background: #3498db; color: #fff; border: none; font-size: 0.95em; cursor: pointer;">${buttonLabel}</button>
                </div>
            </div>
        `;

        // Tambahkan styling
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            font-family: 'Arial', sans-serif;
            min-width: 300px;
            max-width: 400px;
            animation: tileInfoFadeIn 0.5s ease-out;
        `;

        // Tambahkan CSS untuk animasi dan styling
        const style = document.createElement('style');
        style.textContent = `
            @keyframes tileInfoFadeIn {
                from {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.8);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
            }
            .tile-info-content { overflow: hidden; border-radius: 15px; }
            .tile-info-header { color: white; display: flex; align-items: center; gap: 10px; font-weight: bold; }
            .tile-number { font-size: 1.1em; }
            .tile-info-body { padding: 20px; }
            .tile-name { margin: 0 0 10px 0; color: #333; font-size: 1.3em; }
            .tile-description { margin: 0 0 10px 0; color: #666; line-height: 1.4; }
            .tile-info-ok-btn:hover { background: #217dbb; }
        `;
        document.head.appendChild(style);
        document.body.appendChild(notification);

        // Tombol OK/Ambil Kartu
        const okBtn = notification.querySelector('.tile-info-ok-btn');
        okBtn.addEventListener('click', () => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            // Proses aksi berdasarkan turnResult
            this.processTurnResult(turnResult);
            if (turnResult && typeof turnResult.afterTileInfo === 'function') {
                turnResult.afterTileInfo();
            }
        });
    }

    /**
     * Proses hasil giliran setelah menampilkan informasi kotak
     */
    processTurnResult(turnResult) {
        // Jika draw-card, hanya set pendingCard dan aktifkan deck, JANGAN langsung tampilkan kartu
        if (turnResult.action === 'draw-card' && turnResult.card) {
            this.activeCardType = turnResult.cardType;
            this.pendingCard = turnResult.card;
            this.pendingCardType = turnResult.cardType;
            this.updateCardDeckStates(); // Update tampilan kartu
            // Tidak langsung showCardInBoard, tunggu user klik deck
            return;
        }
            // Tampilkan instruksi jika pemain mendapat kartu
            if (turnResult.action === 'draw-card' && turnResult.card) {
                // Set tipe kartu aktif
                this.activeCardType = turnResult.cardType;
                this.pendingCard = turnResult.card;
                this.pendingCardType = turnResult.cardType;
                this.updateCardDeckStates(); // Update tampilan kartu
                setTimeout(() => {
                    this.showCardInBoard(this.pendingCard, this.pendingCardType);
                }, 500);
            }
            
            // Update UI
            this.renderPlayerToken();
            this.updatePlayerUI();
            
        // Tambahkan jeda sebelum menampilkan minigame jika ada
            if (turnResult.action === 'play-game') {
                // Cek jika tile id adalah 5, 10, 12, 28, 38 (funfact/fakta & kotak 10)
                const skipPopupTiles = [5, 10, 12, 28, 38];
                const currentTileId = this.game.getPlayer().position;
                if (skipPopupTiles.includes(currentTileId)) {
                    // Langsung proses minigame tanpa popup
                    this.processMinigame(turnResult);
                } else {
                // Tampilkan notifikasi bahwa minigame akan dimulai
                this.showMinigameNotification(() => {
                    // Proses minigame setelah countdown benar-benar selesai
                    this.processMinigame(turnResult);
                });
                }
            }
            
            // Jika dapat kartu, tombol tetap nonaktif sampai kartu diambil
            // Jika ada minigame, tombol tetap nonaktif sampai minigame selesai
            // Jika tidak ada keduanya, aktifkan kembali tombol setelah jeda
            if (!(turnResult.action === 'draw-card' && turnResult.card) && turnResult.action !== 'play-game') {
                setTimeout(() => {
                    this.rollDiceBtn.disabled = false;
                }, 1000);
            }
        if (turnResult.action === 'show-info-then-move') {
            const player = this.game.getPlayer();
            if (turnResult.moveDirection === 'backward') {
                // Jika dari kotak 30 ke 10, animasi mundur tanpa zoom
                if (player.position === 30 && turnResult.targetTile === 10) {
                    // Animasi mundur tanpa zoom
                    let steps = player.position > turnResult.targetTile ? player.position - turnResult.targetTile : (40 - turnResult.targetTile) + player.position;
                    let currentStep = 0;
                    const moveInterval = 500;
                    const moveStep = () => {
                        if (currentStep >= steps) {
                            this.clearTileHighlights();
                            if (typeof callback30done === 'function') callback30done();
                            return;
                        }
                        currentStep++;
                        const newPosition = (player.position - 1 + 40) % 40;
                        player.position = newPosition;
                        this.renderPlayerToken();
                        this.highlightCurrentTile(newPosition);
                        setTimeout(moveStep, moveInterval);
                    };
                    // Callback setelah animasi mundur selesai
                    const callback30done = () => {
                        const infoResult = this.game.processTileAction(player, this.game.gameBoard.getTileById(turnResult.targetTile), { passedStart: false }) || {};
                        const actionResult = { ...infoResult };
                        infoResult.afterTileInfo = () => {
                            this.processTurnResult({ ...actionResult, afterTileInfo: undefined });
                        };
                        this.showTileInfo(turnResult.targetTile, infoResult);
                    };
                    moveStep();
                } else {
                    // Default: animasi mundur dengan zoom
                    this.animateMoveBackward(player.position, turnResult.targetTile, () => {
                        const infoResult = this.game.processTileAction(player, this.game.gameBoard.getTileById(turnResult.targetTile), { passedStart: false }) || {};
                        const actionResult = { ...infoResult };
                        infoResult.afterTileInfo = () => {
                            this.processTurnResult({ ...actionResult, afterTileInfo: undefined });
                        };
                        this.showTileInfo(turnResult.targetTile, infoResult);
                    });
                }
            } else {
                // Default: animasi maju
                this.animatePlayerMovement(player.position, turnResult.targetTile, () => {
                    const infoResult = this.game.processTileAction(player, this.game.gameBoard.getTileById(turnResult.targetTile), { passedStart: false }) || {};
                    const actionResult = { ...infoResult };
                    infoResult.afterTileInfo = () => {
                        this.processTurnResult({ ...actionResult, afterTileInfo: undefined });
                    };
                    this.showTileInfo(turnResult.targetTile, infoResult);
                });
            }
            return;
        }
    }

    /**
     * Tampilkan notifikasi minigame akan dimulai dengan informasi kotak
     */
    showMinigameNotification(callback) {
        // Buat elemen notifikasi
        const notification = document.createElement('div');
        notification.className = 'minigame-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">🎮</div>
                <div class="notification-text">
                    <p id="minigameCountdown">Bersiaplah dalam 3 detik...</p>
                </div>
            </div>
        `;

        // Tambahkan styling
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px 30px;
            border-radius: 30px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            font-family: 'Arial', sans-serif;
            text-align: center;
            animation: notificationFadeIn 0.5s ease-out;
        `;

        // Tambahkan CSS untuk animasi
        const style = document.createElement('style');
        style.textContent = `
            @keyframes notificationFadeIn {
                from {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.8);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 18px;
            }
            .notification-icon {
                font-size: 2.2em;
            }
            .notification-text p {
                margin: 0;
                font-size: 1.1em;
                opacity: 0.95;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(notification);

        let countdown = 3;
        const countdownText = notification.querySelector('#minigameCountdown');
        countdownText.textContent = `Bersiaplah dalam ${countdown} detik...`;
        const interval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                countdownText.textContent = `Bersiaplah dalam ${countdown} detik...`;
            } else {
                clearInterval(interval);
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
                callback(); // Langsung mulai tanpa jeda
            }
        }, 1000);
    }

    /**
     * Tampilkan modal properti
     */
    showPropertyModal(propertyId) {
        const property = this.game.gameBoard.getTileById(propertyId);
        const player = this.game.getPlayer();
        
        // Buat modal
        const modal = document.createElement('div');
        modal.className = 'property-modal';
        
        // Header dengan warna properti
        let headerColor = '#333';
        if (property.type === 'property') {
            headerColor = property.color;
        } else if (property.type === 'station') {
            headerColor = '#333';
        } else if (property.type === 'utility') {
            headerColor = '#3498db';
        }
        
        modal.innerHTML = `
            <div class="property-header" style="background-color: ${headerColor}">
                ${property.type === 'property' ? 'PROPERTI' : property.type === 'station' ? 'SERTIFIKASI' : 'UTILITAS'}
            </div>
            <div class="property-title">${property.name}</div>
            <div class="property-description">${property.description}</div>
            <div class="property-details">
                <div class="property-detail">
                    <span>Harga:</span>
                    <span>${property.price} pts</span>
                </div>
            </div>
            <div class="property-actions">
                <button class="property-buy" ${player.points < property.price ? 'disabled' : ''}>
                    Beli (${property.price} pts)
                </button>
                <button class="property-cancel">Batal</button>
            </div>
        `;
        
        // Tambahkan ke body
        document.body.appendChild(modal);
        
        // Event listener untuk tombol
        const buyBtn = modal.querySelector('.property-buy');
        const cancelBtn = modal.querySelector('.property-cancel');
        
        buyBtn.addEventListener('click', () => {
            // Beli properti
            const success = this.game.buyProperty(player.id, propertyId);
            if (success) {
                // this.addToGameLog(`Anda membeli ${property.name} seharga ${property.price} pts.`); // Fungsi addToGameLog dihapus
                this.updatePlayerUI();
            } else {
                // this.addToGameLog(`Anda tidak dapat membeli ${property.name}.`); // Fungsi addToGameLog dihapus
            }
            document.body.removeChild(modal);
        });
        
        cancelBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    }

    /**
     * Tampilkan kartu di tengah papan permainan
     */
    showCardInBoard(card, cardType = 'action') {
        // Set kelas kartu berdasarkan tipe
        this.displayedCard.className = `chance-card ${cardType}-card`;
        this.frontCardTitle.textContent = cardType === 'action' ? 'KARTU CHANCE' : 'KARTU EVENT';
        this.frontCardIcon.textContent = cardType === 'action' ? '?' : '!';
        // Set konten kartu bagian belakang
        this.backCardTitle.textContent = card.title;
        this.backCardIcon.textContent = card.icon || '?';
        this.cardDescription.textContent = card.description;
        // Set aksi kartu
        let actionText = '';
        if (cardType === 'action' && card.actionText) {
            actionText = card.actionText;
        } else {
            actionText = this.getCardActionText(card);
        }
        this.cardAction.textContent = actionText;
        // Tampilkan kartu
        this.displayCard();
        // Simpan efek kartu yang harus dijalankan setelah klik OK
        this.pendingCardEffect = { card, cardType };
    }

    /**
     * Dapatkan teks aksi kartu
     */
    getCardActionText(card) {
        switch (card.action) {
            case 'collect': return `Dapatkan ${card.value} poin keamanan`;
            case 'pay': return `Bayar ${card.value} poin keamanan`;
            case 'move': return `${card.value > 0 ? 'Maju' : 'Mundur'} ${Math.abs(card.value)} langkah`;
            case 'goto-jail': return 'Pergi ke Cyber Jail';
            case 'goto': return 'Pergi ke kotak Start';
            default: return card.action;
        }
    }

    /**
     * Tampilkan kartu di papan
     */
    displayCard() {
        // Pastikan kartu tidak dalam keadaan terbalik
        this.displayedCard.classList.remove('flipped');
        // Tampilkan overlay dan container kartu
        this.cardOverlay.classList.add('active');
        this.cardDisplayContainer.classList.add('active');
    }



    /**
     * Proses minigame setelah jeda
     */
    processMinigame(turnResult) {
        // Panggil minigame berdasarkan kotak yang didatangi
        const currentTile = this.game.gameBoard.getTileById(this.game.getPlayer().position);
        
        switch (currentTile.id) {
            case 1:
                this.game.playGameFromBox1();
                break;
            case 3:
                this.game.playGameFromBox3();
                break;
            case 4:
                this.game.playGameFromBox4();
                break;
            case 5:
                this.game.playGameFromBox5();
                break;
            case 6:
                this.game.playGameFromBox6();
                break;
            case 8:
                this.game.playGameFromBox8();
                break;
            case 9:
                this.game.playGameFromBox9();
                break;
            case 10:
                this.game.playGameFromBox10();
                break;
            case 11:
                this.game.playGameFromBox11();
                break;
            case 12:
                this.game.playGameFromBox5('Sekitar 9% hingga 15% akun Twitter adalah akun bot, yang digunakan untuk menyebarkan informasi palsu, memanipulasi opini, atau memicu perdebatan');
                break;
            case 13:
                this.game.playGameFromBox13();
                break;
            case 14:
                this.game.playGameFromBox14();
                break;
            case 15:
                this.game.playGameFromBox15();
                break;
            case 16:
                this.game.playGameFromBox16();
                break;
            case 18:
                this.game.playGameFromBox18();
                break;
            case 19:
                this.game.playGameFromBox19();
                break;
            case 21:
                this.game.playGameFromBox21();
                break;
            case 23:
                this.game.playGameFromBox23();
                break;
            case 24:
                this.game.playGameFromBox24();
                break;
            case 25:
                this.game.playGameFromBox25();
                break;
            case 26:
                this.game.playGameFromBox26();
                break;
            case 27:
                this.game.playGameFromBox27();
                break;
            case 28:
                this.game.playGameFromBox5('Foto yang kamu unggah bisa mengungkap lokasi rumahmu lewat data tersembunyi di dalamnya.');
                break;
            case 29:
                this.game.playGameFromBox29();
                break;
            case 31:
                this.game.playGameFromBox31();
                break;
            case 32:
                this.game.playGameFromBox32();
                break;
            case 34:
                this.game.playGameFromBox34();
                break;
            case 35:
                this.game.playGameFromBox35();
                break;
            case 37:
                this.game.playGameFromBox37();
                break;
            case 38:
                this.game.playGameFromBox5('6,5 % total penipuan pada 2024 menggunakan deepfake, termasuk suara/video palsu untuk menipu karyawan senior dan CEO.');
                break;
        }
        
        // Aktifkan kembali tombol lempar dadu setelah minigame dimulai
        // (minigame akan menonaktifkan tombol sendiri jika diperlukan)
        setTimeout(() => {
            this.rollDiceBtn.disabled = false;
        }, 500);
    }

    /**
     * Sembunyikan kartu dari papan permainan
     */
    hideCardInBoard() {
        this.cardOverlay.classList.remove('active');
        this.cardDisplayContainer.classList.remove('active');
        
        // Reset style untuk overlay dan container
        setTimeout(() => {
            this.cardOverlay.style.display = 'none';
            this.cardDisplayContainer.style.display = 'none';
            this.cardOverlay.style.zIndex = '';
            this.cardDisplayContainer.style.zIndex = '';
        }, 500); // Tunggu animasi selesai
        
        // Reset style untuk board-center
        const boardCenter = document.querySelector('.board-center');
        if (boardCenter) {
            boardCenter.style.opacity = '';
            boardCenter.style.visibility = '';
            boardCenter.style.zIndex = '';
        }
        
        // Setelah animasi selesai, kembalikan kartu ke posisi awal
        setTimeout(() => {
            this.displayedCard.classList.remove('flipped');
        }, 300);
    }
    
    /**
     * Proses aksi kartu
     */
    processCardAction(card) {
        // Tidak melakukan apa-apa di sini, efek kartu dijalankan saat klik OK
    }

    /**
     * Tampilkan modal kartu
     */
    showCardModal(card, cardType = 'action') {
        // Set konten kartu
        this.cardTitle.textContent = card.title;
        this.cardIcon.textContent = card.icon || '?';
        this.cardDescription.textContent = card.description;
        
        // Set aksi kartu
        let actionText = '';
        switch (card.action) {
            case 'collect':
                actionText = `Dapatkan ${card.value} poin keamanan`;
                break;
            case 'pay':
                actionText = `Bayar ${card.value} poin keamanan`;
                break;
            case 'move':
                actionText = `${card.value > 0 ? 'Maju' : 'Mundur'} ${Math.abs(card.value)} langkah`;
                break;
            case 'goto-jail':
                actionText = 'Pergi ke Cyber Jail';
                break;
            case 'goto':
                actionText = 'Pergi ke kotak Start';
                break;
            default:
                actionText = card.action;
        }
        this.cardAction.textContent = actionText;
        
        // Set warna berdasarkan tipe kartu
        if (cardType === 'action') {
            this.cardIcon.style.backgroundColor = '#3498db';
            this.cardAction.style.borderLeftColor = '#3498db';
        } else {
            this.cardIcon.style.backgroundColor = '#e74c3c';
            this.cardAction.style.borderLeftColor = '#e74c3c';
        }
        
        // Tampilkan modal
        this.cardModal.classList.add('active');
        
        // Tambahkan ke log permainan
        // this.addToGameLog(`Mengambil kartu ${cardType === 'action' ? 'AKSI' : 'PERISTIWA'}: ${card.title}`); // Fungsi addToGameLog dihapus
    }

    /**
     * Sembunyikan modal kartu
     */
    hideCardModal() {
        this.cardModal.classList.remove('active');
    }

    /**
     * Tampilkan instruksi kartu
     */
    showCardInstructions(cardType) {
        // Dikosongkan, tidak menampilkan instruksi apapun
    }

    /**
     * Sembunyikan instruksi kartu
     */
    hideCardInstructions() {
        // Hapus elemen instruksi jika ada
        const instructions = document.querySelector('.deck-instructions');
        if (instructions) {
            instructions.remove();
        }
    }

    /**
     * Update tampilan kartu yang bisa diklik
     */
    updateCardDeckStates() {
        // Reset semua kartu
        this.actionCardDeck.classList.remove('disabled');
        this.eventCardDeck.classList.remove('disabled');
        
        // Jika ada tipe kartu aktif, nonaktifkan kartu yang tidak sesuai
        if (this.activeCardType) {
            if (this.activeCardType === 'action') {
                this.eventCardDeck.classList.add('disabled');
            } else {
                this.actionCardDeck.classList.add('disabled');
            }
        }
    }

    /**
     * Animasi pergerakan mundur dari kotak 9 ke kotak 6
     */
    animateMoveBackward(fromTile, toTile, callback) {
        const player = this.game.getPlayer();
        // Hitung langkah mundur yang diperlukan
        let steps = 0;
        if (fromTile > toTile) {
            steps = fromTile - toTile;
        } else {
            steps = (40 - toTile) + fromTile;
        }
        let currentStep = 0;
        const moveInterval = 500; // Interval waktu untuk setiap langkah

        // Zoom ke pion terlebih dahulu (sama seperti animatePlayerMovement)
        this.zoomToPlayer(() => {
            setTimeout(() => {
                const moveStep = () => {
                    if (currentStep >= steps) {
                        this.clearTileHighlights();
                        this.zoomOut(() => {
                            if (callback) callback();
                        });
                        return;
                    }
                    currentStep++;
                    // Hitung posisi baru (mundur)
                    const newPosition = (fromTile - currentStep + 40) % 40;
                    player.position = newPosition;
                    this.renderPlayerToken();
                    this.highlightCurrentTile(newPosition);
                    setTimeout(moveStep, moveInterval);
                };
                moveStep();
            }, 1000);
        });
    }
}

// Inisialisasi game dan UI
let game, ui;

document.addEventListener('DOMContentLoaded', () => {
    game = new Game();
    ui = new UI(game);
});

// Export kelas untuk digunakan di file lain
window.UI = UI;

// === TAB INTERAKSI GAME INFO ===
document.addEventListener('DOMContentLoaded', function() {
    const tabOverview = document.getElementById('tabOverview');
    const tabRanking = document.getElementById('tabRanking');
    const tabContentOverview = document.getElementById('tabContentOverview');
    const tabContentRanking = document.getElementById('tabContentRanking');
    const rankingList = document.getElementById('rankingList');

    function setActiveTab(tab) {
        [tabOverview, tabRanking].forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        tabContentOverview.style.display = 'none';
        tabContentRanking.style.display = 'none';
        if(tab === tabOverview) tabContentOverview.style.display = '';
        if(tab === tabRanking) tabContentRanking.style.display = '';
    }

    tabOverview.addEventListener('click', () => setActiveTab(tabOverview));
    tabRanking.addEventListener('click', () => setActiveTab(tabRanking));

    // Data dummy ranking, bisa diganti dengan data asli dari game
    const rankingData = [
        { username: 'User1', points: 3200 },
        { username: 'CyberHero', points: 2800 },
        { username: 'NetGuard', points: 2100 },
        { username: 'Anon', points: 1800 },
        { username: 'PlayerX', points: 1200 }
    ];

    function renderRanking() {
        rankingList.innerHTML = '';
        rankingData.sort((a, b) => b.points - a.points);
        rankingData.forEach((user, idx) => {
            const div = document.createElement('div');
            div.className = 'ranking-item';
            // Ambil inisial username (huruf pertama)
            const initial = user.username.charAt(0).toUpperCase();
            div.innerHTML = `
                <span class="ranking-rank">${idx+1}.</span>
                <span class="ranking-avatar">${initial}</span>
                <span class="ranking-username">${user.username}</span>
                <span class="ranking-points">${user.points} pts</span>
            `;
            rankingList.appendChild(div);
        });
    }

    renderRanking();
}); 