// ============================================================
// BOT CREATOR UNLIMITED PRO X
// AFFILIATE + PROMO SYSTEM
// ============================================================

const WHATSAPP_NUMBER = "6283107174228";

// ============================================================
// STATE
// ============================================================

let affiliatePromoActive = false;
let activeAffiliateCode = "";
let activeAffiliateName = "";

// ============================================================
// FORMAT RUPIAH
// ============================================================

function formatRupiah(value) {
    return new Intl.NumberFormat("id-ID").format(Number(value));
}

// ============================================================
// GET REFERRAL FROM URL
//
// Example:
// ?ref=BUDI-7K4P&aff=Budi
// ============================================================

function getReferralData() {
    const params = new URLSearchParams(window.location.search);

    const ref = (params.get("ref") || "").trim().toUpperCase();
    const aff = (params.get("aff") || "").trim();

    if (!ref) {
        return null;
    }

    // Affiliate code format:
    // NAME-XXXX
    // Example BUDI-7K4P
    const validFormat = /^[A-Z0-9]+-[A-Z0-9]{4,8}$/;

    if (!validFormat.test(ref)) {
        return null;
    }

    return {
        code: ref,
        name: aff || ref
    };
}

// ============================================================
// APPLY REFERRAL FROM URL
// ============================================================

function applyReferralFromURL() {

    const referral = getReferralData();

    if (!referral) {
        affiliatePromoActive = false;
        activeAffiliateCode = "";
        activeAffiliateName = "";
        refreshPrices();
        return;
    }

    affiliatePromoActive = true;
    activeAffiliateCode = referral.code;
    activeAffiliateName = referral.name;

    const input = document.getElementById("promoInput");

    if (input) {
        input.value = referral.code;
    }

    showAffiliateInfo(
        referral.name,
        referral.code,
        "Link affiliate terdeteksi otomatis. Harga promo aktif."
    );

    refreshPrices();
}

// ============================================================
// SHOW AFFILIATE INFO
// ============================================================

function showAffiliateInfo(name, code, message = "") {

    const box = document.getElementById("affiliateInfo");

    if (!box) return;

    box.innerHTML = "";

    const title = document.createElement("strong");
    title.textContent = "🤝 Affiliate Aktif";

    const line1 = document.createElement("div");
    line1.textContent = `Nama: ${name}`;

    const line2 = document.createElement("div");
    line2.textContent = `Kode: ${code}`;

    box.appendChild(title);
    box.appendChild(line1);
    box.appendChild(line2);

    if (message) {
        const msg = document.createElement("div");
        msg.textContent = message;
        msg.style.marginTop = "5px";
        box.appendChild(msg);
    }

    box.style.display = "block";
}

// ============================================================
// HIDE AFFILIATE INFO
// ============================================================

function hideAffiliateInfo() {

    const box = document.getElementById("affiliateInfo");

    if (box) {
        box.innerHTML = "";
        box.style.display = "none";
    }
}

// ============================================================
// REFRESH PRICES
// ============================================================

function refreshPrices() {

    const cards = document.querySelectorAll(".price-card");

    cards.forEach(card => {

        const normalPrice = card.dataset.price;
        const promoPrice = card.dataset.promoPrice;

        const priceElement = card.querySelector(".price-value");

        if (!priceElement) return;

        if (affiliatePromoActive && promoPrice) {

            priceElement.textContent = formatRupiah(promoPrice);

        } else {

            priceElement.textContent = formatRupiah(normalPrice);

        }
    });
}

// ============================================================
// APPLY PROMO CODE MANUALLY
// ============================================================

function applyPromo() {

    const input = document.getElementById("promoInput");
    const message = document.getElementById("promoMessage");

    if (!input) return;

    const code = input.value.trim().toUpperCase();

    if (!code) {

        affiliatePromoActive = false;
        activeAffiliateCode = "";
        activeAffiliateName = "";

        hideAffiliateInfo();
        refreshPrices();

        if (message) {
            message.textContent = "Masukkan kode affiliate terlebih dahulu.";
        }

        return;
    }

    // Accept generated affiliate code format
    const validFormat = /^[A-Z0-9]+-[A-Z0-9]{4,8}$/;

    if (!validFormat.test(code)) {

        affiliatePromoActive = false;
        activeAffiliateCode = "";
        activeAffiliateName = "";

        hideAffiliateInfo();
        refreshPrices();

        if (message) {
            message.textContent =
                "❌ Kode affiliate tidak valid.";
        }

        return;
    }

    affiliatePromoActive = true;
    activeAffiliateCode = code;
    activeAffiliateName = code;

    showAffiliateInfo(
        code,
        code,
        "Kode affiliate berhasil digunakan. Harga promo aktif."
    );

    refreshPrices();

    if (message) {
        message.textContent =
            "✅ Kode affiliate aktif. Harga promo telah diterapkan.";
    }
}

// ============================================================
// AFFILIATE GENERATOR
// ============================================================

function randomAffiliateSuffix(length = 4) {

    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let result = "";

    if (window.crypto && crypto.getRandomValues) {

        const array = new Uint32Array(length);

        crypto.getRandomValues(array);

        for (let i = 0; i < length; i++) {
            result += chars[array[i] % chars.length];
        }

    } else {

        for (let i = 0; i < length; i++) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
    }

    return result;
}

