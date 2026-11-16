// daftar akun bawaan
const AKUN_BAWAAN = [
  { username: 'IndieStudio_ID', password: 'dev123', role: 'developer', label: 'Developer' },
  { username: 'Budi_Gamer', password: 'user123', role: 'user', label: 'User' },
  { username: 'admin', password: 'admin123', role: 'developer', label: 'Developer' }
];

function ambilDaftarAkun() {
  const akunTersimpan = JSON.parse(localStorage.getItem('indiearc_accounts')) || [];
  return AKUN_BAWAAN.concat(akunTersimpan);
}

function ambilSesi() {
  const defaultSesi = {
    username: 'Tamu',
    role: 'guest',
    mode: 'user',
    sudahLogin: false
  };
  return JSON.parse(localStorage.getItem('indiearc_sesi')) || defaultSesi;
}

function simpanSesi(sesiBaru) {
  localStorage.setItem('indiearc_sesi', JSON.stringify(sesiBaru));
}

// perbarui tampilan navbar dan halaman sesuai akun yang login
function perbaruiTampilanAkun() {
  const sesi = ambilSesi();
  const btnMode = document.getElementById('btnMode');
  const linkAuth = document.getElementById('linkAuth');
  const linkDevHub = document.getElementById('linkDevHub');
  const sapaanToko = document.getElementById('sapaanToko');

  if (btnMode) {
    btnMode.classList.remove('mode-tamu', 'mode-dev');

    if (!sesi.sudahLogin) {
      btnMode.textContent = 'Belum Login';
      btnMode.classList.add('mode-tamu');
      btnMode.title = 'Klik untuk login';
    } else if (sesi.role === 'developer' && sesi.mode === 'developer') {
      btnMode.textContent = 'Developer: ' + sesi.username;
      btnMode.classList.add('mode-dev');
      btnMode.title = 'Klik untuk lihat tampilan User';
    } else if (sesi.role === 'developer' && sesi.mode === 'user') {
      btnMode.textContent = 'User: ' + sesi.username;
      btnMode.title = 'Klik untuk kembali ke tampilan Developer';
    } else {
      btnMode.textContent = 'User: ' + sesi.username;
      btnMode.title = 'Akun User';
    }
  }

  if (linkAuth) {
    if (sesi.sudahLogin) {
      linkAuth.textContent = 'Logout';
      linkAuth.href = '#';
      linkAuth.onclick = function (e) {
        e.preventDefault();
        localStorage.removeItem('indiearc_sesi');
        alert('Berhasil logout.');
        window.location.href = 'Index.html';
      };
    } else {
      linkAuth.textContent = 'Login';
      linkAuth.href = 'Login.html';
    }
  }

  if (linkDevHub) {
    if (!sesi.sudahLogin || sesi.role !== 'developer' || sesi.mode !== 'developer') {
      linkDevHub.classList.add('terkunci');
      linkDevHub.title = 'Khusus akun Developer';
    } else {
      linkDevHub.classList.remove('terkunci');
      linkDevHub.title = 'Dashboard Developer';
    }
  }

  if (sapaanToko) {
    const info = sesi.sudahLogin
      ? 'Login sebagai ' + sesi.username
      : 'Belum login';
    sapaanToko.textContent = info + '. Pilih game atau demo di bawah.';
  }

  // atur akses halaman DevHub.html
  const pesanBukanDev = document.getElementById('pesanBukanDev');
  const kontenDevHub = document.getElementById('kontenDevHub');
  const judulAksesDev = document.getElementById('judulAksesDev');
  const deskripsiAksesDev = document.getElementById('deskripsiAksesDev');
  const namaStudioDev = document.getElementById('namaStudioDev');

  if (pesanBukanDev && kontenDevHub) {
    if (sesi.sudahLogin && sesi.role === 'developer' && sesi.mode === 'developer') {
      pesanBukanDev.style.display = 'none';
      kontenDevHub.style.display = 'block';
      if (namaStudioDev) namaStudioDev.textContent = sesi.username;
    } else {
      pesanBukanDev.style.display = 'block';
      kontenDevHub.style.display = 'none';

      if (!sesi.sudahLogin) {
        if (judulAksesDev) judulAksesDev.textContent = 'Halaman Khusus Developer';
        if (deskripsiAksesDev) {
          deskripsiAksesDev.textContent = 'Anda belum login. Silakan login menggunakan akun Developer untuk membuka halaman ini.';
        }
      } else if (sesi.role !== 'developer') {
        if (judulAksesDev) judulAksesDev.textContent = 'Akses Ditolak';
        if (deskripsiAksesDev) {
          deskripsiAksesDev.textContent = 'Akun "' + sesi.username + '" adalah akun User. Gunakan akun Developer untuk membuka Dev Hub.';
        }
      } else {
        if (judulAksesDev) judulAksesDev.textContent = 'Tampilan User Aktif';
        if (deskripsiAksesDev) {
          deskripsiAksesDev.textContent = 'Anda sedang memakai tampilan User. Klik tombol akun di kanan atas untuk kembali ke tampilan Developer.';
        }
      }
    }
  }
}

