// ===== إعدادات =====
const WHATSAPP_NUMBER = '201044012465'; 
// غيّره برقمك بصيغة دولية بدون + (مثال: 201012345678)
// إعدادات رفع صور العملاء
const CLOUDINARY_CLOUD_NAME = 'dnxe06ak';
const CLOUDINARY_UPLOAD_PRESET = '2m hoodis';

// رفع صورة التصميم وإرجاع رابطها
async function uploadProof(file) {
  if (!file || !file.type.startsWith('image/')) {
    throw new Error('الملف يجب أن يكون صورة');
  }

  if (file.size > 8 * 1024 * 1024) {
    throw new Error('حجم الصورة يجب ألا يتجاوز 8 ميجابايت');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData
    }
  );

  const result = await response.json();

  if (!response.ok || !result.secure_url) {
    throw new Error(result.error?.message || 'فشل رفع الصورة');
  }

  return result.secure_url;
}
const CURRENCY = 'ج.م';
const PAYMENTS = {
  'الدفع عند الاستلام': 'هتدفع للمندوب لما الطلب يوصلك.',
  'إنستاباي': 'حوّل على: <b>mohamedmosaabomosa@instapay</b> وابعت صورة التحويل على واتساب.',
  'فودافون كاش': 'حوّل على رقم: <b>01044012465</b> وابعت صورة التحويل على واتساب.'
};
// ===== المنتجات =====
// عدّل المنتجات من هنا. كل منتج سطر واحد:
const products = [
  { id: 1, name: 'Black',       price: 550, oldPrice: 850, color: '#15120f', img: 'images/black.jpeg' },
  { id: 2, name: 'Ganzari',     price: 550, oldPrice: 850, color: '#02628b', img: 'images/Ganzari.jpeg' },
  { id: 3, name: 'White',       price: 550, oldPrice: 850, color: '#FFFFFF', img: 'images/white.jpeg' },
  { id: 4, name: 'Olive Green', price: 550, oldPrice: 850, color: '#213302', img: 'images/Olive Green.jpeg' },
  { id: 5, name: 'Warm Beige',  price: 550, oldPrice: 850, color: '#C4B197', img: 'images/Warm Beige.jpeg' },
  { id: 6, name: 'Taupe',        price: 550, oldPrice: 850, color: '#8C8275', img: 'images/Taupe.jpeg' },
  { id: 7, name: 'Slate Blue',        price: 550, oldPrice: 850, color: '#4B586B', img: 'images/Slate Blue.jpeg' },
  { id: 8, name: 'Burgundy',        price: 550, oldPrice: 850, color: '#5C2A33', img: 'images/Burgundy.jpeg' },
  { id: 9, name: 'Light Blue',        price: 550, oldPrice: 850, color: '#C5D7E8', img: 'images/Light Blue.jpeg' },
  { id: 10, name: 'Dark Brown',        price: 550, oldPrice: 850, color: '#3D281F', img: 'images/Dark Brown.jpeg' },
  { id: 11, name: 'Beige',        price: 550, oldPrice: 850, color: '#E5D4B3', img: 'images/Beige.jpeg' },
  { id: 12, name: 'Brown',        price: 550, oldPrice: 850, color: '#4A3325', img: 'images/Brown.jpeg' },
  { id: 13, name: 'Charcoal Gray',        price: 550, oldPrice: 850, color: '#44474D', img: 'images/Charcoal Gray.jpeg' },
  { id: 14, name: 'Yellow',        price: 550, oldPrice: 850, color: '#F3D86B', img: 'images/yellow.jpeg' },
  { id: 15, name: 'Pink',        price: 550, oldPrice: 850, color: '#FFC0CB', img: 'images/pink.jpeg' }
];
const SIZES = ['M', 'L', 'XL' , '2XL', '3XL'];
// ===== العرض =====
const OFFER = { on: true, qty: 2, price: 1050};   // كل 2 قطعة بـ 1100 (on: false يوقف العرض)

