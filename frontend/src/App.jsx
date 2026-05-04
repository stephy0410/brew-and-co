import { useState } from 'react'
import './App.css'

// ── SVG Icons ──────────────────────────────────────────────
const IconHome = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
)
const IconBag = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
  </svg>
)
const IconCoffee = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
  </svg>
)
const IconHeart = ({ filled }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
  </svg>
)
const IconUser = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)
const IconPlus = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)
const IconStar = ({ filled }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)
const IconChevron = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
)

// ── Data ───────────────────────────────────────────────────
const drinks = [
  { id: 1, name: 'Star Latte', desc: 'Iced', price: 89, gradient: 'linear-gradient(135deg,#8a6040,#c4956a)', img: 'star-latte.jpg' },
  { id: 2, name: 'Cappuccino', desc: 'Hot', price: 75, gradient: 'linear-gradient(135deg,#6b4c35,#a07850)', img: 'cappuccino.jpg' },
  { id: 3, name: 'Cold Brew', desc: 'Iced', price: 79, gradient: 'linear-gradient(135deg,#1c2a3a,#2e4560)', img: 'cold-brew.jpg' },
  { id: 4, name: 'Iced Matcha', desc: 'Iced', price: 85, gradient: 'linear-gradient(135deg,#6b8e5e,#9cb887)', img: 'iced-matcha.jpg' },
]
const mugs = [
  { id: 1, name: 'Purple Flower Mug', price: 380, gradient: 'linear-gradient(135deg,#7b6da0,#a090c4)', img: 'mug-purple.jpg' },
  { id: 2, name: 'Blue Star Mug',    price: 380, gradient: 'linear-gradient(135deg,#5a7aab,#7a9acb)', img: 'mug-blue.jpg' },
  { id: 3, name: 'Pink Lily Mug',    price: 380, gradient: 'linear-gradient(135deg,#c48090,#d8a0b0)', img: 'mug-pink.jpg' },
  { id: 4, name: 'Tulip Mug',        price: 380, gradient: 'linear-gradient(135deg,#c8906a,#e0b090)', img: 'mug-tulip.jpg' },
]
const foods = [
  { id: 1, name: 'Cinnamon Roll',         desc: 'Warm, glazed, freshly baked',      price: 65, gradient: 'linear-gradient(135deg,#b87840,#d49860)', img: 'cinnamon-roll.jpg' },
  { id: 2, name: 'Choco Chip Muffin',     desc: 'Double chocolate chips',            price: 55, gradient: 'linear-gradient(135deg,#7a5030,#9a7050)', img: 'choco-muffin.jpg' },
  { id: 3, name: 'Choco Chunk Cookies',   desc: 'Crispy edges, soft center',         price: 58, gradient: 'linear-gradient(135deg,#9a7845,#c8a06a)', img: 'cookies.jpg' },
  { id: 4, name: 'Salmon Avocado Toast',  desc: 'Smoked salmon, cream cheese',       price: 95, gradient: 'linear-gradient(135deg,#c87060,#e09080)', img: 'salmon-toast.jpg' },
]

// ── Top Nav (aparece en todas las pantallas) ───────────────
const TopNav = () => (
  <div className="topnav">
    <span className="topnav-logo">Brew &amp; Co.</span>
  </div>
)

// ── Image with gradient fallback ───────────────────────────
const Img = ({ gradient, imgName, className }) => {
  const [err, setErr] = useState(false)
  if (err) return <div className={`img-ph ${className || ''}`} style={{ background: gradient }} />
  return (
    <img
      src={`/${imgName}`}
      alt=""
      className={`img-ph ${className || ''}`}
      style={{ objectFit: 'cover', display: 'block' }}
      onError={() => setErr(true)}
    />
  )
}

