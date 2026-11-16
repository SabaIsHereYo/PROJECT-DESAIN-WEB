// menu hamburger di layar kecil
const btnMenu = document.getElementById('btnMenu');
const menuNav = document.getElementById('menuNav');

if (btnMenu && menuNav) {
  btnMenu.addEventListener('click', function () {
    menuNav.classList.toggle('buka');
  });
}

// modal baca berita di halaman utama
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

// filter kategori untuk halaman toko game & pasar aset
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

// simpan transaksi ke localStorage agar muncul di HistoryPembelianUser.html
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

// fungsi tombol beli game / aset
function beliItem(nama, kategori, harga) {
  const konfirmasi = confirm('Lanjutkan pembelian "' + nama + '" seharga ' + harga + '?');
  if (konfirmasi) {
    simpanTransaksi(nama, kategori, harga);
    alert('Pembelian berhasil! Item sudah masuk ke halaman History.');
  }
}

// fungsi tombol unduh gratis / demo
function unduhItem(nama, kategori) {
  simpanTransaksi(nama, kategori, 'Gratis');
  alert('Unduhan dimulai untuk "' + nama + '". Riwayat unduhan juga dicatat di halaman History.');
}

// fungsi daftar event
function daftarEvent(namaEvent) {
  alert('Pendaftaran berhasil! Akun IndieStudio_ID tercatat sebagai peserta "' + namaEvent + '".');
}

// tampilkan data transaksi baru di halaman HistoryPembelianUser.html
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

// tombol reset transaksi baru di halaman history
const btnResetHistory = document.getElementById('btnResetHistory');
if (btnResetHistory) {
  btnResetHistory.addEventListener('click', function () {
    localStorage.removeItem('indiearc_history');
    location.reload();
  });
}