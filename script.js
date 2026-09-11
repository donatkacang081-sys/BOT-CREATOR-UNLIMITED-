/*
  BOT CREATOR UNLIMITED PRO X

  HARGA YANG DITAMPILKAN:
    1 Bulan  = Rp300.000
    3 Bulan  = Rp500.000
    1 Tahun  = Rp1.000.000

  HARGA NORMAL:
    1 Bulan  = Rp450.000
    3 Bulan  = Rp1.000.000
    1 Tahun  = Rp3.600.000

  KODE AFFILIATE:
    AFFILIATE
    PROMO
    PARTNER
*/


// ============================================================
// KODE AFFILIATE
// ============================================================

const AFFILIATE_CODES = {
  AFFILIATE: {
    name: "Affiliate"
  },

  PROMO: {
    name: "Promo Affiliate"
  },

  PARTNER: {
    name: "Partner"
  }
};


// ============================================================
// STATUS PROMO
// ============================================================

let affiliatePromoActive = false;
let activePromo = "";


// ============================================================
// HARGA PROMO DEFAULT
// PROMO LANGSUNG AKTIF DARI AWAL
// ============================================================

const DEFAULT_PROMO = true;


// ============================================================
// FORMAT RUPIAH
// ============================================================

function formatRupiah(number) {
  return new Intl.NumberFormat("id-ID").format(
    Math.round(number)
  );
}


// ============================================================
// AMBIL KODE REFERRAL DARI URL
// CONTOH:
// ?ref=AFFILIATE
// ============================================================

function getReferralCode() {

  const ref =
    new URLSearchParams(window.location.search).get("ref");

  return (ref || "")
    .trim()
    .toUpperCase();
}


// ============================================================
// REFERRAL OTOMATIS DARI URL
// ============================================================

function applyReferralFromUrl() {

  const code = getReferralCode();

  const input =
    document.getElementById("promoInput");


  if (code && input) {

    input.value = code;

    applyPromo(true);

  } else {

    // Tidak ada referral
    // Harga promo tetap tampil
    affiliatePromoActive = true;

    activePromo = "";

    refreshPrices();

  }
}


// ============================================================
// INFO AFFILIATE
// ============================================================

function showAffiliateInfo() {

  const box =
    document.getElementById("affiliateInfo");


  if (!box) return;


  if (!activePromo) {

    box.hidden = true;

    return;
  }


  const data =
    AFFILIATE_CODES[activePromo];


  box.innerHTML =
    `🎉 <b>Harga Affiliate Aktif</b><br>` +
    `<span>Referral: <b>${activePromo}</b>` +
    `${data?.name ? ` — ${data.name}` : ""}</span>`;


  box.hidden = false;
}


// ============================================================
// APPLY PROMO
// ============================================================

function applyPromo(fromUrl = false) {

  const input =
    document.getElementById("promoInput");

  const message =
    document.getElementById("promoMessage");


  if (!input || !message) return;


  const code =
    input.value
      .trim()
      .toUpperCase();


  // ==========================================================
  // KODE KOSONG
  // ==========================================================

  if (!code) {

    // Promo tetap aktif
    affiliatePromoActive = true;

    activePromo = "";


    message.textContent =
      "✓ Harga promo sedang aktif.";


    message.style.color =
      "#7ce7b0";


    refreshPrices();

    showAffiliateInfo();

    return;
  }


  // ==========================================================
  // KODE VALID
  // ==========================================================

  if (
    Object.prototype.hasOwnProperty.call(
      AFFILIATE_CODES,
      code
    )
  ) {

    affiliatePromoActive = true;

    activePromo = code;


    message.textContent =
      fromUrl
        ? "✓ Referral affiliate terdeteksi — harga promo diterapkan otomatis."
        : "✓ Kode promo affiliate aktif — harga promo diterapkan.";


    message.style.color =
      "#7ce7b0";


    refreshPrices();

    showAffiliateInfo();

    return;
  }


  // ==========================================================
  // KODE TIDAK VALID
  // ==========================================================

  affiliatePromoActive = true;

  activePromo = "";


  message.textContent =
    "Kode affiliate tidak ditemukan, tetapi harga promo tetap berlaku.";


  message.style.color =
    "#ffcf70";


  refreshPrices();

  showAffiliateInfo();
}


// ============================================================
// REFRESH SEMUA HARGA
// ============================================================

function refreshPrices() {

  document
    .querySelectorAll(".price-card")
    .forEach(card => {


      // Harga normal dari HTML
      const normalPrice =
        Number(
          card.dataset.price || 0
        );


      // Harga promo dari HTML
      const promoPrice =
        Number(
          card.dataset.promoPrice ||
          normalPrice
        );


      // ======================================================
      // PROMO SELALU AKTIF
      // ======================================================

      const finalPrice =
        affiliatePromoActive
          ? promoPrice
          : normalPrice;


      const value =
        card.querySelector(
          ".price-value"
        );


      const old =
        card.querySelector(
          ".old-price"
        );


      // ======================================================
      // UPDATE HARGA
      // ======================================================

      if (value) {

        value.textContent =
          formatRupiah(
            finalPrice
          );

      }


      // ======================================================
      // UPDATE HARGA NORMAL / HEMAT
      // ======================================================

      if (old) {

        if (
          affiliatePromoActive &&
          normalPrice > promoPrice
        ) {

          old.textContent =
            `Harga normal Rp ${formatRupiah(normalPrice)} • ` +
            `Hemat Rp ${formatRupiah(normalPrice - promoPrice)}`;

        } else {

          old.textContent = "";

        }

      }

    });
}


// ============================================================
// PILIH PAKET
// ============================================================

function choosePlan(button) {

  const card =
    button.closest(".price-card");


  if (!card) return;


  const plan =
    card.dataset.plan || "";


  const normalPrice =
    Number(
      card.dataset.price || 0
    );


  const promoPrice =
    Number(
      card.dataset.promoPrice ||
      normalPrice
    );


  // Harga promo aktif
  const finalPrice =
    affiliatePromoActive
      ? promoPrice
      : normalPrice;


  // ==========================================================
  // PESAN WHATSAPP
  // ==========================================================

  const message =

    `Halo Admin, saya ingin membeli BOT CREATOR UNLIMITED PRO X.%0A%0A` +

    `Paket: ${encodeURIComponent(plan)}%0A` +

    `Harga: Rp ${encodeURIComponent(
      formatRupiah(finalPrice)
    )}%0A` +

    (
      activePromo
        ? `Kode Promo Affiliate: ${encodeURIComponent(activePromo)}%0A`
        : `Harga Promo%0A`
    ) +

    `%0AMohon info pembayaran dan aktivasi lisensinya.`;


  // ==========================================================
  // NOMOR WHATSAPP ADMIN
  // ==========================================================

  const whatsappNumber =
    "6283107174228";


  // ==========================================================
  // BUKA WHATSAPP
  // ==========================================================

  window.open(
    `https://wa.me/${whatsappNumber}?text=${message}`,
    "_blank"
  );
}


// ============================================================
// JALANKAN SAAT WEBSITE SELESAI DIMUAT
// ============================================================

document.addEventListener(
  "DOMContentLoaded",
  function () {

    // Promo langsung aktif
    affiliatePromoActive = DEFAULT_PROMO;

    activePromo = "";

    // Tampilkan harga promo
    refreshPrices();

    // Cek referral URL
    applyReferralFromUrl();

  }
);
