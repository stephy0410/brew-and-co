import { useState, useEffect, useRef } from 'react'
import './App.css'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '')

// ── Constants ──────────────────────────────────────────────
const STARS_GOAL = 50
const MILK_OPTIONS = [
  { id: 'entera', name: 'Entera', extra: 0 },
  { id: 'deslactosada', name: 'Deslactosada', extra: 5 },
  { id: 'descremada', name: 'Descremada', extra: 5 },
  { id: 'soya', name: 'Soya', extra: 5 },
  { id: 'almendra', name: 'Almendra', extra: 5 },
]
const VALID_CODES = ['BREW2026', 'COFFEE1', 'STAR10', 'BREW100']

// ── Data ───────────────────────────────────────────────────
const drinks = [
  { id: 1, name: 'Star Latte', desc: 'Iced', price: 89, gradient: 'linear-gradient(135deg,#8a6040,#c4956a)', img: 'star-latte.jpg', category: 'drink' },
  { id: 2, name: 'Cappuccino', desc: 'Hot', price: 75, gradient: 'linear-gradient(135deg,#6b4c35,#a07850)', img: 'cappuccino.jpg', category: 'drink' },
  { id: 3, name: 'Cold Brew', desc: 'Iced', price: 79, gradient: 'linear-gradient(135deg,#1c2a3a,#2e4560)', img: 'cold-brew.jpg', category: 'drink' },
  { id: 4, name: 'Iced Matcha', desc: 'Iced', price: 85, gradient: 'linear-gradient(135deg,#6b8e5e,#9cb887)', img: 'iced-matcha.jpg', category: 'drink' },
]
const mugs = [
  { id: 5, name: 'Purple Flower Mug', price: 380, gradient: 'linear-gradient(135deg,#7b6da0,#a090c4)', img: 'mug-purple.jpg', category: 'mug' },
  { id: 6, name: 'Blue Star Mug', price: 380, gradient: 'linear-gradient(135deg,#5a7aab,#7a9acb)', img: 'mug-blue.jpg', category: 'mug' },
  { id: 7, name: 'Pink Lily Mug', price: 380, gradient: 'linear-gradient(135deg,#c48090,#d8a0b0)', img: 'mug-pink.jpg', category: 'mug' },
  { id: 8, name: 'Tulip Mug', price: 380, gradient: 'linear-gradient(135deg,#c8906a,#e0b090)', img: 'mug-tulip.jpg', category: 'mug' },
]
const foods = [
  { id: 9, name: 'Cinnamon Roll', desc: 'Warm, glazed, freshly baked', price: 65, gradient: 'linear-gradient(135deg,#b87840,#d49860)', img: 'cinnamon-roll.jpg', category: 'food' },
  { id: 10, name: 'Choco Chip Muffin', desc: 'Double chocolate chips', price: 55, gradient: 'linear-gradient(135deg,#7a5030,#9a7050)', img: 'choco-muffin.jpg', category: 'food' },
  { id: 11, name: 'Choco Chunk Cookies', desc: 'Crispy edges, soft center', price: 58, gradient: 'linear-gradient(135deg,#9a7845,#c8a06a)', img: 'cookies.jpg', category: 'food' },
  { id: 12, name: 'Salmon Avocado Toast', desc: 'Smoked salmon, cream cheese', price: 95, gradient: 'linear-gradient(135deg,#c87060,#e09080)', img: 'salmon-toast.jpg', category: 'food' },
]
const allProducts = [...drinks, ...mugs, ...foods]

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
const IconStarNav = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0.5">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)
const IconUser = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)
const IconHeart = ({ filled }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? '#c9a96e' : 'none'} stroke={filled ? '#c9a96e' : 'currentColor'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
  </svg>
)
const IconPlus = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)
const IconMinus = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)

// ── Image with fallback ────────────────────────────────────
const Img = ({ gradient, imgName, className }) => {
  const [err, setErr] = useState(false)
  if (err) return <div className={`img-ph ${className || ''}`} style={{ background: gradient }} />
  return (
    <img src={`/${imgName}`} alt="" className={className || ''} 
      style={{ objectFit: 'cover', display: 'block' }} onError={() => setErr(true)} />
  )
}

