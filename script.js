// ===== إعدادات =====
const WHATSAPP_NUMBER = '201044012465'; // غيّره برقمك بصيغة دولية بدون + (مثال: 201012345678)
const CURRENCY = 'ج.م';
const PAYMENTS = {
  'الدفع عند الاستلام': 'هتدفع للمندوب لما الطلب يوصلك.',
  'إنستاباي': 'حوّل على: <b>mohamedmosaabomosa@instapay</b> وابعت صورة التحويل على واتساب.',
  'فودافون كاش': 'حوّل على رقم: <b>01044012465</b> وابعت صورة التحويل على واتساب.'
};
// ===== المنتجات =====
// عدّل المنتجات من هنا. كل منتج سطر واحد:
const products = [
  { id: 1, name: 'Black',       price: 650, oldPrice: 850, color: '#15120f', img: 'images/black.jpeg' },
  { id: 2, name: 'Ganzari',     price: 650, oldPrice: 850, color: '#02628b', img: 'images/Ganzari.jpeg' },
  { id: 3, name: 'White',       price: 650, oldPrice: 850, color: '#2b2824', img: 'images/white.jpeg' },
  { id: 4, name: 'Olive Green', price: 650, oldPrice: 850, color: '#213302', img: 'images/Olive Green.jpeg' },
  { id: 5, name: 'Warm Beige',  price: 650, oldPrice: 850, color: '#C4B197', img: 'images/Warm Beige.jpeg' },
  { id: 6, name: 'Pink',        price: 650, oldPrice: 850, color: '#FFC0CB', img: 'images/pink.jpeg' }
];
const SIZES = ['S', 'M', 'L', 'XL'];

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
let cart = JSON.parse(localStorage.getItem('2m-cart') || '[]');
const selectedSize = {}; // id -> size

const $ = (s) => document.querySelector(s);
const fmt = (n) => `${n.toLocaleString('ar-EG')} ${CURRENCY}`;
const save = () => localStorage.setItem('2m-cart', JSON.stringify(cart));

// ===== عرض المنتجات =====
function renderProducts() {
  $('#productGrid').innerHTML = products.map(p => {
    selectedSize[p.id] = selectedSize[p.id] || 'M';
    return `
    <article class="card" data-id="${p.id}">
      <div class="thumb">${visual(p)}</div>
      <h3>${p.name}</h3>
      <p class="price">${p.oldPrice ? `<s class="old">${fmt(p.oldPrice)}</s>` : ''}<span class="now">${fmt(p.price)}</span>${p.oldPrice ? `<span class="badge">-${Math.round((1 - p.price / p.oldPrice) * 100)}%</span>` : ''}</p>
      <div class="opts">
        <span>المقاس</span>
        <div class="sizes">
          ${SIZES.map(s => `<button type="button" data-size="${s}" class="${s === 'M' ? 'active' : ''}">${s}</button>`).join('')}
        </div>
      </div>
      <button class="btn add" type="button">أضف للسلة</button>
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
  const total = cart.reduce((a, b) => a + b.qty * products.find(x => x.id === b.id).price, 0);
  $('#cartCount').textContent = count;
  $('#cartTotal').textContent = fmt(total);

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
  const card = e.target.closest('.card');

  // اختيار المقاس
  const sizeBtn = e.target.closest('.sizes button');
  if (sizeBtn && card) {
    card.querySelectorAll('.sizes button').forEach(b => b.classList.remove('active'));
    sizeBtn.classList.add('active');
    selectedSize[+card.dataset.id] = sizeBtn.dataset.size;
  }

  // إضافة للسلة
  if (e.target.closest('.add') && card) {
    const id = +card.dataset.id, size = selectedSize[id];
    const found = cart.find(i => i.id === id && i.size === size);
    found ? found.qty++ : cart.push({ id, size, qty: 1 });
    renderCart();
    openCart(true);
  }

  // التحكم في السلة
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

// ===== إرسال الطلب على واتساب =====
$('#orderForm').addEventListener('submit', (e) => {
  e.preventDefault();
  if (!cart.length) { alert('ضيف منتجات للسلة الأول'); return; }

  const f = new FormData(e.target);
  const total = cart.reduce((a, b) => a + b.qty * products.find(x => x.id === b.id).price, 0);
  const lines = cart.map(it => {
    const p = products.find(x => x.id === it.id);
    return `• ${p.name} | مقاس ${it.size} | ${it.qty} × ${p.price}`;
  });

  const msg = [
    '🖤 طلب جديد من 2M Hoodies',
    '',
    ...lines,
    '',
    `الإجمالي: ${total} ${CURRENCY}`,
    '',
    `الاسم: ${f.get('name')}`,
    `الموبايل: ${f.get('phone')}`,
    `المحافظة: ${f.get('gov')}`,
    `العنوان: ${f.get('address')}`    `العنوان: ${f.get('address')}`,
    `طريقة الدفع: ${f.get('pay')}`
  ].join('\n');

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
});
const lightbox = $('#lightbox'), lbImg = $('#lbImg');

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
// ===== تشغيل =====
renderProducts();
renderCart();