function calcTotal() {
  const prices = [];
  cart.forEach(it => {
    const p = products.find(x => x.id === it.id);
    for (let i = 0; i < it.qty; i++) prices.push(p.price);
  });
  prices.sort((a, b) => b - a);
  let total = 0, i = 0;
  if (OFFER.on) {
    for (; i + OFFER.qty <= prices.length; i += OFFER.qty) {
      const group = prices.slice(i, i + OFFER.qty).reduce((a, b) => a + b, 0);
      total += Math.min(group, OFFER.price);
    }
  }
  for (; i < prices.length; i++) total += prices[i];
  return total;
}
// ===== رسمة الهودي (SVG) =====
function hoodieSVG(color) {
  return `
  <svg viewBox="0 0 200 200" aria-hidden="true">
    <path d="M68 38 Q100 14 132 38 L165 54 L196 134 L166 144 L152 104 L152 188 L48 188 L48 104 L34 144 L4 134 L35 54 Z"
          fill="${color}" stroke="#d9cebb" stroke-opacity=".35" stroke-width="1.5"/>
    <path d="M72 40 Q100 78 128 40 Q126 14 100 10 Q74 14 72 40 Z" fill="#000" fill-opacity=".45" stroke="#d9cebb" stroke-opacity=".5" stroke-width="1.5"/>
    <path d="M88 62 L86 96 M112 62 L114 96" stroke="#d9cebb" stroke-width="2" stroke-linecap="round"/>
    <path d="M70 142 H130 L124 170 H76 Z" fill="#000" fill-opacity=".22" stroke="#d9cebb" stroke-opacity=".3"/>
  </svg>`;
}

// لو المنتج فيه img بيعرض الصورة، لو مفيش بيعرض الرسمة
function visual(p) {
  return p.img
    ? `<img src="${p.img}" alt="${p.name}" loading="lazy">`
    : hoodieSVG(p.color);
}

// ===== الحالة =====
let currentFilter = 'all';
let cart = JSON.parse(localStorage.getItem('2m-cart') || '[]');
const selectedSize = {}; // id -> size

const $ = (s) => document.querySelector(s);
const fmt = (n) => `${n.toLocaleString('ar-EG')} ${CURRENCY}`;
const save = () => localStorage.setItem('2m-cart', JSON.stringify(cart));

function renderProducts() {
  const filteredProducts = currentFilter === 'all' 
    ? products 
    : products.filter(p => p.name.toLowerCase() === currentFilter.toLowerCase());

  $('#productGrid').innerHTML = filteredProducts.map(p => {
    selectedSize[p.id] = selectedSize[p.id] || 'M';
    const currentSize = selectedSize[p.id];
    const stockCount = ((p.id * 7 + currentSize.charCodeAt(0)) % 4) + 1;

    return `
    <article class="card" data-id="${p.id}">
      <div class="thumb">${visual(p)}</div>
      
      <div class="product-title-row">
        <h3>${p.name}</h3>
        <button type="button" class="color-dot" style="background-color: ${p.color};" title="لون المنتج: ${p.name}" data-color-id="${p.id}"></button>
      </div>

      <p class="price">
        ${p.oldPrice ? `<s class="old">${fmt(p.oldPrice)}</s>` : ''}
        <span class="now">${fmt(p.price)}</span>
        ${p.oldPrice ? `<span class="badge">-${Math.round((1 - p.price / p.oldPrice) * 100)}%</span>` : ''}
      </p>
      
      <p class="stock-badge animate-stock" id="stock-${p.id}">🔥 متبقي ${stockCount} قطع فقط بالمقاس (${currentSize})</p>

      <div class="opts">
        <span>المقاس</span>
        <div class="sizes">
          ${SIZES.map(s => `<button type="button" data-size="${s}" class="${s === selectedSize[p.id] ? 'active' : ''}">${s}</button>`).join('')}
        </div>
      </div>
      
      <div class="card-actions">
        <button class="btn add" type="button">أضف للسلة</button>
        <button class="btn quick-wa" type="button" data-quick-id="${p.id}">طلب سريع 💬</button>
        <button class="btn share-btn" type="button" data-share-id="${p.id}" title="مشاركة المنتج">🔗</button>
      </div>
    </article>`;
  }).join('');
}
// ===== السلة =====
function renderCart() {
  const box = $('#cartItems');
  if (!cart.length) {
    box.innerHTML = '<p class="empty">السلة فاضية 🖤</p>';
  } else {
    box.innerHTML = cart.map((it, i) => {
      const p = products.find(x => x.id === it.id);
      return `
      <div class="item">
        <div class="mini">${visual(p)}</div>
        <div>
          <h4>${p.name}</h4>
          <small>المقاس: ${it.size} — ${fmt(p.price)}</small>
          <div class="qty">
            <button data-act="dec" data-i="${i}">−</button>
            <span>${it.qty}</span>
            <button data-act="inc" data-i="${i}">+</button>
          </div>
        </div>
        <button class="remove" data-act="rm" data-i="${i}" aria-label="حذف">✕</button>
      </div>`;
    }).join('');
  }

  const count = cart.reduce((a, b) => a + b.qty, 0);
  const total = calcTotal();
  $('#cartCount').textContent = count;
  $('#cartTotal').textContent = fmt(total);
  const full = cart.reduce((a, b) => a + b.qty * products.find(x => x.id === b.id).price, 0);
  const saved = full - total;
  const sv = $('#cartSaving');
  if (sv) {
    const rest = OFFER.qty - (count % OFFER.qty);
    sv.textContent = saved > 0 ? `وفّرت ${fmt(saved)} 🎉`
      : (OFFER.on && count > 0 && rest < OFFER.qty ? `ضيف ${rest} قطعة كمان وخد العرض` : '');
  }
  $('#orderSummary').innerHTML = cart.length
    ? cart.map(it => {
        const p = products.find(x => x.id === it.id);
        return `${p.name} (${it.size}) × ${it.qty}`;
      }).join('<br>') + `<br><b>الإجمالي: ${fmt(total)}</b>`
    : 'السلة فاضية';
  save();
}

