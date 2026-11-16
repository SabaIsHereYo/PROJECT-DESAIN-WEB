// ambil status sesi akun dan POV dari localStorage
function ambilSesi() {
  const defaultSesi = {
    username: 'Tamu_Gamer',
    pov: 'user',
    sudahLogin: false
  };
  return JSON.parse(localStorage.getItem('indiearc_sesi')) || defaultSesi;
}

function simpanSesi(sesiBaru) {
  localStorage.setItem('indiearc_sesi', JSON.stringify(sesiBaru));
}

// perbarui tampilan navbar dan akses POV di semua halaman
function terapkanTampilanPov() {
  const sesi = ambilSesi();
  const btnGantiPov = document.getElementById('btnGantiPov');
  const linkAuth = document.getElementById('linkAuth');
  const linkDevHub = document.getElementById('linkDevHub');
  const sapaanToko = document.getElementById('sapaanToko');

  if (btnGantiPov) {
    if (sesi.pov === 'developer') {
      btnGantiPov.textContent = 'POV: Developer (' + sesi.username + ')';
      btnGantiPov.classList.add('mode-dev');
    } else {
      btnGantiPov.textContent = 'POV: User (' + sesi.username + ')';
      btnGantiPov.classList.remove('mode-dev');
    }
  }

  if (linkAuth) {
    if (sesi.sudahLogin) {
      linkAuth.textContent = 'Logout';
      linkAuth.href = '#';
      linkAuth.onclick = function (e) {
        e.preventDefault();
        localStorage.removeItem('indiearc_sesi');
        alert('Berhasil keluar dari akun.');
        window.location.href = 'Index.html';
      };
    } else {
      linkAuth.textContent = 'Login';
      linkAuth.href = 'Login.html';
    }
  }

  if (linkDevHub) {
    if (sesi.pov === 'user') {
      linkDevHub.classList.add('terkunci');
      linkDevHub.title = 'Ganti ke POV Developer untuk membuka menu ini';
    } else {
      linkDevHub.classList.remove('terkunci');
      linkDevHub.title = 'Dashboard Developer';
    }
  }

  if (sapaanToko) {
    sapaanToko.textContent = 'Aktif sebagai ' + sesi.username + ' (' + sesi.pov.toUpperCase() + '). Pilih game atau demo di bawah.';
  }

  // atur visibilitas konten di halaman DevHub.html
  const pesanBukanDev = document.getElementById('pesanBukanDev');
  const kontenDevHub = document.getElementById('kontenDevHub');
  const namaStudioDev = document.getElementById('namaStudioDev');

  if (pesanBukanDev && kontenDevHub) {
    if (sesi.pov === 'developer') {
      pesanBukanDev.style.display = 'none';
      kontenDevHub.style.display = 'block';
      if (namaStudioDev) namaStudioDev.textContent = sesi.username;
    } else {
      pesanBukanDev.style.display = 'block';
      kontenDevHub.style.display = 'none';
    }
  }
}

terapkanTampilanPov();

// 1. tombol ganti POV cepat di navbar
const btnGantiPov = document.getElementById('btnGantiPov');
if (btnGantiPov) {
  btnGantiPov.addEventListener('click', function () {
    const sesi = ambilSesi();
    if (sesi.pov === 'user') {
      sesi.pov = 'developer';
      if (sesi.username === 'Tamu_Gamer') sesi.username = 'IndieStudio_ID';
      simpanSesi(sesi);
      alert('Beralih ke POV Developer! Menu Dev Hub sekarang terbuka.');
    } else {
      sesi.pov = 'user';
      if (sesi.username === 'IndieStudio_ID') sesi.username = 'Tamu_Gamer';
      simpanSesi(sesi);
      alert('Beralih ke POV User (Gamer)!');
    }
    terapkanTampilanPov();
  });
}

// tombol aktifkan dev di halaman DevHub.html
const btnAktifkanDev = document.getElementById('btnAktifkanDev');
if (btnAktifkanDev) {
  btnAktifkanDev.addEventListener('click', function () {
    const sesi = ambilSesi();
    sesi.pov = 'developer';
    if (sesi.username === 'Tamu_Gamer') sesi.username = 'IndieStudio_ID';
    simpanSesi(sesi);
    terapkanTampilanPov();
  });
}

// 2. menu hamburger di layar HP
const btnMenu = document.getElementById('btnMenu');
const menuNav = document.getElementById('menuNav');
if (btnMenu && menuNav) {
  btnMenu.addEventListener('click', function () {
    menuNav.classList.toggle('buka');
  });
}

// 3 & 4. modal baca berita dan tutup modal (Index.html)
const btnBukaBerita = document.getElementById('btnBukaBerita');
const btnTutupBerita = document.getElementById('btnTutupBerita');
const modalBerita = document.getElementById('modalBerita');

if (btnBukaBerita && modalBerita) {
  btnBukaBerita.addEventListener('click', function () {
    modalBerita.showModal();
  });
}
if (btnTutupBerita && modalBerita) {
  btnTutupBerita.addEventListener('click', function () {
    modalBerita.close();
  });
}

