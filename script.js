/*
  BOT CREATOR UNLIMITED PRO X
  Harga normal:
    1 Bulan  = Rp450.000
    3 Bulan  = Rp1.000.000
    1 Tahun  = Rp3.600.000

  Harga promo affiliate:
    1 Bulan  = Rp350.000
    3 Bulan  = Rp500.000
    1 Tahun  = Rp1.000.000

  Tambahkan/edit kode affiliate di object AFFILIATE_CODES.
*/
const AFFILIATE_CODES = {
  AFFILIATE: { name: "Affiliate" },
  PROMO: { name: "Promo Affiliate" },
  PARTNER: { name: "Partner" }
};

// Referral otomatis dari URL, contoh: https://domainkamu.com/?ref=AFFILIATE
function getReferralCode() {
  const ref = new URLSearchParams(window.location.search).get("ref");
  return (ref || "").trim().toUpperCase();
}

function applyReferralFromUrl() {
  const code = getReferralCode();
  const input = document.getElementById("promoInput");
  if (code && input) {
    input.value = code;
    applyPromo(true);
  }
}

function showAffiliateInfo() {
  const box = document.getElementById("affiliateInfo");
  if (!box || !affiliatePromoActive) return;
  const data = AFFILIATE_CODES[activePromo];
  box.innerHTML = `🎉 <b>Harga Affiliate Aktif</b><br><span>Referral: <b>${activePromo}</b>${data?.name ? ` — ${data.name}` : ""}</span>`;
  box.hidden = false;
}

let affiliatePromoActive = false;
let activePromo = "";

function formatRupiah(number) {
  return new Intl.NumberFormat("id-ID").format(Math.round(number));
}

function applyPromo(fromUrl = false) {
  const input = document.getElementById("promoInput");
  const message = document.getElementById("promoMessage");
  const code = input.value.trim().toUpperCase();

  if (!code) {
    affiliatePromoActive = false;
    activePromo = "";
    message.textContent = "Masukkan kode promo affiliate terlebih dahulu.";
    message.style.color = "#ff9a9a";
    refreshPrices();
    return;
  }

  if (Object.prototype.hasOwnProperty.call(AFFILIATE_CODES, code)) {
    affiliatePromoActive = true;
    activePromo = code;
    message.textContent = fromUrl
      ? "✓ Referral affiliate terdeteksi — harga khusus diterapkan otomatis."
      : "✓ Kode promo affiliate aktif — harga khusus diterapkan.";
    message.style.color = "#7ce7b0";
  } else {
    affiliatePromoActive = false;
    activePromo = "";
    message.textContent = "Kode promo affiliate tidak ditemukan atau tidak berlaku.";
    message.style.color = "#ff9a9a";
  }

  refreshPrices();
  showAffiliateInfo();
}

function refreshPrices() {
  document.querySelectorAll(".price-card").forEach(card => {
    const normalPrice = Number(card.dataset.price || 0);
    const promoPrice = Number(card.dataset.promoPrice || normalPrice);
    const finalPrice = affiliatePromoActive ? promoPrice : normalPrice;

    const value = card.querySelector(".price-value");
    const old = card.querySelector(".old-price");

    value.textContent = formatRupiah(finalPrice);

    if (affiliatePromoActive) {
      old.textContent =
        `Harga normal Rp ${formatRupiah(normalPrice)} • Hemat Rp ${formatRupiah(normalPrice - promoPrice)}`;
    } else {
      old.textContent = "";
    }
  });
}

function choosePlan(button) {
  const card = button.closest(".price-card");
  const plan = card.dataset.plan;
  const normalPrice = Number(card.dataset.price || 0);
  const promoPrice = Number(card.dataset.promoPrice || normalPrice);
  const finalPrice = affiliatePromoActive ? promoPrice : normalPrice;

  const message =
    `Halo Admin, saya ingin membeli BOT CREATOR UNLIMITED PRO X.%0A%0A` +
    `Paket: ${encodeURIComponent(plan)}%0A` +
    `Harga: Rp ${encodeURIComponent(formatRupiah(finalPrice))}%0A` +
    (affiliatePromoActive
      ? `Kode Promo Affiliate: ${encodeURIComponent(activePromo)}%0A`
      : `Harga Normal%0A`) +
    `%0AMohon info pembayaran dan aktivasi lisensinya.`;

  // GANTI nomor WhatsApp admin kamu di sini.
  const whatsappNumber = "6283107174228";
  window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
}

refreshPrices();
applyReferralFromUrl();
