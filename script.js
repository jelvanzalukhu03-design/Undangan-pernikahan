// ==========================================
// JAVASCRIPT ENGINE - UNDANGAN PREMIUM v2.0
// ==========================================

// 1. MANAJEMEN PEMBUKAAN UNDANGAN & MUSIK LATAR
function openInvitation() {
    const welcomeScreen = document.getElementById('welcome-screen');
    const musicBtn = document.getElementById('musicBtn');
    const audio = document.getElementById('weddingBgm');

    // Memicu animasi meluncur ke atas yang sangat halus
    if (welcomeScreen) {
        welcomeScreen.classList.add('hidden');
    }
    
    // Putar musik secara otomatis (Mengatasi kebijakan privasi interaksi browser)
    if (audio) {
        audio.play().then(() => {
            if (musicBtn) musicBtn.classList.add('playing');
        }).catch(error => {
            console.log("Autoplay diblokir browser, musik berjalan setelah interaksi pengguna.");
        });
    }
}

function toggleMusic() {
    const audio = document.getElementById('weddingBgm');
    const btn = document.getElementById('musicBtn');
    
    if (!audio || !btn) return;

    if (audio.paused) {
        audio.play();
        btn.classList.add('playing');
    } else {
        audio.pause();
        btn.classList.remove('playing');
    }
}

// 2. LOGIKA HITUNG MUNDUR (COUNTDOWN TIMER) ELEGAN
// Silakan sesuaikan target tanggal pernikahan Anda di bawah ini
const weddingDate = new Date("December 25, 2026 08:00:00").getTime();

const updateCountdown = setInterval(() => {
    const now = new Date().getTime();
    const timeLeft = weddingDate - now;

    if (timeLeft < 0) {
        clearInterval(updateCountdown);
        const container = document.querySelector('.countdown-container');
        if (container) container.innerHTML = "<h3>Acara Telah Berlangsung</h3>";
        return;
    }

    // Perhitungan matematika waktu dasar
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    // Format agar menambahkan angka 0 di depan jika digit tunggal (< 10)
    const formatNumber = (num) => num < 10 ? `0${num}` : num;

    // Perbarui elemen DOM
    const dEl = document.getElementById("days");
    const hEl = document.getElementById("hours");
    const mEl = document.getElementById("minutes");
    const sEl = document.getElementById("seconds");

    if (dEl) dEl.innerText = formatNumber(days);
    if (hEl) hEl.innerText = formatNumber(hours);
    if (mEl) mEl.innerText = formatNumber(minutes);
    if (sEl) sEl.innerText = formatNumber(seconds);

}, 1000);

// 3. LOGIKA BUKU TAMU DIGITAL (GUESTBOOK) INTERAKTIF
function submitComment(event) {
    event.preventDefault();
    
    const nameInput = document.getElementById('guestName');
    const statusInput = document.getElementById('guestStatus');
    const msgInput = document.getElementById('guestMsg');
    const feedContainer = document.getElementById('messagesFeed');
    
    if (!nameInput || !statusInput || !msgInput || !feedContainer) return;
    if (nameInput.value.trim() === '' || statusInput.value === '' || msgInput.value.trim() === '') return;

    // Membuat Format Waktu Lokal Indonesia (WIB) secara Dinamis
    const now = new Date();
    const timeOptions = { hour: '2-digit', minute: '2-digit' };
    const dateOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    const formattedTime = `${now.toLocaleDateString('id-ID', dateOptions)} - ${now.toLocaleTimeString('id-ID', timeOptions)} WIB`;

    // Pengaturan warna badge status RSVP
    let statusClass = 'status-hadir';
    if (statusInput.value === 'Tidak Hadir') statusClass = 'status-tidak';
    if (statusInput.value === 'Masih Ragu') statusClass = 'status-ragu';

    // Membuat kerangka HTML Card pesan baru
    const newCard = document.createElement('div');
    newCard.className = 'message-card';
    // Menambahkan inline style transisi awal untuk efek animasi masuk yang smooth
    newCard.style.opacity = '0';
    newCard.style.transform = 'translateY(15px)';
    newCard.style.transition = 'all 0.4s ease';
    
    newCard.innerHTML = `
        <div class="message-header">
            <span class="msg-author">${escapeHTML(nameInput.value)}</span>
            <span class="msg-status ${statusClass}">${statusInput.value}</span>
            <span class="msg-time">${formattedTime}</span>
        </div>
        <div class="msg-content">${escapeHTML(msgInput.value)}</div>
    `;
    
    // Memasukkan pesan baru di baris teratas feed
    feedContainer.insertBefore(newCard, feedContainer.firstChild);
    
    // Eksekusi animasi transisi pop-in
    setTimeout(() => {
        newCard.style.opacity = '1';
        newCard.style.transform = 'translateY(0)';
    }, 50);
    
    // Reset isian Form setelah berhasil dikirim
    nameInput.value = '';
    statusInput.value = '';
    msgInput.value = '';
    
    // Notifikasi sukses kecil
    alert('Terima kasih! Ucapan dan konfirmasi kehadiran Anda berhasil disimpan. ✨');
}

// Fitur Keamanan: Mencegah serangan injeksi script HTML jahat (XSS) dari input kolom komentar
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}