// ══════════════════════════════════════════════════════════
// HOME
// ══════════════════════════════════════════════════════════
function HomeScreen({ onNavigate }) {
  const stars = 10, max = 100
  return (
    <div className="screen home-screen">
      <TopNav />
      <div className="home-header">
        <div>
          <p className="greet-sub">Good morning</p>
          <h1 className="greet-name">Hannah</h1>
        </div>
        <div className="avatar-sm">H</div>
      </div>

      {/* Stars card */}
      <div className="stars-card">
        <div className="stars-row">
          <div>
            <p className="stars-label">Your stars</p>
            <div className="stars-count"><IconStar filled /><span>{stars}</span><span className="stars-max">/ {max}</span></div>
          </div>
          <span className="tier-badge">Gold</span>
        </div>
        <div className="bar-track"><div className="bar-fill" style={{ width: `${(stars/max)*100}%` }}/></div>
        <p className="stars-hint">{max - stars} more stars to your next reward</p>
      </div>

      {/* Hero banner */}
      <div className="hero-banner" onClick={() => onNavigate('order')}>
        {/* Replace with: <img src="star-latte.jpg" alt="Star Latte" className="hero-banner-bg" /> */}
        <Img gradient="linear-gradient(135deg,#8a6040,#c4956a)" imgName="star-latte.jpg" className="hero-banner-bg" />
        <div className="hero-banner-overlay">
          <p className="hb-label">Featured</p>
          <h2 className="hb-title">Star Latte</h2>
          <p className="hb-sub">Our signature iced blend</p>
          <span className="hb-btn">Order now</span>
        </div>
      </div>

      {/* For you */}
      <p className="section-title">For you</p>
      <div className="foryou-grid">
        <div className="fy-card" onClick={() => onNavigate('order')}>
          <Img gradient="linear-gradient(135deg,#6b4c35,#a07850)" imgName="cappuccino.jpg" className="fy-img" />
          <p className="fy-name">Cappuccino</p><p className="fy-sub">$75</p>
        </div>
        <div className="fy-card" onClick={() => onNavigate('favorites')}>
          <div className="fy-icon-card"><IconStar filled /></div>
          <p className="fy-name">Redeem</p><p className="fy-sub">reward</p>
        </div>
        <div className="fy-card" onClick={() => onNavigate('products')}>
          <Img gradient="linear-gradient(135deg,#7b6da0,#a090c4)" imgName="mug-purple.jpg" className="fy-img" />
          <p className="fy-name">New mugs</p><p className="fy-sub">Shop now</p>
        </div>
        <div className="fy-card" onClick={() => onNavigate('order')}>
          <Img gradient="linear-gradient(135deg,#1c2a3a,#2e4560)" imgName="cold-brew.jpg" className="fy-img" />
          <p className="fy-name">Iced season</p><p className="fy-sub">is here</p>
        </div>
      </div>

      {/* Drinks scroll */}
      <p className="section-title">Drinks</p>
      <div className="scroll-row">
        {drinks.map(d => (
          <div key={d.id} className="scroll-card" onClick={() => onNavigate('order')}>
            <Img gradient={d.gradient} imgName={d.img} className="scroll-img" />
            <p className="scroll-name">{d.name}</p>
            <p className="scroll-sub">{d.desc} · ${d.price}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════
// PRODUCTS
// ══════════════════════════════════════════════════════════
function ProductsScreen() {
  const [favs, setFavs] = useState([])
  const toggle = id => setFavs(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id])

  return (
    <div className="screen products-screen">
      <TopNav />
      <div className="screen-header">
        <h2 className="screen-title">Mugs</h2>
        <p className="screen-sub">Handpainted ceramics</p>
      </div>

      <div className="mug-grid">
        {mugs.map(m => (
          <div key={m.id} className="mug-card">
            <div className="mug-img-wrap">
              {/* Replace with: <img src={m.img} alt={m.name} className="mug-img" /> */}
              <Img gradient={m.gradient} imgName={m.img} className="mug-img" />
              <button className={`fav-btn ${favs.includes(m.id) ? 'active' : ''}`} onClick={() => toggle(m.id)}>
                <IconHeart filled={favs.includes(m.id)} />
              </button>
            </div>
            <div className="mug-info">
              <p className="mug-name">{m.name}</p>
              <div className="mug-bottom">
                <p className="mug-price">${m.price}</p>
                <button className="add-btn"><IconPlus /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pair-banner">
        <p className="pair-text">Pair with your drink</p>
        <p className="pair-discount">15% off</p>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════
// ORDER
// ══════════════════════════════════════════════════════════
function OrderScreen() {
  return (
    <div className="screen order-screen">
      <TopNav />
      <div className="screen-header">
        <h2 className="screen-title">Order</h2>
        <p className="screen-sub">Pick your favorites</p>
      </div>

      <p className="order-cat">Drinks</p>
      <div className="order-list">
        {drinks.map(d => (
          <div key={d.id} className="order-item">
            {/* Replace with: <img src={d.img} alt={d.name} className="order-img" /> */}
            <Img gradient={d.gradient} imgName={d.img} className="order-img" />
            <div className="order-info">
              <p className="order-name">{d.name}</p>
              <p className="order-desc">{d.desc}</p>
              <p className="order-price">${d.price}</p>
            </div>
            <button className="add-btn"><IconPlus /></button>
          </div>
        ))}
      </div>

      <p className="order-cat">Food</p>
      <div className="order-list">
        {foods.map(f => (
          <div key={f.id} className="order-item">
            {/* Replace with: <img src={f.img} alt={f.name} className="order-img" /> */}
            <Img gradient={f.gradient} imgName={f.img} className="order-img" />
            <div className="order-info">
              <p className="order-name">{f.name}</p>
              <p className="order-desc">{f.desc}</p>
              <p className="order-price">${f.price}</p>
            </div>
            <button className="add-btn"><IconPlus /></button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════
// FAVORITES
// ══════════════════════════════════════════════════════════
function FavoritesScreen({ onNavigate }) {
  const saved = [

    { id: 1, name: 'Cappuccino', type: 'Drink · Hot', price: 75, gradient: 'linear-gradient(135deg,#6b4c35,#a07850)', img: 'cappuccino.jpg' },
    { id: 2, name: 'Purple Flower Mug', type: 'Ceramic mug', price: 380, gradient: 'linear-gradient(135deg,#7b6da0,#a090c4)', img: 'mug-purple.jpg' },
  ]
  const explore = [...drinks, ...mugs.slice(0, 2)]

  return (
    <div className="screen favorites-screen">
      <TopNav />
      <div className="screen-header px">
        <h2 className="screen-title">Favorites</h2>
        <p className="screen-sub">Your saved items</p>
      </div>

      <div className="fav-list">
        {saved.map(item => (
          <div key={item.id} className="fav-item">
            {/* Replace with: <img src={item.img} alt={item.name} className="fav-img" /> */}
            <Img gradient={item.gradient} imgName={item.img} className="fav-img" />
            <div className="fav-info">
              <p className="fav-name">{item.name}</p>
              <p className="fav-type">{item.type}</p>
              <p className="fav-price">${item.price}</p>
            </div>
            <div className="fav-actions">
              <button className="fav-btn active"><IconHeart filled /></button>
              <button className="add-btn"><IconPlus /></button>
            </div>
          </div>
        ))}
      </div>

      <p className="section-title px mt">Keep exploring</p>
      <div className="scroll-row">
        {explore.map((item, i) => (
          <div key={i} className="scroll-card" onClick={() => onNavigate(item.price > 100 ? 'products' : 'order')}>
            <Img gradient={item.gradient} imgName={item.img} className="scroll-img" />
            <p className="scroll-name">{item.name}</p>
            <p className="scroll-sub">${item.price}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════
// ACCOUNT
// ══════════════════════════════════════════════════════════
function AccountScreen() {
  const orders = [
    { id: 1, items: 'Cappuccino + Cinnamon Roll', date: 'Apr 30', total: 140 },
    { id: 2, items: 'Iced Matcha', date: 'Apr 28', total: 85 },
  ]
  const settings = ['Personal info', 'Password', 'Notifications', 'Appearance']

  return (
    <div className="screen account-screen">
      <TopNav />
      <div className="account-hero">
        <div className="account-avatar">H</div>
        <h2 className="account-name">Hannah</h2>
        <span className="tier-badge">Gold tier</span>
      </div>

      <div className="stars-card">
        <div className="stars-row">
          <div>
            <p className="stars-label">Stars balance</p>
            <div className="stars-count"><IconStar filled /><span>10</span><span className="stars-max">/ 100</span></div>
          </div>
        </div>
        <div className="bar-track"><div className="bar-fill" style={{ width: '10%' }}/></div>
        <p className="stars-hint">90 more stars to your next reward</p>
      </div>

      <p className="account-cat">Order history</p>
      <div className="history-list">
        {orders.map(o => (
          <div key={o.id} className="history-item">
            <div>
              <p className="history-items">{o.items}</p>
              <p className="history-date">{o.date}</p>
            </div>
            <p className="history-total">${o.total}</p>
          </div>
        ))}
      </div>

      <p className="account-cat">Settings</p>
      <div className="settings-list">
        {settings.map(s => (
          <div key={s} className="settings-item">
            <span>{s}</span><IconChevron />
          </div>
        ))}
        <div className="settings-item danger">
          <span>Sign out</span><IconChevron />
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════
// BOTTOM NAV
// ══════════════════════════════════════════════════════════
function BottomNav({ active, onChange }) {
  const tabs = [
    { id: 'home',      label: 'Home',      icon: <IconHome /> },
    { id: 'products',  label: 'Products',  icon: <IconBag /> },
    { id: 'order',     label: 'Order',     icon: <IconCoffee /> },
    { id: 'favorites', label: 'Favorites', icon: <IconHeart /> },
    { id: 'account',   label: 'Account',   icon: <IconUser /> },
  ]
  return (
    <nav className="bottom-nav">
      {tabs.map(t => (
        <button key={t.id} className={`nav-tab ${active === t.id ? 'active' : ''}`} onClick={() => onChange(t.id)}>
          {t.icon}
          <span>{t.label}</span>
        </button>
      ))}
    </nav>
  )
}

// ══════════════════════════════════════════════════════════
// APP
// ══════════════════════════════════════════════════════════
export default function App() {
  const [screen, setScreen] = useState('home')
  const screens = {
    home:      <HomeScreen onNavigate={setScreen} />,
    products:  <ProductsScreen />,
    order:     <OrderScreen />,
    favorites: <FavoritesScreen onNavigate={setScreen} />,
    account:   <AccountScreen />,
  }
  return (
    <div className="app-shell">
      <div className="mobile-frame">
        <div className="screen-area">{screens[screen]}</div>
        <BottomNav active={screen} onChange={setScreen} />
      </div>
    </div>
  )
}