// ============================================================
// CLEAN AFFILIATE NAME
// ============================================================

function cleanAffiliateName(name) {

    return name
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, "")
        .substring(0, 10);
}

// ============================================================
// GENERATE AFFILIATE CODE
// ============================================================

function generateAffiliateCode(name) {

    const cleanName = cleanAffiliateName(name);

    if (!cleanName) {
        return "";
    }

    return `${cleanName}-${randomAffiliateSuffix(4)}`;
}

// ============================================================
// GENERATE AFFILIATE LINK
// ============================================================

function generateAffiliateLink(name, code) {

    const baseURL =
        window.location.origin +
        window.location.pathname;

    return `${baseURL}?ref=${encodeURIComponent(code)}&aff=${encodeURIComponent(name)}`;
}

// ============================================================
// GENERATE AFFILIATE
// ============================================================

function createAffiliate() {

    const nameInput =
        document.getElementById("affiliateName");

    const codeInput =
        document.getElementById("affiliateCode");

    const linkInput =
        document.getElementById("affiliateLink");

    const result =
        document.getElementById("affiliateResult");

    const message =
        document.getElementById("affiliateGeneratorMessage");

    if (!nameInput || !codeInput || !linkInput) {
        return;
    }

    const name = nameInput.value.trim();

    if (!name) {

        if (message) {
            message.textContent =
                "❌ Masukkan nama affiliate terlebih dahulu.";
        }

        return;
    }

    const code = generateAffiliateCode(name);

    const link = generateAffiliateLink(name, code);

    codeInput.value = code;
    linkInput.value = link;

    if (result) {
        result.hidden = false;
    }

    if (message) {
        message.textContent =
            "✅ Affiliate berhasil dibuat.";
    }
}

// ============================================================
// COPY AFFILIATE LINK
// ============================================================

async function copyAffiliateLink() {

    const input =
        document.getElementById("affiliateLink");

    const message =
        document.getElementById("affiliateGeneratorMessage");

    if (!input || !input.value) {
        return;
    }

    try {

        await navigator.clipboard.writeText(input.value);

        if (message) {
            message.textContent =
                "✅ Link affiliate berhasil disalin.";
        }

    } catch (error) {

        input.select();
        document.execCommand("copy");

        if (message) {
            message.textContent =
                "✅ Link affiliate berhasil disalin.";
        }
    }
}

// ============================================================
// SHARE AFFILIATE VIA WHATSAPP
// ============================================================

function shareAffiliateWhatsApp() {

    const nameInput =
        document.getElementById("affiliateName");

    const codeInput =
        document.getElementById("affiliateCode");

    const linkInput =
        document.getElementById("affiliateLink");

    if (!nameInput || !codeInput || !linkInput) {
        return;
    }

    const name = nameInput.value.trim();
    const code = codeInput.value.trim();
    const link = linkInput.value.trim();

    if (!name || !code || !link) {
        return;
    }

    const text =
`🤝 LINK AFFILIATE BOT CREATOR

Halo ${name},

Berikut link affiliate kamu:

${link}

Kode Affiliate:
${code}

Bagikan link tersebut kepada calon pembeli.

Harga promo akan otomatis aktif melalui link affiliate tersebut.`;

    const url =
        `https://wa.me/?text=${encodeURIComponent(text)}`;

    window.open(url, "_blank");
}

// ============================================================
// CHOOSE PLAN
// ============================================================

function choosePlan(plan, price) {

    let finalPrice = Number(price);

    const card =
        document.querySelector(
            `.price-card[data-plan="${CSS.escape(plan)}"]`
        );

    if (affiliatePromoActive && card) {

        const promoPrice =
            Number(card.dataset.promoPrice);

        if (promoPrice) {
            finalPrice = promoPrice;
        }
    }

    const affiliateText =
        activeAffiliateCode
            ? `\nAffiliate: ${activeAffiliateName}\nKode Affiliate: ${activeAffiliateCode}`
            : "";

    const message =
`Halo, saya ingin membeli BOT CREATOR UNLIMITED PRO X.

Paket: ${plan}
Harga: Rp${formatRupiah(finalPrice)}${affiliateText}

Mohon informasi pembayaran dan proses aktivasi lisensi.`;

    const url =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
}

// ============================================================
// INITIALIZE
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    // Initial normal price
    refreshPrices();

    // Detect affiliate from URL
    applyReferralFromURL();

    // Generator button
    const generateButton =
        document.getElementById("generateAffiliateBtn");

    if (generateButton) {

        generateButton.addEventListener(
            "click",
            createAffiliate
        );
    }

    // Copy button
    const copyButton =
        document.getElementById("copyAffiliateLinkBtn");

    if (copyButton) {

        copyButton.addEventListener(
            "click",
            copyAffiliateLink
        );
    }

    // WhatsApp share button
    const shareButton =
        document.getElementById("shareAffiliateBtn");

    if (shareButton) {

        shareButton.addEventListener(
            "click",
            shareAffiliateWhatsApp
        );
    }
});
