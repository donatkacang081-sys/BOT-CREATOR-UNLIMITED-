/*
  BOT CREATOR UNLIMITED PRO X

  HARGA NORMAL:
    1 Bulan  = Rp450.000
    3 Bulan  = Rp1.000.000
    1 Tahun  = Rp3.600.000

  HARGA AFFILIATE:
    1 Bulan  = Rp300.000
    3 Bulan  = Rp500.000
    1 Tahun  = Rp1.000.000

  KODE AFFILIATE:
    AFFILIATE
    PROMO
    PARTNER
*/


// ============================================================
// KODE AFFILIATE YANG VALID
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
// FORMAT RUPIAH
// ============================================================

function formatRupiah(number) {
  return new Intl.NumberFormat("id-ID").format(
    Math.round(number)
  );
}


// ============================================================
// AMBIL REFERRAL DARI URL
// Contoh:
// ?ref=AFFILIATE
// ============================================================

function getReferralCode() {

  const ref =
    new URLSearchParams(
      window.location.search
    ).get("ref");

  return (ref || "")
    .trim()
    .toUpperCase();
}


// ============================================================
// REFERRAL OTOMATIS DARI URL
// ============================================================

function applyReferralFromUrl() {

  const code =
    getReferralCode();

  const input =
    document.getElementById(
      "promoInput"
    );


  if (
    code &&
    input &&
    Object.prototype.hasOwnProperty.call(
      AFFILIATE_CODES,
      code
    )
  ) {

    input.value = code;

    activatePromo(
      code,
      true
    );

  }

}


// ============================================================
// AKTIFKAN PROMO
// ============================================================

function activatePromo(
  code,
  fromUrl = false
) {

  const message =
    document.getElementById(
      "promoMessage"
    );


  affiliatePromoActive = true;
  activePromo = code;


  if (message) {

    message.textContent =
      fromUrl
        ? "✓ Referral affiliate terdeteksi — harga diskon aktif."
        : "✓ Kode promo affiliate aktif — harga diskon aktif.";

    message.style.color =
      "#7ce7b0";

  }


  refreshPrices();

  showAffiliateInfo();

}


// ============================================================
// APPLY PROMO
// ============================================================

function applyPromo(fromUrl = false) {

  const input =
    document.getElementById(
      "promoInput"
    );

  const message =
    document.getElementById(
      "promoMessage"
    );


  if (!input || !message) return;


  const code =
    input.value
      .trim()
      .toUpperCase();


  // ==========================================================
  // KODE KOSONG
  // ==========================================================

  if (!code) {

    affiliatePromoActive = false;
    activePromo = "";


    message.textContent =
      "Masukkan kode promo affiliate terlebih dahulu.";

    message.style.color =
      "#ff9a9a";


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

    activatePromo(
      code,
      fromUrl
    );

    return;
  }


  // ==========================================================
  // KODE TIDAK VALID
  // ==========================================================

  affiliatePromoActive = false;
  activePromo = "";


  message.textContent =
    "❌ Kode promo affiliate tidak ditemukan atau tidak berlaku.";

  message.style.color =
    "#ff9a9a";


  refreshPrices();

  showAffiliateInfo();

}


// ============================================================
// INFO AFFILIATE
// ============================================================

function showAffiliateInfo() {

  const box =
    document.getElementById(
      "affiliateInfo"
    );


  if (!box) return;


  if (
    !affiliatePromoActive ||
    !activePromo
  ) {

    box.hidden = true;

    return;
  }


  const data =
    AFFILIATE_CODES[
      activePromo
    ];


  box.innerHTML =
    `🎉 <b>Harga Affiliate Aktif</b><br>` +
    `<span>Referral: <b>${activePromo}</b>` +
    `${data?.name ? ` — ${data.name}` : ""}</span>`;


  box.hidden = false;

}


// ============================================================
// REFRESH HARGA
// ============================================================

function refreshPrices() {

  document
    .querySelectorAll(
      ".price-card"
    )
    .forEach(card => {


      // ======================================================
      // HARGA NORMAL
      // ======================================================

      const normalPrice =
        Number(
          card.dataset.price || 0
        );


      // ======================================================
      // HARGA AFFILIATE
      // ======================================================

      const promoPrice =
        Number(
          card.dataset.promoPrice ||
          normalPrice
        );


      // ======================================================
      // TENTUKAN HARGA
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
      // UPDATE HARGA UTAMA
      // ======================================================

      if (value) {

        value.textContent =
          formatRupiah(
            finalPrice
          );

      }


      // ======================================================
      // UPDATE INFORMASI HARGA
      // ======================================================

      if (old) {

        if (
          affiliatePromoActive &&
          normalPrice > promoPrice
        ) {

          old.textContent =
            `Harga normal Rp ${formatRupiah(normalPrice)} • ` +
            `Hemat Rp ${formatRupiah(
              normalPrice - promoPrice
            )}`;

        } else {

          old.textContent =
            "";

        }

      }

    });

}


// ============================================================
// PILIH PAKET
// ============================================================

function choosePlan(button) {

  const card =
    button.closest(
      ".price-card"
    );


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


  // ==========================================================
  // TENTUKAN HARGA
  // ==========================================================

  const finalPrice =
    affiliatePromoActive
      ? promoPrice
      : normalPrice;


  // ==========================================================
  // PESAN WHATSAPP
  // ==========================================================

  let message =

    `Halo Admin, saya ingin membeli BOT CREATOR UNLIMITED PRO X.%0A%0A` +

    `Paket: ${encodeURIComponent(
      plan
    )}%0A` +

    `Harga: Rp ${encodeURIComponent(
      formatRupiah(finalPrice)
    )}%0A`;


  // ==========================================================
  // JIKA MENGGUNAKAN AFFILIATE
  // ==========================================================

  if (affiliatePromoActive && activePromo) {

    message +=
      `Kode Promo Affiliate: ${encodeURIComponent(
        activePromo
      )}%0A`;

  } else {

    message +=
      `Harga Normal%0A`;

  }


  message +=
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
// START WEBSITE
// ============================================================

document.addEventListener(
  "DOMContentLoaded",
  function () {

    /*
      PROMO TIDAK AKTIF SAAT PERTAMA BUKA.

      Jadi:
        1 Bulan  = Rp450.000
        3 Bulan  = Rp1.000.000
        1 Tahun  = Rp3.600.000

      Setelah kode affiliate valid:
        1 Bulan  = Rp300.000
        3 Bulan  = Rp500.000
        1 Tahun  = Rp1.000.000
    */

    affiliatePromoActive = false;
    activePromo = "";


    // Tampilkan harga normal
    refreshPrices();


    // Cek referral dari URL
    applyReferralFromUrl();

  }
);