// 5. tombol like berita utama (Index.html)
const btnLikeBerita = document.getElementById('btnLikeBerita');
const jumlahLike = document.getElementById('jumlahLike');
let sudahLike = false;
if (btnLikeBerita && jumlahLike) {
  btnLikeBerita.addEventListener('click', function () {
    let angka = parseInt(jumlahLike.textContent, 10);
    if (!sudahLike) {
      jumlahLike.textContent = angka + 1;
      btnLikeBerita.classList.add('tombol-utama');
      sudahLike = true;
    } else {
      jumlahLike.textContent = angka - 1;
      btnLikeBerita.classList.remove('tombol-utama');
      sudahLike = false;
    }
  });
}

// 6. form kirim komentar berita (Index.html)
const formKomentar = document.getElementById('formKomentar');
const inputKomentar = document.getElementById('inputKomentar');
const daftarKomentar = document.getElementById('daftarKomentar');
if (formKomentar && inputKomentar && daftarKomentar) {
  formKomentar.addEventListener('submit', function (e) {
    e.preventDefault();
    const isi = inputKomentar.value.trim();
    if (!isi) return;

    const sesi = ambilSesi();
    const itemBaru = document.createElement('article');
    itemBaru.className = 'item-komentar';
    itemBaru.innerHTML = '<strong>' + sesi.username + ':</strong> ' + isi;
    daftarKomentar.prepend(itemBaru);
    inputKomentar.value = '';
    alert('Komentar berhasil ditambahkan!');
  });
}

// 7. filter kategori (TokoGame.html & PasarAset.html)
const tombolFilter = document.querySelectorAll('.tombol-filter');
const itemFilter = document.querySelectorAll('.item-filter');