perbaruiTampilanAkun();

// tombol status akun di navbar
const btnMode = document.getElementById('btnMode');
if (btnMode) {
  btnMode.addEventListener('click', function () {
    const sesi = ambilSesi();

    if (!sesi.sudahLogin) {
      alert('Anda belum login. Silakan login terlebih dahulu.');
      window.location.href = 'Login.html';
      return;
    }

    if (sesi.role !== 'developer') {
      alert('Akun "' + sesi.username + '" terdaftar sebagai User. Login dengan akun Developer untuk membuka mode Developer.');
      return;
    }

    if (sesi.mode === 'developer') {
      sesi.mode = 'user';
      simpanSesi(sesi);
      alert('Beralih ke tampilan User.');
    } else {
      sesi.mode = 'developer';
      simpanSesi(sesi);
      alert('Kembali ke tampilan Developer.');
    }
    perbaruiTampilanAkun();
  });
}

// menu hamburger di layar HP
const btnMenu = document.getElementById('btnMenu');
const menuNav = document.getElementById('menuNav');
if (btnMenu && menuNav) {
  btnMenu.addEventListener('click', function () {
    menuNav.classList.toggle('buka');
  });
}

// modal baca berita (Index.html)
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

// tombol suka berita (Index.html)
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

// kirim komentar berita (Index.html)
const formKomentar = document.getElementById('formKomentar');
const inputKomentar = document.getElementById('inputKomentar');
const daftarKomentar = document.getElementById('daftarKomentar');
if (formKomentar && inputKomentar && daftarKomentar) {
  formKomentar.addEventListener('submit', function (e) {
    e.preventDefault();
    const isi = inputKomentar.value.trim();
    if (!isi) return;

    const sesi = ambilSesi();
    const namaPengirim = sesi.sudahLogin ? sesi.username : 'Tamu';
    const itemBaru = document.createElement('article');
    itemBaru.className = 'item-komentar';
    itemBaru.innerHTML = '<strong>' + namaPengirim + ':</strong> ' + isi;
    daftarKomentar.prepend(itemBaru);
    inputKomentar.value = '';
    alert('Komentar terkirim!');
  });
}

// filter kategori (TokoGame.html & PasarAset.html)
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

// pencarian game (TokoGame.html)
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

// wishlist game (TokoGame.html)
function toggleWishlist(tombol, namaGame) {
  tombol.classList.toggle('disukai');
  if (tombol.classList.contains('disukai')) {
    tombol.innerHTML = '&#9829;';
    alert('"' + namaGame + '" ditambahkan ke Wishlist.');
  } else {
    tombol.innerHTML = '&#9825;';
    alert('"' + namaGame + '" dihapus dari Wishlist.');
  }
}

// simpan transaksi ke localStorage
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

// beli dan unduh item (TokoGame.html & PasarAset.html)
function beliItem(nama, kategori, harga) {
  const sesi = ambilSesi();
  if (!sesi.sudahLogin) {
    alert('Silakan login terlebih dahulu sebelum membeli.');
    window.location.href = 'Login.html';
    return;
  }
  const konfirmasi = confirm('Akun: ' + sesi.username + '\nBeli "' + nama + '" seharga ' + harga + '?');
  if (konfirmasi) {
    simpanTransaksi(nama, kategori, harga);
    alert('Pembelian berhasil! Cek di halaman History.');
  }
}

function unduhItem(nama, kategori) {
  simpanTransaksi(nama, kategori, 'Gratis');
  alert('Mengunduh "' + nama + '"...');
}