// ── Top Nav ────────────────────────────────────────────────
const TopNav = ({ title, cartCount, onCartClick, onBack }) => (
  <div className="topnav">
    {onBack && <button className="back-btn" onClick={onBack}>←</button>}
    <span className="topnav-logo">{title || 'Brew & Co.'}</span>
    {cartCount > 0 && (
      <button className="cart-badge-btn" onClick={onCartClick}>
        <IconBag />
        <span className="cart-badge">{cartCount}</span>
      </button>
    )}
  </div>
)

// ── Bottom Nav ─────────────────────────────────────────────
const BottomNav = ({ screen, onNavigate, cartCount }) => {
  const tabs = [
    { id: 'home', icon: <IconHome />, label: 'Home' },
    { id: 'products', icon: <IconCoffee />, label: 'Menu' },
    { id: 'order', icon: <IconBag />, label: 'Order' },
    { id: 'rewards', icon: <IconStarNav />, label: 'Rewards' },
    { id: 'account', icon: <IconUser />, label: 'Account' },
  ]
  return (
    <nav className="bottom-nav">
      {tabs.map(t => (
        <button key={t.id} className={`nav-tab ${screen === t.id ? 'active' : ''}`} onClick={() => onNavigate(t.id)}>
          <span className="nav-icon-wrap">
            {t.icon}
            {t.id === 'order' && cartCount > 0 && <span className="nav-dot" />}
          </span>
          <span>{t.label}</span>
        </button>
      ))}
    </nav>
  )
}

