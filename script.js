/*
  BOT CREATOR UNLIMITED PRO X

  HARGA NORMAL:
    1 Bulan  = Rp450.000
    3 Bulan  = Rp1.000.000
    1 Tahun  = Rp3.600.000

  HARGA PROMO:
    1 Bulan  = Rp300.000
    3 Bulan  = Rp500.000
    1 Tahun  = Rp1.000.000

  KODE AFFILIATE:
    AFFILIATE
    PROMO
    PARTNER
*/


// ============================================================
// KODE AFFILIATE
// ============================================================

const AFFILIATE_CODES = {
  AFFILIATE: { name: "Affiliate" },
  PROMO: { name: "Promo Affiliate" },
  PARTNER: { name: "Partner" }
};


// ============================================================
// STATUS AFFILIATE
// ============================================================

let affiliatePromoActive = true;
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
// AMBIL KODE REFERRAL DARI URL
// Contoh:
// https://domainkamu.com/?ref=AFFILIATE
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

    affiliatePromoActive = true;
    activePromo = code;

    showAffiliateInfo();

    const message =
      document.getElementById(
        "promoMessage"
      );

    if (message) {

      message.textContent =
        "✓ Referral affiliate terdeteksi — harga khusus diterapkan otomatis.";

      message.style.color =
        "#7ce7b0";

    }

  }


  // Pastikan harga promo tetap tampil
  refreshPrices();
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

    /*
      Harga promo tetap tampil.
      Kode affiliate hanya digunakan
      untuk referral / tracking.
    */

    affiliatePromoActive = true;
    activePromo = "";


    message.textContent =
      "✓ Harga promo sedang berlaku.";

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
        ? "✓ Referral affiliate terdeteksi — harga khusus diterapkan otomatis."
        : "✓ Kode promo affiliate aktif — harga khusus diterapkan.";


    message.style.color =
      "#7ce7b0";


    refreshPrices();
    showAffiliateInfo();

    return;
  }


  // ==========================================================
  // KODE TIDAK VALID
  // ==========================================================

  /*
    Kode salah tidak menghilangkan harga promo.
    Harga promo tetap ditampilkan.
  */

  affiliatePromoActive = true;
  activePromo = "";


  message.textContent =
    "Kode promo affiliate tidak ditemukan, tetapi harga promo tetap berlaku.";

  message.style.color =
    "#ffcf70";


  refreshPrices();
  showAffiliateInfo();
}


// ============================================================
// TAMPILKAN INFO AFFILIATE
// ============================================================

function showAffiliateInfo() {

  const box =
    document.getElementById(
      "affiliateInfo"
    );


  if (!box) return;


  if (!activePromo) {

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


      // Harga normal
      const normalPrice =
        Number(
          card.dataset.price || 0
        );


      // Harga promo
      const promoPrice =
        Number(
          card.dataset.promoPrice ||
          normalPrice
        );


      /*
        PROMO SELALU AKTIF
        Jadi harga yang ditampilkan:
        
        450.000 → 300.000
        1.000.000 → 500.000
        3.600.000 → 1.000.000
      */

      const finalPrice =
        promoPrice;


      const value =
        card.querySelector(
          ".price-value"
        );


      const old =
        card.querySelector(
          ".old-price"
        );


      // ======================================================
      // HARGA UTAMA
      // ======================================================

      if (value) {

        value.textContent =
          formatRupiah(
            finalPrice
          );

      }


      // ======================================================
      // HARGA NORMAL / HEMAT
      // ======================================================

      if (old) {

        if (
          normalPrice > promoPrice
        ) {

          old.textContent =
            `Harga normal Rp ${formatRupiah(normalPrice)} • ` +
            `Hemat Rp ${formatRupiah(
              normalPrice - promoPrice
            )}`;

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
  // SELALU GUNAKAN HARGA PROMO
  // ==========================================================

  const finalPrice =
    promoPrice;


  // ==========================================================
  // PESAN WHATSAPP
  // ==========================================================

  let message =

    `Halo Admin, saya ingin membeli BOT CREATOR UNLIMITED PRO X.%0A%0A` +

    `Paket: ${encodeURIComponent(
      plan
    )}%0A` +

    `Harga Promo: Rp ${encodeURIComponent(
      formatRupiah(finalPrice)
    )}%0A`;


  // Tambahkan kode affiliate jika ada
  if (activePromo) {

    message +=
      `Kode Promo Affiliate: ${encodeURIComponent(
        activePromo
      )}%0A`;

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

    // Promo langsung aktif
    affiliatePromoActive = true;

    // Tampilkan harga promo
    refreshPrices();

    // Cek referral dari URL
    applyReferralFromUrl();

  }
);