// info lisensi aset (PasarAset.html)
function infoLisensi(jenis, keterangan) {
  alert('Lisensi: ' + jenis + '\n\n' + keterangan);
}

// daftar event dan pengingat rilis (Event.html)
function daftarEvent(tombol, namaEvent) {
  const sesi = ambilSesi();
  if (!sesi.sudahLogin) {
    alert('Silakan login terlebih dahulu untuk mendaftar event.');
    window.location.href = 'Login.html';
    return;
  }
  alert('Berhasil mendaftar "' + namaEvent + '" atas nama ' + sesi.username + '.');
  tombol.textContent = 'Terdaftar';
  tombol.disabled = true;
}

function aktifkanPengingat(tombol, namaGame) {
  alert('Pengingat rilis "' + namaGame + '" diaktifkan.');
  tombol.textContent = 'Diingatkan';
}

// tambah game baru di DevHub.html
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
    alert('Game "' + judul + '" berhasil ditambahkan.');
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
      alert('Saldo sudah ditarik.');
      return;
    }
    const yakin = confirm('Tarik saldo sebesar ' + saldoDev.textContent + '?');
    if (yakin) {
      saldoDev.textContent = 'Rp 0';
      alert('Penarikan saldo berhasil diproses.');
    }
  });
}

// tampilkan history transaksi (HistoryPembelianUser.html)
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
      '<td><button class="tombol tombol-sekunder" onclick="alert(\'Mengunduh ' + item.nama + '...\')">Unduh</button></td>';
    tabelHistory.prepend(baris);
  });
}

const btnResetHistory = document.getElementById('btnResetHistory');
if (btnResetHistory) {
  btnResetHistory.addEventListener('click', function () {
    localStorage.removeItem('indiearc_history');
    alert('Transaksi baru telah dihapus.');
    location.reload();
  });
}

// login (Login.html)
const formLogin = document.getElementById('formLogin');
if (formLogin) {
  formLogin.addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const roleDipilih = document.querySelector('input[name="roleLogin"]:checked').value;

    const daftarAkun = ambilDaftarAkun();
    const akunCocok = daftarAkun.find(function (a) {
      return a.username.toLowerCase() === username.toLowerCase();
    });

    if (!akunCocok) {
      alert('Username tidak ditemukan.');
      return;
    }

    if (akunCocok.password !== password) {
      alert('Kata sandi salah.');
      return;
    }

    if (roleDipilih === 'developer' && akunCocok.role !== 'developer') {
      alert('Akun ini bukan akun Developer.');
      return;
    }

    simpanSesi({
      username: akunCocok.username,
      role: akunCocok.role,
      mode: roleDipilih,
      sudahLogin: true
    });

    alert('Berhasil masuk sebagai ' + akunCocok.username + '.');
    window.location.href = roleDipilih === 'developer' ? 'DevHub.html' : 'Index.html';
  });
}

// register (Register.html)
const formRegister = document.getElementById('formRegister');
if (formRegister) {
  formRegister.addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('regUsername').value.trim();
    const pass = document.getElementById('regPassword').value;
    const konfirmasi = document.getElementById('regKonfirmasi').value;
    const roleDipilih = document.querySelector('input[name="roleRegister"]:checked').value;

    if (pass !== konfirmasi) {
      alert('Konfirmasi kata sandi tidak sama.');
      return;
    }

    const daftarAkun = ambilDaftarAkun();
    const sudahAda = daftarAkun.some(function (a) {
      return a.username.toLowerCase() === username.toLowerCase();
    });

    if (sudahAda) {
      alert('Username sudah digunakan.');
      return;
    }

    const akunTersimpan = JSON.parse(localStorage.getItem('indiearc_accounts')) || [];
    akunTersimpan.push({
      username: username,
      password: pass,
      role: roleDipilih,
      label: roleDipilih === 'developer' ? 'Developer' : 'User'
    });
    localStorage.setItem('indiearc_accounts', JSON.stringify(akunTersimpan));

    simpanSesi({
      username: username,
      role: roleDipilih,
      mode: roleDipilih,
      sudahLogin: true
    });

    alert('Pendaftaran berhasil! Selamat datang, ' + username + '.');
    window.location.href = roleDipilih === 'developer' ? 'DevHub.html' : 'Index.html';
  });
}
