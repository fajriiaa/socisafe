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
                switch (card.action) {
                    case 'collect':
                        player.points += card.value;
                        break;
                    case 'pay':
                        player.points = Math.max(0, player.points - card.value);
                        break;
                    case 'move':
                        this.game.movePlayer(player.id, card.value);
                        this.renderPlayerToken();
                        break;
                    case 'goto-jail':
                        this.game.sendPlayerToJail(player.id);
                        this.renderPlayerToken();
                        break;
                    case 'goto':
                        this.game.movePlayerToStart(player.id);
                        this.renderPlayerToken();
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
        token.style.transform = 'translate(-50%, -30%) scale(0.25)';
        
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
            
            // Tambahkan ke log permainan
            // this.addToGameLog(`Anda melempar dadu: ${diceResult.dice1}`); // Fungsi addToGameLog dihapus
            
            // Proses giliran
            const turnResult = this.game.processTurn(diceResult);
            
            // Tampilkan hasil giliran
            // this.addToGameLog(turnResult.message); // Fungsi addToGameLog dihapus
            
            // Tampilkan instruksi jika pemain mendapat kartu
            if (turnResult.action === 'draw-card' && turnResult.card) {
                // Set tipe kartu aktif
                this.activeCardType = turnResult.cardType;
                this.pendingCard = turnResult.card;
                this.pendingCardType = turnResult.cardType;
                this.updateCardDeckStates(); // Update tampilan kartu
                setTimeout(() => {
                    this.showCardInstructions(turnResult.cardType);
                }, 500);
            }
            
            // Update UI
            this.renderPlayerToken();
            this.updatePlayerUI();
            
            // Tambahkan jeda 2 detik sebelum menampilkan minigame jika ada
            if (turnResult.action === 'play-game') {
                // Cek jika tile id adalah 5, 12, 28, 38 (funfact/fakta)
                const skipPopupTiles = [5, 12, 28, 38];
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
        }, 500);
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
        const actionText = this.getCardActionText(card);
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
     * Tampilkan notifikasi minigame akan dimulai
     */
    showMinigameNotification(callback) {
        // Buat elemen notifikasi
        const notification = document.createElement('div');
        notification.className = 'minigame-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">🎮</div>
                <div class="notification-text">
                    <h3>Minigame Akan Dimulai!</h3>
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
            border-radius: 15px;
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
                gap: 15px;
            }
            
            .notification-icon {
                font-size: 2em;
            }
            
            .notification-text h3 {
                margin: 0 0 5px 0;
                font-size: 1.2em;
            }
            
            .notification-text p {
                margin: 0;
                font-size: 0.9em;
                opacity: 0.9;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(notification);
        
        let countdown = 3;
        const countdownText = notification.querySelector('#minigameCountdown');
        const interval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                countdownText.textContent = `Bersiaplah dalam ${countdown} detik...`;
            } else if (countdown === 0) {
                countdownText.textContent = `Bersiaplah dalam 1 detik...`;
            } else {
                clearInterval(interval);
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
                callback(); // Panggil callback setelah countdown selesai
            }
        }, 1000);
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
            case 6:
                this.game.playGameFromBox6();
                break;
            case 8:
                this.game.playGameFromBox8();
                break;
            case 9:
                this.game.playGameFromBox9();
                break;
            case 11:
                this.game.playGameFromBox11();
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
        // Dikosongkan agar instruksi tidak muncul lagi
        // const instructions = document.createElement('div');
        // instructions.className = 'deck-instructions';
        // instructions.textContent = `Silakan klik kartu ${cardType === 'action' ? 'CHANCE' : 'EVENT'} untuk mengambil kartu!`;
        // document.body.appendChild(instructions);
        // setTimeout(() => { instructions.classList.add('active'); }, 100);
    }

    /**
     * Sembunyikan instruksi kartu
     */
    hideCardInstructions() {
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
        
        const moveStep = () => {
            if (currentStep >= steps) {
                // Setelah selesai bergerak, panggil callback
                if (callback) callback();
                return;
            }
            
            currentStep++;
            // Hitung posisi baru (mundur)
            const newPosition = (fromTile - currentStep + 40) % 40;
            
            // Update posisi pemain
            player.position = newPosition;
            
            // Render ulang token
            this.renderPlayerToken();
            
            // Lanjutkan ke langkah berikutnya
            setTimeout(moveStep, moveInterval);
        };
        
        // Mulai animasi
        moveStep();
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