// ══════════════════════════════════════════════════════════
// LOGIN SCREEN
// ══════════════════════════════════════════════════════════
function LoginScreen({ onLogin }) {
  const [tab, setTab] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')

  const handleSubmit = () => {
    if (!form.email || !form.password) { setError('Please fill in all fields'); return }
    if (tab === 'register') {
      if (!form.name) { setError('Name is required'); return }
      const existing = JSON.parse(localStorage.getItem('brew_users') || '[]')
      if (existing.find(u => u.email === form.email)) { setError('Email already registered'); return }
      const newUser = {
        id: Date.now(),
        name: form.name,
        email: form.email,
        password: form.password,
        stars: 0,
        orderHistory: [],
        usedCodes: [],
        freeProducts: 0,
        favorites: [],
      }
      localStorage.setItem('brew_users', JSON.stringify([...existing, newUser]))
      localStorage.setItem('brew_user', JSON.stringify(newUser))
      onLogin(newUser)
    } else {
      const existing = JSON.parse(localStorage.getItem('brew_users') || '[]')
      const user = existing.find(u => u.email === form.email && u.password === form.password)
      if (!user) { setError('Invalid email or password'); return }
      localStorage.setItem('brew_user', JSON.stringify(user))
      onLogin(user)
    }
  }

  return (
    <div className="screen login-screen">
      <div className="login-header">
        <h1 className="login-logo">Brew &amp; Co.</h1>
        <p className="login-sub">Your daily coffee ritual</p>
      </div>
      <div className="login-tabs">
        <button className={`login-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => { setTab('login'); setError('') }}>Sign In</button>
        <button className={`login-tab ${tab === 'register' ? 'active' : ''}`} onClick={() => { setTab('register'); setError('') }}>Create Account</button>
      </div>
      <div className="login-form">
        {tab === 'register' && (
          <input className="login-input" placeholder="Full name" value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })} />
        )}
        <input className="login-input" placeholder="Email" type="email" value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })} />
        <input className="login-input" placeholder="Password" type="password" value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
        {error && <p className="login-error">{error}</p>}
        <button className="login-btn" onClick={handleSubmit}>
          {tab === 'login' ? 'Sign In' : 'Create Account'}
        </button>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════
// HOME SCREEN
// ══════════════════════════════════════════════════════════
function HomeScreen({ user, favorites, cart, onNavigate, onToggleFavorite, onAddToCart }) {
  const favProducts = allProducts.filter(p => favorites.includes(p.id))
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0)
  const stars = user?.stars || 0
  const pct = Math.min((stars / STARS_GOAL) * 100, 100)

  return (
    <div className="screen home-screen">
      <TopNav cartCount={cartCount} onCartClick={() => onNavigate('order')} />
      <div className="home-scroll">
        <div className="home-header">
          <div>
            <p className="greet-sub">Good morning</p>
            <h1 className="greet-name">{user?.name?.split(' ')[0] || 'Guest'}</h1>
          </div>
        </div>

        <div className="stars-card">
          <div className="stars-card-top">
            <div>
              <p className="stars-label">Brew Stars</p>
              <p className="stars-count"><span>{stars}</span> / {STARS_GOAL}</p>
            </div>
            <button className="redeem-btn" onClick={() => onNavigate('rewards')}>Redeem</button>
          </div>
          <div className="stars-bar-bg">
            <div className="stars-bar-fill" style={{ width: `${pct}%` }} />
          </div>
          <p className="stars-hint">{Math.max(STARS_GOAL - stars, 0)} stars until your free drink</p>
        </div>

        {favProducts.length > 0 && (
          <div className="home-section">
            <h2 className="section-title">Your Favourites</h2>
            <div className="h-scroll">
              {favProducts.map(p => (
                <div key={p.id} className="fav-card">
                  <Img gradient={p.gradient} imgName={p.img} className="fav-card-img" />
                  <div className="fav-card-info">
                    <p className="fav-card-name">{p.name}</p>
                    <p className="fav-card-price">${p.price}</p>
                  </div>
                  <button className="fav-heart-btn" onClick={() => onToggleFavorite(p.id)}>
                    <IconHeart filled />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="home-section">
          <div className="section-header">
            <h2 className="section-title">For You</h2>
            <button className="see-all" onClick={() => onNavigate('products')}>See all</button>
          </div>
          <div className="h-scroll">
            {drinks.map(p => (
              <div key={p.id} className="featured-card">
                <Img gradient={p.gradient} imgName={p.img} className="featured-card-img" />
                <button className="feat-heart" onClick={() => onToggleFavorite(p.id)}>
                  <IconHeart filled={favorites.includes(p.id)} />
                </button>
                <div className="featured-card-info">
                  <p className="featured-name">{p.name}</p>
                  <div className="featured-bottom">
                    <span className="featured-price">${p.price}</span>
                    <button className="add-btn" onClick={() => onAddToCart(p)}><IconPlus /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════
// MILK MODAL
// ══════════════════════════════════════════════════════════
function MilkModal({ product, onClose, onAdd }) {
  const [selected, setSelected] = useState('regular')
  const extra = MILK_OPTIONS.find(m => m.id === selected)?.extra || 0
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <h3 className="modal-title">Choose your milk</h3>
        <p className="modal-subtitle">{product.name}</p>
        <div className="milk-options">
          {MILK_OPTIONS.map(m => (
            <button key={m.id} className={`milk-option ${selected === m.id ? 'selected' : ''}`}
              onClick={() => setSelected(m.id)}>
              <span>{m.name}</span>
              {m.extra > 0 && <span className="milk-extra">+${m.extra}</span>}
            </button>
          ))}
        </div>
        <button className="modal-add-btn" onClick={() => onAdd(product, selected)}>
          Add to order — ${product.price + extra}
        </button>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════
// PRODUCTS SCREEN
// ══════════════════════════════════════════════════════════
function ProductsScreen({ favorites, cart, onToggleFavorite, onAddToCart, cartCount, onCartClick }) {
  const [tab, setTab] = useState('drinks')
  const items = tab === 'drinks' ? drinks : tab === 'mugs' ? mugs : foods
  const cartQty = (id) => cart.filter(i => i.id === id).reduce((s, i) => s + i.quantity, 0)

  return (
    <div className="screen products-screen">
      <TopNav title="Menu" cartCount={cartCount} onCartClick={onCartClick} />
      <div className="prod-tabs">
        {['drinks', 'mugs', 'foods'].map(t => (
          <button key={t} className={`prod-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      <div className="prod-list">
        {items.map(p => (
          <div key={p.id} className="prod-card">
            <Img gradient={p.gradient} imgName={p.img} className="prod-card-img" />
            <div className="prod-card-body">
              <div className="prod-card-top">
                <div>
                  <p className="prod-name">{p.name}</p>
                  {p.desc && <p className="prod-desc">{p.desc}</p>}
                </div>
                <button className="heart-btn" onClick={() => onToggleFavorite(p.id)}>
                  <IconHeart filled={favorites.includes(p.id)} />
                </button>
              </div>
              <div className="prod-card-bottom">
                <span className="prod-price">${p.price}</span>
                <div className="qty-controls">
                  {cartQty(p.id) > 0 && <span className="qty-badge">{cartQty(p.id)}</span>}
                  <button className="add-btn" onClick={() => onAddToCart(p)}><IconPlus /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════
// ORDER SCREEN
// ══════════════════════════════════════════════════════════
// ── Payment Form (uses Stripe hooks — must be inside <Elements>) ──
function PaymentForm({ total, itemCount, hasMug, discount, onConfirmed, onBack }) {
  const stripe = useStripe()
  const elements = useElements()
  const [name, setName] = useState('')
  const [cardComplete, setCardComplete] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handlePay = async () => {
    setError('')
    if (!name.trim()) { setError('Please enter cardholder name.'); return }
    if (!cardComplete) { setError('Please complete your card details.'); return }
    if (!stripe || !elements) { setError('Stripe not loaded yet.'); return }

    setLoading(true)
    const cardEl = elements.getElement(CardElement)
    const { error: stripeErr, token } = await stripe.createToken(cardEl, { name })
    setLoading(false)

    if (stripeErr) { setError(stripeErr.message); return }
    // Token created — backend will charge it when ready
    onConfirmed(token)
  }

  return (
    <div className="payment-form">
      <div className="payment-summary">
        <p className="payment-label">TOTAL TO PAY</p>
        <h2 className="payment-total">${Math.round(total)}</h2>
        {hasMug && <p className="discount-note">15% mug discount — saved ${Math.round(discount)}</p>}
        <p className="stars-earn-note">You will earn {itemCount} stars</p>
      </div>
      <div className="stripe-form">
        <p className="stripe-label">Card details</p>
        <input
          className="stripe-input"
          placeholder="Cardholder name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <div className="stripe-card-element">
          <CardElement
            options={{
              style: {
                base: { fontSize: '15px', color: '#1c100a', fontFamily: 'Inter, sans-serif',
                  '::placeholder': { color: '#9a8b7e' } },
                invalid: { color: '#c06060' }
              }
            }}
            onChange={e => setCardComplete(e.complete)}
          />
        </div>
        {error && <p className="stripe-error">{error}</p>}
      </div>
      <button
        className="place-order-btn"
        onClick={handlePay}
        disabled={loading}
        style={{ opacity: loading ? 0.7 : 1 }}
      >
        {loading ? 'Processing...' : `Pay $${Math.round(total)}`}
      </button>
      <p className="stripe-note">Secured by Stripe</p>
    </div>
  )
}

function OrderScreen({ cart, onUpdateQuantity, onPlaceOrder, user }) {
  const [step, setStep] = useState('cart')
  const [starsEarned, setStarsEarned] = useState(0)
  const [orderTotal, setOrderTotal] = useState(0)
  const [freeRewardApplied, setFreeRewardApplied] = useState(false)

  const hasMug = cart.some(i => i.category === 'mug')
  const subtotal = cart.reduce((s, i) => {
    const milkExtra = i.milkType && i.milkType !== 'entera' ? 5 : 0
    return s + (i.price + milkExtra) * i.quantity
  }, 0)
  const discount = hasMug ? subtotal * 0.15 : 0

  // Free drink reward: find most expensive drink in cart
  const drinkItems = cart.filter(i => i.category === 'drink')
  const freeDrink = drinkItems.reduce((max, item) => {
    const p = item.price + (item.milkType && item.milkType !== 'entera' ? 5 : 0)
    const mp = max ? max.price + (max.milkType && max.milkType !== 'entera' ? 5 : 0) : 0
    return p > mp ? item : max
  }, null)
  const freeRewardDiscount = (freeRewardApplied && freeDrink)
    ? freeDrink.price + (freeDrink.milkType && freeDrink.milkType !== 'entera' ? 5 : 0)
    : 0

  const total = subtotal - discount - freeRewardDiscount
  const itemCount = cart.reduce((s, i) => s + i.quantity, 0)
  const hasFreeReward = (user?.freeProducts || 0) > 0

  const handleConfirmed = (token) => {
    setStarsEarned(itemCount)
    setOrderTotal(total)
    setStep('confirmed')
  }

  if (step === 'confirmed') return (
    <div className="screen order-screen">
      <TopNav title="Order Confirmed" />
      <div className="confirmed-view">
        <div className="confirmed-icon">✓</div>
        <h2>Order placed!</h2>
        <p className="confirmed-stars">You earned <strong>{starsEarned} stars</strong></p>
        <p className="confirmed-sub">Total paid: ${Math.round(orderTotal)}</p>
        <button className="place-order-btn" onClick={() => { onPlaceOrder(starsEarned, orderTotal, freeRewardApplied); setStep('cart'); setFreeRewardApplied(false) }}>
          Done
        </button>
      </div>
    </div>
  )

  if (step === 'payment') return (
    <div className="screen order-screen">
      <TopNav title="Payment" onBack={() => setStep('cart')} />
      <Elements stripe={stripePromise}>
        <PaymentForm
          total={total}
          itemCount={itemCount}
          hasMug={hasMug}
          discount={discount}
          onConfirmed={handleConfirmed}
          onBack={() => setStep('cart')}
        />
      </Elements>
    </div>
  )

  if (cart.length === 0) return (
    <div className="screen order-screen">
      <TopNav title="Your Order" />
      <div className="empty-cart">
        <IconBag />
        <p>Your cart is empty</p>
        <p className="empty-sub">Add items from the menu</p>
      </div>
    </div>
  )

  return (
    <div className="screen order-screen">
      <TopNav title="Your Order" />
      <div className="order-list">
        {cart.map((item, idx) => {
          const milkExtra = item.milkType && item.milkType !== 'regular' ? 5 : 0
          return (
            <div key={idx} className="order-item">
              <Img gradient={item.gradient} imgName={item.img} className="order-item-img" />
              <div className="order-item-body">
                <p className="order-item-name">{item.name}</p>
                {item.milkType && item.milkType !== 'regular' && (
                  <p className="order-item-milk">{item.milkType} +$5</p>
                )}
                <p className="order-item-price">${(item.price + milkExtra) * item.quantity}</p>
              </div>
              <div className="order-qty">
                <button className="qty-btn" onClick={() => onUpdateQuantity(item, -1)}><IconMinus /></button>
                <span className="qty-num">{item.quantity}</span>
                <button className="qty-btn" onClick={() => onUpdateQuantity(item, 1)}><IconPlus /></button>
              </div>
            </div>
          )
        })}
      </div>
      {hasFreeReward && drinkItems.length > 0 && (
        <div className={`free-reward-banner ${freeRewardApplied ? 'applied' : ''}`}
          onClick={() => setFreeRewardApplied(r => !r)}>
          <div className="free-reward-text">
            <p className="free-reward-title">Free drink reward</p>
            <p className="free-reward-sub">
              {freeRewardApplied
                ? `Applied — ${freeDrink?.name} is free`
                : 'Tap to apply to your most expensive drink'}
            </p>
          </div>
          <span className="free-reward-check">{freeRewardApplied ? '✓' : '+'}</span>
        </div>
      )}
      <div className="order-summary">
        <div className="summary-row"><span>Subtotal</span><span>${Math.round(subtotal)}</span></div>
        {hasMug && <div className="summary-row discount"><span>Mug discount (15%)</span><span>-${Math.round(discount)}</span></div>}
        {freeRewardApplied && freeDrink && (
          <div className="summary-row discount"><span>Free drink 🎁</span><span>-${Math.round(freeRewardDiscount)}</span></div>
        )}
        <div className="summary-row total-row"><span>Total</span><span>${Math.round(total)}</span></div>
        <p className="stars-earn-note">You will earn {itemCount} stars with this order</p>
        <button className="place-order-btn" onClick={() => setStep('payment')}>
          Checkout — ${Math.round(total)}
        </button>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════
// REWARDS SCREEN
// ══════════════════════════════════════════════════════════
function RewardsScreen({ user, onNavigate }) {
  const stars = user?.stars || 0
  const pct = Math.min((stars / STARS_GOAL) * 100, 100)
  const rewardsHistory = user?.rewardsHistory || []

  return (
    <div className="screen rewards-screen">
      <TopNav title="Brew Rewards" />
      <div className="rewards-scroll">

        {/* Stars card */}
        <div className="rewards-stars-card">
          <div className="rewards-stars-top">
            <div className="rewards-star-icon"><IconStarNav /></div>
            <div>
              <p className="rewards-stars-num">{stars}</p>
              <p className="rewards-stars-label">Brew Stars</p>
            </div>
          </div>
          <div className="stars-bar-bg">
            <div className="stars-bar-fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="rewards-bar-labels">
            <span>0</span>
            <span>{STARS_GOAL} = free drink</span>
          </div>
          <p className="stars-hint" style={{marginTop: 8}}>{Math.max(STARS_GOAL - stars, 0)} more stars for a free drink</p>
        </div>

        {/* Free drink redirect */}
        {(user?.freeProducts || 0) > 0 && (
          <div className="free-product-card">
            <div className="free-product-info">
              <p style={{fontWeight:600, fontSize:14}}>Free drink available</p>
              <p style={{fontSize:12, color:'var(--muted)', marginTop:3}}>
                {user.freeProducts} reward{user.freeProducts > 1 ? 's' : ''} — apply in your order
              </p>
            </div>
            <button className="claim-btn" onClick={() => onNavigate('order')}>
              Use now
            </button>
          </div>
        )}

        {/* How it works */}
        <div className="code-section">
          <h3 className="code-title">How it works</h3>
          <div className="how-it-works">
            <div className="hiw-row">
              <div className="hiw-num">1</div>
              <p>Place an order in the app</p>
            </div>
            <div className="hiw-row">
              <div className="hiw-num">2</div>
              <p>Earn 1 star per item ordered</p>
            </div>
            <div className="hiw-row">
              <div className="hiw-num">3</div>
              <p>Reach {STARS_GOAL} stars and get a free drink</p>
            </div>
          </div>
        </div>

        {/* Rewards history */}
        <div className="rewards-history">
          <h3 className="code-title">Activity</h3>
          {rewardsHistory.length === 0 ? (
            <p style={{fontSize:13, color:'var(--muted)', padding:'8px 0'}}>No activity yet — place your first order!</p>
          ) : (
            rewardsHistory.slice().reverse().map((r, i) => (
              <div key={i} className="history-row">
                <div>
                  <p className="history-date">{new Date(r.date).toLocaleDateString()}</p>
                  <p style={{fontSize:12, color:'var(--muted)'}}>{r.type === 'earned' ? `${r.itemCount} item order` : 'Free drink redeemed'}</p>
                </div>
                <span className={`history-stars ${r.type === 'redeemed' ? 'redeemed' : ''}`}>
                  {r.type === 'earned' ? `+${r.stars} stars` : '🎉 Redeemed'}
                </span>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════
// ACCOUNT SCREEN
// ══════════════════════════════════════════════════════════
function AccountScreen({ user, onSignOut, onUpdateUser }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' })
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' })
  const [pwMsg, setPwMsg] = useState('')

  const saveProfile = () => {
    onUpdateUser({ ...user, name: form.name, email: form.email })
    setEditing(false)
  }

  const changePassword = () => {
    if (pwForm.current !== user.password) { setPwMsg('Current password incorrect'); return }
    if (pwForm.newPw !== pwForm.confirm) { setPwMsg('Passwords do not match'); return }
    if (pwForm.newPw.length < 6) { setPwMsg('Min 6 characters'); return }
    onUpdateUser({ ...user, password: pwForm.newPw })
    setPwForm({ current: '', newPw: '', confirm: '' })
    setPwMsg('Password updated!')
    setTimeout(() => setPwMsg(''), 3000)
  }

  return (
    <div className="screen account-screen">
      <TopNav title="Account" />
      <div className="account-scroll">
        <div className="account-section">
          <div className="account-section-header">
            <h3>Personal Info</h3>
            <button className="edit-btn" onClick={() => setEditing(!editing)}>{editing ? 'Cancel' : 'Edit'}</button>
          </div>
          {editing ? (
            <>
              <input className="account-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Name" />
              <input className="account-input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email" />
              <button className="account-save-btn" onClick={saveProfile}>Save changes</button>
            </>
          ) : (
            <>
              <div className="account-row"><span className="account-label">Name</span><span>{user?.name}</span></div>
              <div className="account-row"><span className="account-label">Email</span><span>{user?.email}</span></div>
              <div className="account-row"><span className="account-label">Stars</span><span>{user?.stars || 0} stars</span></div>
            </>
          )}
        </div>

        <div className="account-section">
          <h3>Change Password</h3>
          <input className="account-input" type="password" placeholder="Current password" value={pwForm.current}
            onChange={e => setPwForm({ ...pwForm, current: e.target.value })} />
          <input className="account-input" type="password" placeholder="New password" value={pwForm.newPw}
            onChange={e => setPwForm({ ...pwForm, newPw: e.target.value })} />
          <input className="account-input" type="password" placeholder="Confirm new password" value={pwForm.confirm}
            onChange={e => setPwForm({ ...pwForm, confirm: e.target.value })} />
          {pwMsg && <p className={`pw-msg ${pwMsg.includes('updated') ? 'success' : 'error'}`}>{pwMsg}</p>}
          <button className="account-save-btn" onClick={changePassword}>Update Password</button>
        </div>

        <div className="account-section">
          <h3>Order History</h3>
          {!user?.orderHistory?.length ? (
            <p className="account-empty">No orders yet</p>
          ) : (
            user.orderHistory.slice().reverse().map((o, i) => (
              <div key={i} className="order-history-row">
                <div>
                  <p className="oh-date">{new Date(o.date).toLocaleDateString()}</p>
                  <p className="oh-items">{o.itemCount} item{o.itemCount > 1 ? 's' : ''}</p>
                </div>
                <div className="oh-right">
                  <p className="oh-total">${o.total}</p>
                  <p className="oh-stars">+{o.stars} stars</p>
                </div>
              </div>
            ))
          )}
        </div>

        <button className="signout-btn" onClick={onSignOut}>Sign Out</button>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════
export default function App() {
  const [screen, setScreen] = useState('login')
  const [user, setUser] = useState(null)
  const [cart, setCart] = useState([])
  const [favorites, setFavorites] = useState([])
  const [milkModal, setMilkModal] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('brew_user')
    if (saved) {
      const u = JSON.parse(saved)
      setUser(u)
      setFavorites(u.favorites || [])
      setScreen('home')
    }
  }, [])

  const saveUser = (u) => {
    const users = JSON.parse(localStorage.getItem('brew_users') || '[]')
    const updated = users.map(x => x.id === u.id ? u : x)
    localStorage.setItem('brew_users', JSON.stringify(updated))
    localStorage.setItem('brew_user', JSON.stringify(u))
    setUser(u)
  }

  const handleLogin = (u) => {
    setUser(u)
    setFavorites(u.favorites || [])
    setScreen('home')
  }

  const handleSignOut = () => {
    localStorage.removeItem('brew_user')
    setUser(null)
    setCart([])
    setFavorites([])
    setScreen('login')
  }

  const handleToggleFavorite = (productId) => {
    const newFavs = favorites.includes(productId)
      ? favorites.filter(id => id !== productId)
      : [...favorites, productId]
    setFavorites(newFavs)
    if (user) saveUser({ ...user, favorites: newFavs })
  }

  const handleAddToCart = (product) => {
    if (product.category === 'drink') {
      setMilkModal(product)
    } else {
      addToCart(product, null)
    }
  }

  const addToCart = (product, milkType) => {
    setCart(prev => {
      const key = `${product.id}-${milkType}`
      const existing = prev.find(i => `${i.id}-${i.milkType}` === key)
      if (existing) {
        return prev.map(i => `${i.id}-${i.milkType}` === key ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, { ...product, milkType, quantity: 1 }]
    })
    setMilkModal(null)
  }

  const handleUpdateQuantity = (item, delta) => {
    setCart(prev =>
      prev.map(i => `${i.id}-${i.milkType}` === `${item.id}-${item.milkType}`
        ? { ...i, quantity: i.quantity + delta }
        : i
      ).filter(i => i.quantity > 0)
    )
  }

  const handlePlaceOrder = (starsEarned, total, usedFreeReward = false) => {
    if (!user) return
    const orderEntry = {
      date: Date.now(),
      itemCount: cart.reduce((s, i) => s + i.quantity, 0),
      total: Math.round(total),
      stars: starsEarned,
    }
    const newStars = (user.stars || 0) + starsEarned
    const newFreeProducts = Math.floor(newStars / STARS_GOAL)
    const remainingStars = newStars % STARS_GOAL
    const rewardsEntry = {
      date: Date.now(),
      type: 'earned',
      stars: starsEarned,
      itemCount: cart.reduce((s, i) => s + i.quantity, 0),
    }
    saveUser({
      ...user,
      stars: remainingStars,
      freeProducts: Math.max(0, (user.freeProducts || 0) + newFreeProducts - (usedFreeReward ? 1 : 0)),
      orderHistory: [...(user.orderHistory || []), orderEntry],
      rewardsHistory: [...(user.rewardsHistory || []), rewardsEntry],
    })
    setCart([])
  }

  const handleRedeemCode = (code) => {
    saveUser({
      ...user,
      stars: (user.stars || 0) + 10,
      usedCodes: [...(user.usedCodes || []), code],
    })
  }

  const handleClaimFreeProduct = () => {
    if ((user.freeProducts || 0) > 0) {
      const rewardsEntry = { date: Date.now(), type: 'redeemed' }
      saveUser({
        ...user,
        freeProducts: user.freeProducts - 1,
        rewardsHistory: [...(user.rewardsHistory || []), rewardsEntry],
      })
    }
  }

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0)

  if (screen === 'login') return (
    <div className="app-shell">
      <LoginScreen onLogin={handleLogin} />
    </div>
  )

  return (
    <div className="app-shell">
      {screen === 'home' && (
        <HomeScreen user={user} favorites={favorites} cart={cart}
          onNavigate={setScreen} onToggleFavorite={handleToggleFavorite} onAddToCart={handleAddToCart} />
      )}
      {screen === 'products' && (
        <ProductsScreen favorites={favorites} cart={cart} cartCount={cartCount}
          onToggleFavorite={handleToggleFavorite} onAddToCart={handleAddToCart}
          onCartClick={() => setScreen('order')} />
      )}
      {screen === 'order' && (
        <OrderScreen cart={cart} onUpdateQuantity={handleUpdateQuantity} onPlaceOrder={handlePlaceOrder} user={user} />
      )}
      {screen === 'rewards' && (
        <RewardsScreen user={user} onNavigate={setScreen} />
      )}
      {screen === 'account' && (
        <AccountScreen user={user} onSignOut={handleSignOut} onUpdateUser={saveUser} />
      )}
      <BottomNav screen={screen} onNavigate={setScreen} cartCount={cartCount} />
      {milkModal && (
        <MilkModal product={milkModal} onClose={() => setMilkModal(null)} onAdd={addToCart} />
      )}
    </div>
  )
}
