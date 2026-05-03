import { useState, useEffect } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const categoryEmoji = (name = '') => {
  const n = name.toLowerCase()
  if (n.includes('latte')) return '🥛'
  if (n.includes('espresso')) return '⚡'
  if (n.includes('cappuccino')) return '☕'
  if (n.includes('tea')) return '🍵'
  if (n.includes('matcha')) return '🍵'
  if (n.includes('cold') || n.includes('ice')) return '🧊'
  return '☕'
}

function MenuCard({ item }) {
  return (
    <div className="menu-card">
      <div className="menu-card-image">
        <span className="menu-card-emoji">{categoryEmoji(item.name)}</span>
      </div>
      <div className="menu-card-info">
        <h3>{item.name?.toUpperCase()}</h3>
        {item.description && <p className="menu-card-desc">{item.description}</p>}
        <p className="menu-card-price">${Number(item.price).toFixed(2)}</p>
      </div>
    </div>
  )
}

function App() {
  const [menu, setMenu] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`${API_URL}/menu`)
      .then(res => {
        if (!res.ok) throw new Error('Network error')
        return res.json()
      })
      .then(data => {
        setMenu(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => {
        setError('Could not connect to the server.')
        setLoading(false)
      })
  }, [])

  return (
    <div className="app">

      {/* ── Navbar ── */}
      <nav className="navbar">
        <div className="nav-links">
          <a href="#">Shop</a>
          <a href="#">About Us</a>
          <a href="#">Blog</a>
        </div>
        <div className="nav-logo">Brew &amp; Co.</div>
        <div className="nav-right">
          <a href="#">Favorites</a>
          <a href="#">Cart (0)</a>
          <a href="#">Account</a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-text">
          <p className="hero-sub">
            Discover our handcrafted blends, designed to elevate your coffee experience.
          </p>
          <button className="hero-btn">ALL PRODUCTS</button>
          <h1>THIS IS MORE THAN<br />A COFFEE SPACE;<br />IT'S AN EXPERIENCE</h1>
        </div>
        <div className="hero-visual">
          <img src="/hero.jpg" alt="Brew & Co. signature drinks" className="hero-img" />
        </div>
      </section>

      {/* ── Ticker ── */}
      <div className="ticker">
        <span>
          With Premium Flavor &nbsp;──&nbsp; Chic Coffee Vibes &nbsp;──&nbsp;
          With Premium Flavor &nbsp;──&nbsp; Chic Coffee Vibes &nbsp;──&nbsp;
          With Premium Flavor &nbsp;──&nbsp; Chic Coffee Vibes &nbsp;──&nbsp;
          With Premium Flavor &nbsp;──&nbsp; Chic Coffee Vibes
        </span>
      </div>

      {/* ── Menu ── */}
      <section className="menu-section">
        <h2>Our Menu</h2>

        {loading && <p className="status-msg">Loading menu…</p>}

        {error && (
          <div className="error-box">
            <p>⚠️ {error}</p>
            <p className="error-hint">Make sure the backend is running at <code>{API_URL}</code></p>
          </div>
        )}

        {!loading && !error && menu.length === 0 && (
          <p className="status-msg">No items found.</p>
        )}

        <div className="menu-grid">
          {menu.map((item, i) => (
            <MenuCard key={item.id ?? i} item={item} />
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="cta-banner">
        <div className="cta-left">
          <p>Place your coffee order today and anticipate its arrival tomorrow.</p>
          <button className="cta-btn">ORDER</button>
        </div>
        <div className="cta-right">
          <h2>PURCHASE TODAY,<br />RECEIVE TOMORROW</h2>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-col">
          <h4>MENU</h4>
          <a href="#">Shop</a>
          <a href="#">Sale</a>
          <a href="#">Collab</a>
        </div>
        <div className="footer-col">
          <h4>INFO</h4>
          <a href="#">About Us</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Contact</a>
        </div>
        <div className="footer-col">
          <h4>GET PROMOTIONS FROM US</h4>
          <div className="footer-email">
            <input type="email" placeholder="Your Email" />
            <button>SIGN ME UP</button>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Brew &amp; Co.</p>
        </div>
      </footer>

    </div>
  )
}

export default App