tombolFilter.forEach(function (btn) {
  btn.addEventListener('click', function () {
    tombolFilter.forEach(function (b) {
      b.classList.remove('aktif');
    });
    btn.classList.add('aktif');

    const kategoriDipilih = btn.getAttribute('data-kategori');
    itemFilter.forEach(function (item) {
      const kategoriItem = item.getAttribute('data-kategori');
      if (kategoriDipilih === 'semua' || kategoriItem === kategoriDipilih) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  });
});

// 8. pencarian game real-time (TokoGame.html)
const cariGame = document.getElementById('cariGame');
if (cariGame) {
  cariGame.addEventListener('input', function () {
    const kataKunci = cariGame.value.toLowerCase();
    itemFilter.forEach(function (item) {
      const judul = (item.getAttribute('data-judul') || '').toLowerCase();
      item.style.display = judul.includes(kataKunci) ? 'flex' : 'none';
    });
  });
}

// 9. tombol wishlist game (TokoGame.html)
function toggleWishlist(tombol, namaGame) {
  tombol.classList.toggle('disukai');
  if (tombol.classList.contains('disukai')) {
    tombol.innerHTML = '&#9829;';
    alert('"' + namaGame + '" ditambahkan ke Wishlist!');
  } else {
    tombol.innerHTML = '&#9825;';
    alert('"' + namaGame + '" dihapus dari Wishlist.');
  }
}

// simpan transaksi ke localStorage untuk HistoryPembelianUser.html
function simpanTransaksi(nama, kategori, harga) {
  const daftarLama = JSON.parse(localStorage.getItem('indiearc_history')) || [];
  const nomorAcak = Math.floor(1030 + Math.random() * 8900);
  const tanggalHariIni = new Date().toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  daftarLama.unshift({
    id: '#ARC-' + nomorAcak,
    nama: nama,
    kategori: kategori,
    tanggal: tanggalHariIni,
    harga: harga
  });

  localStorage.setItem('indiearc_history', JSON.stringify(daftarLama));
}

// 10 & 11. tombol beli dan unduh item (TokoGame.html & PasarAset.html)
function beliItem(nama, kategori, harga) {
  const sesi = ambilSesi();
  const konfirmasi = confirm('Akun: ' + sesi.username + '\nLanjutkan pembelian "' + nama + '" seharga ' + harga + '?');
  if (konfirmasi) {
    simpanTransaksi(nama, kategori, harga);
    alert('Pembelian berhasil! Item tercatat di halaman History.');
  }
}

function unduhItem(nama, kategori) {
  simpanTransaksi(nama, kategori, 'Gratis');
  alert('Unduhan dimulai untuk "' + nama + '". Riwayat tercatat di halaman History.');
}

// 12. info lisensi aset (PasarAset.html)
function infoLisensi(jenis, keterangan) {
  alert('Jenis Lisensi: ' + jenis + '\n\nKetentuan:\n' + keterangan);
}

// 13 & 14. daftar event dan pengingat rilis (Event.html)
function daftarEvent(tombol, namaEvent) {
  const sesi = ambilSesi();
  alert('Pendaftaran berhasil! Akun "' + sesi.username + '" terdaftar di "' + namaEvent + '".');
  tombol.textContent = 'Sudah Terdaftar';
  tombol.disabled = true;
}

function aktifkanPengingat(tombol, namaGame) {
  alert('Pengingat jadwal rilis untuk "' + namaGame + '" diaktifkan!');
  tombol.textContent = 'Pengingat Aktif';
}

// 15, 16, 17. fitur halaman DevHub.html
const formPublishGame = document.getElementById('formPublishGame');
const tabelGameDev = document.getElementById('tabelGameDev');
if (formPublishGame && tabelGameDev) {
  formPublishGame.addEventListener('submit', function (e) {
    e.preventDefault();
    const judul = document.getElementById('judulGameBaru').value.trim();
    const jenis = document.getElementById('jenisRilisBaru').value;
    const harga = document.getElementById('hargaGameBaru').value.trim();

    const baris = document.createElement('tr');
    baris.innerHTML =
      '<td><strong>' + judul + '</strong> (' + jenis + ')</td>' +
      '<td><button class="badge-aktif tombol-status" onclick="ubahStatusGame(this)">Tayang</button></td>' +
      '<td>' + harga + '</td>' +
      '<td>1 orang</td>' +
      '<td>0 pembeli</td>' +
      '<td>Rp 0</td>';

    tabelGameDev.prepend(baris);
    formPublishGame.reset();
    alert('Game "' + judul + '" berhasil dipublikasikan ke daftar developer!');
  });
}

function ubahStatusGame(tombol) {
  if (tombol.textContent === 'Tayang') {
    tombol.textContent = 'Draft';
    tombol.classList.add('badge-draft');
  } else {
    tombol.textContent = 'Tayang';
    tombol.classList.remove('badge-draft');
  }
}

const btnTarikSaldo = document.getElementById('btnTarikSaldo');
const saldoDev = document.getElementById('saldoDev');
if (btnTarikSaldo && saldoDev) {
  btnTarikSaldo.addEventListener('click', function () {
    if (saldoDev.textContent === 'Rp 0') {
      alert('Saldo pendapatan saat ini sudah ditarik.');
      return;
    }
    const yakin = confirm('Tarik seluruh saldo pendapatan (' + saldoDev.textContent + ') ke rekening terdaftar?');
    if (yakin) {
      saldoDev.textContent = 'Rp 0';
      alert('Permintaan pencairan dana berhasil diproses!');
    }
  });
}

// 18 & 19. render riwayat transaksi dan tombol reset (HistoryPembelianUser.html)
const tabelHistory = document.getElementById('tabelHistory');
if (tabelHistory) {
  const dataTersimpan = JSON.parse(localStorage.getItem('indiearc_history')) || [];
  dataTersimpan.forEach(function (item) {
    const baris = document.createElement('tr');
    baris.innerHTML =
      '<td>' + item.id + '</td>' +
      '<td><strong>' + item.nama + '</strong></td>' +
      '<td>' + item.kategori + '</td>' +
      '<td>' + item.tanggal + '</td>' +
      '<td>' + item.harga + '</td>' +
      '<td><button class="tombol tombol-sekunder" onclick="alert(\'Mengunduh file ' + item.nama + '...\')">Unduh</button></td>';
    tabelHistory.prepend(baris);
  });
}

const btnResetHistory = document.getElementById('btnResetHistory');
if (btnResetHistory) {
  btnResetHistory.addEventListener('click', function () {
    localStorage.removeItem('indiearc_history');
    alert('Riwayat transaksi baru telah direset.');
    location.reload();
  });
}

// 20 & 21. form Login.html dan Register.html
const formLogin = document.getElementById('formLogin');
if (formLogin) {
  formLogin.addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    const roleDipilih = document.querySelector('input[name="roleLogin"]:checked').value;

    simpanSesi({
      username: username,
      pov: roleDipilih,
      sudahLogin: true
    });

    alert('Selamat datang, ' + username + '! Anda masuk dalam mode POV ' + roleDipilih.toUpperCase() + '.');
    window.location.href = roleDipilih === 'developer' ? 'DevHub.html' : 'Index.html';
  });
}

const formRegister = document.getElementById('formRegister');
if (formRegister) {
  formRegister.addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('regUsername').value.trim();
    const pass = document.getElementById('regPassword').value;
    const konfirmasi = document.getElementById('regKonfirmasi').value;
    const roleDipilih = document.querySelector('input[name="roleRegister"]:checked').value;

    if (pass !== konfirmasi) {
      alert('Kata sandi dan konfirmasi kata sandi tidak cocok!');
      return;
    }

    simpanSesi({
      username: username,
      pov: roleDipilih,
      sudahLogin: true
    });

    alert('Pendaftaran berhasil! Akun "' + username + '" aktif sebagai ' + roleDipilih.toUpperCase() + '.');
    window.location.href = roleDipilih === 'developer' ? 'DevHub.html' : 'Index.html';
  });
}