function openCart(open) {
  $('#drawer').classList.toggle('open', open);
  $('#overlay').classList.toggle('show', open);
}

// ===== الأحداث =====
document.addEventListener('click', (e) => {
  // أزرار فلتر الألوان فوق المنتجات
  const filterBtn = e.target.closest('.filter-btn');
  if (filterBtn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    filterBtn.classList.add('active');
    currentFilter = filterBtn.dataset.filter;
    renderProducts();
    return;
  }

  // زرار مشاركة المنتج (نسخ الرابط أو مشاركته)
  const shareBtn = e.target.closest('[data-share-id]');
  if (shareBtn) {
    const id = +shareBtn.dataset.shareId;
    const p = products.find(x => x.id === id);
    const shareText = `شاهد هودي ${p.name} الرائع من براند 2M Hoodies! 🖤`;
    
    if (navigator.share) {
      navigator.share({ title: '2M Hoodies', text: shareText, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert(`✅ تم نسخ رابط المنتج الخاص بـ (${p.name}) الحافظة!`);
    }
    return;
  }

  // التفاعل عند الضغط على نقطة اللون
  const colorDot = e.target.closest('.color-dot');
  if (colorDot) {
    const id = +colorDot.dataset.colorId;
    const p = products.find(x => x.id === id);
    if (p) {
      alert(`🎨 لون المنتج: ${p.name}\n🔖 كود الهيكسا: ${p.color}`);
    }
    return;
  }

  // تعريف الكارت والأزرار المشتركة بداخل الكارت
  const card = e.target.closest('.card');

  // زرار الطلب السريع عبر واتساب
  const quickBtn = e.target.closest('.quick-wa');
  if (quickBtn) {
    const id = +quickBtn.dataset.quickId;
    const p = products.find(x => x.id === id);
    const size = selectedSize[id] || 'M';
    const msg = `🖤 طلب سريع من الموقع:\n\n• المنتج: ${p.name}\n• المقاس: ${size}\n• السعر: ${p.price} ${CURRENCY}\n\nعايز أكمل الطلب معاك!`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    return;
  }

  // اختيار المقاس وتحديث المخزون فوراً
  const sizeBtn = e.target.closest('.sizes button');
  if (sizeBtn && card) {
    const id = +card.dataset.id;
    const size = sizeBtn.dataset.size;
    selectedSize[id] = size;
    
    card.querySelectorAll('.sizes button').forEach(b => b.classList.remove('active'));
    sizeBtn.classList.add('active');

    const newStock = ((id * 7 + size.charCodeAt(0)) % 4) + 1;
    const stockEl = card.querySelector('.stock-badge');
    if (stockEl) {
      stockEl.innerHTML = `🔥 متبقي ${newStock} قطع فقط بالمقاس (${size})`;
    }
    return;
  }

  // إضافة للسلة (اشتغلت خلاص وزي الفل)
  const addBtn = e.target.closest('.add');
  if (addBtn && card) {
    const id = +card.dataset.id, size = selectedSize[id] || 'M';
    const found = cart.find(i => i.id === id && i.size === size);
    found ? found.qty++ : cart.push({ id, size, qty: 1 });
    renderCart();
    
    // إشعار السلة السريع
    showToast('تمت الإضافة للسلة بنجاح 🖤');
    return;
  }

  // التحكم في كمية العناصر داخل السلة
  const act = e.target.closest('[data-act]');
  if (act) {
    const i = +act.dataset.i;
    if (act.dataset.act === 'inc') cart[i].qty++;
    if (act.dataset.act === 'dec') cart[i].qty = Math.max(1, cart[i].qty - 1);
    if (act.dataset.act === 'rm') cart.splice(i, 1);
    renderCart();
  }
});
$('#openCart').addEventListener('click', () => openCart(true));
$('#closeCart').addEventListener('click', () => openCart(false));
$('#overlay').addEventListener('click', () => openCart(false));
$('#goCheckout').addEventListener('click', () => openCart(false));
// ===== إرسال الطلب لجوجل شيت عبر Google Apps Script وواتساب معاً =====
$('#orderForm').addEventListener('submit', (e) => {
  e.preventDefault();
  if (!cart.length) { alert('ضيف منتجات للسلة الأول'); return; }

  const f = new FormData(e.target);
  const total = calcTotal();
  const lines = cart.map(it => {
    const p = products.find(x => x.id === it.id);
    return `• ${p.name} | مقاس ${it.size} | ${it.qty} × ${p.price}`;
  }).join(' - ');

  // قراءة بيانات الفورم بشكل صحيح وصريح
  const nameVal = f.get('name') || '';
  const phoneVal = f.get('phone') || '';
  const govVal = f.get('gov') || '';
  const addressVal = f.get('address') || '';
  const payVal = f.get('pay') || '';

  const scriptURL = 'https://script.google.com/macros/s/AKfycbysz3fCoSBWR5BDUWTBGFdXQTLSHd34Qc-2I-OtkHZ4uSs-Ku_haw4t-SxqiccwuoOMNg/exec';

  // إرسال البيانات لجوجل شيت في الخلفية
  fetch(scriptURL, {
    method: 'POST',
    body: JSON.stringify({
      "date": new Date().toLocaleString('ar-EG'),
      "name": nameVal,
      "phone": phoneVal,
      "gov": govVal,
      "address": addressVal,
      "items": lines,
      "total": total + ` ${CURRENCY}`,
      "pay": payVal,
      "status": "غير مكتمل"
    })
  }).catch(err => console.log('Script Error:', err));

  // تجهيز رسالة واتساب وفتحها فوراً للعميل
  const msg = [
    '🖤 طلب جديد من 2M Hoodies',
    '',
    ...cart.map(it => {
      const p = products.find(x => x.id === it.id);
      return `• ${p.name} | مقاس ${it.size} | ${it.qty} × ${p.price}`;
    }),
    '',
    `الإجمالي: ${total} ${CURRENCY}`,
    '',
    `الاسم: ${nameVal}`,
    `الموبايل: ${phoneVal}`,
    `المحافظة: ${govVal}`,
    `العنوان: ${addressVal}`,
    `طريقة الدفع: ${payVal}`
  ].join('\n');

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
});
function openLightbox(img) {
  lbImg.src = img.src;
  lbImg.alt = img.alt;
  lightbox.classList.add('show');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lightbox.classList.remove('show');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.addEventListener('click', (e) => {
  const img = e.target.closest('.thumb img');
  if (img) openLightbox(img);
});
lightbox.addEventListener('click', (e) => { if (e.target !== lbImg) closeLightbox(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
renderProducts();
renderCart();

function showPayNote() {
  const sel = document.querySelector('input[name="pay"]:checked');
  const note = $('#payNote');
  if (sel && note) note.innerHTML = PAYMENTS[sel.value];
}
document.querySelectorAll('input[name="pay"]').forEach(r => r.addEventListener('change', showPayNote));
showPayNote();
// ===== الطباعة على الهودي =====
const DESIGNS = [
  { id: 1, name: 'تاج',     img: 'designs/1.jpeg' },
  {id: 2, name: 'تصميم 2', img: 'designs/2.jpeg' },
  { id: 3, name: 'تصميم 3', img: 'designs/3.jpeg' },
  {id: 2, name: 'تصميم 2', img: 'designs/4.jpeg' },
  {id: 2, name: 'تصميم 2', img: 'designs/5.jpeg' },
  {id: 2, name: 'تصميم 2', img: 'designs/6.jpeg' },
  {id: 2, name: 'تصميم 2', img: 'designs/7.jpeg' },
  {id: 2, name: 'تصميم 2', img: 'designs/8.jpeg' },
  {id: 2, name: 'تصميم 2', img: 'designs/9.jpeg' },
  {id: 2, name: 'تصميم 2', img: 'designs/10.jpeg' },
  {id: 2, name: 'تصميم 2', img: 'designs/11.jpeg' },
  {id: 2, name: 'تصميم 2', img: 'designs/13.jpeg' },
  {id: 2, name: 'تصميم 2', img: 'designs/14.jpeg' },
];
let selectedDesign = null;

function renderDesigns() {
  $('#designGrid').innerHTML = DESIGNS.map(d => `
    <button type="button" class="design" data-id="${d.id}">
      <img src="${d.img}" alt="${d.name}"><span>${d.name}</span>
    </button>`).join('');
}

function updatePrintUI() {
  const sel = document.querySelector('input[name="print"]:checked');
  const mode = sel ? sel.value : 'none';
  $('#designBox').hidden = mode !== 'design';
  $('#customBox').hidden = mode !== 'custom';
  $('#placeBox').hidden = mode === 'none';
}

renderDesigns();
updatePrintUI();
document.querySelectorAll('input[name="print"]').forEach(r => r.addEventListener('change', updatePrintUI));
$('#designGrid').addEventListener('click', (e) => {
  const b = e.target.closest('.design');
  if (!b) return;
  selectedDesign = DESIGNS.find(d => d.id === +b.dataset.id);
  document.querySelectorAll('.design').forEach(x => x.classList.toggle('active', x === b));
});
function showOffer() {
  const el = $('#offerBanner');
  if (!el || !OFFER.on) return;
  el.hidden = false;
  el.innerHTML = `🔥 عرض خاص: كل <b>${OFFER.qty}</b> قطع بـ <b>${fmt(OFFER.price)}</b>`;
}
showOffer();
// ===== الشحن المجاني =====
const FREE_SHIPPING = { on: true, until: '2026-11-04T23:59:59+02:00' };  // ينتهي آخر يوم 3 نوفمبر

function freeShippingActive() {
  return FREE_SHIPPING.on && Date.now() < new Date(FREE_SHIPPING.until).getTime();
}

function tickShipping() {
  const els = document.querySelectorAll('.ship-banner');
  if (!freeShippingActive()) { els.forEach(el => el.hidden = true); return; }
  const ms = new Date(FREE_SHIPPING.until).getTime() - Date.now();
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const left = d > 0
    ? `${d} يوم و ${h} ساعة`
    : `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  els.forEach(el => {
    el.hidden = false;
    el.innerHTML = `🚚 شحن مجاني لكل الطلبات — باقي <b>${left}</b>`;
  });
}
tickShipping();
setInterval(tickShipping, 1000);
// ===== عداد تنازلي ينتهي في وقت وتاريخ محدد وثابت للجميع =====
function updateOfferTimer() {
  const offerEl = $('#offerBanner');
  if (!offerEl || !OFFER.on) return;

  // حدد هنا التاريخ والوقت بالظبط (السنة - الشهر - اليومTالساعة:الدقيقة:الثانية)
  // مثال: العرض ينتهي يوم 5 نوفمبر 2026 الساعة 12 منتصف الليل
  const targetDate = new Date('2026-11-05T23:59:59').getTime();

  function tick() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
      offerEl.innerHTML = `🔥 عرض خاص: كل <b>${OFFER.qty}</b> قطع بـ <b>${fmt(OFFER.price)}</b> (انتهى العرض)`;
      return;
    }

    // حساب الأيام، الساعات، الدقائق، والثواني المتبقية
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / 1000 / 60) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    // لو عايز تعرض الأيام لو العرض طويل، أو تكتفي بالساعات والدقائق:
    const timeStr = days > 0 
      ? `${days} يوم و ${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
      : `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    
    offerEl.innerHTML = `🔥 عرض خاص: كل <b>${OFFER.qty}</b> قطع بـ <b>${fmt(OFFER.price)}</b> <span class="timer-tag">⏰ ينتهي خلال ${timeStr}</span>`;
  }

  tick();
  setInterval(tick, 1000);
}

updateOfferTimer();
// ===== زر العودة للأعلى وتحكم الـ Toast =====
const scrollTopBtn = $('#scrollTopBtn');
const toastEl = $('#toastNotification');

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    scrollTopBtn.classList.add('show');
  } else {
    scrollTopBtn.classList.remove('show');
  }
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// دالة إظهار إشعار السلة السريع
function showToast(message) {
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.classList.add('show');
  setTimeout(() => {
    toastEl.classList.remove('show');
  }, 2500);
}
// ===== تشغيل =====
renderProducts();
renderCart();
