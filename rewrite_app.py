import re

with open('frontend/src/App.jsx', 'r') as f:
    content = f.read()

# 1. Replace data definition with constants
data_regex = r"// ── Data ───────────────────────────────────────────────────.*?(?=// ── SVG Icons ──────────────────────────────────────────────)"
new_data = """// ── Constants ──────────────────────────────────────────────
const DRINK_VISUALS = {
  'Star Latte': { gradient: 'linear-gradient(135deg,#8a6040,#c4956a)', img: 'star-latte.jpg' },
  'Cappuccino': { gradient: 'linear-gradient(135deg,#6b4c35,#a07850)', img: 'cappuccino.jpg' },
  'Cold Brew': { gradient: 'linear-gradient(135deg,#1c2a3a,#2e4560)', img: 'cold-brew.jpg' },
  'Iced Matcha': { gradient: 'linear-gradient(135deg,#6b8e5e,#9cb887)', img: 'iced-matcha.jpg' },
}
const MUG_VISUALS = {
  'Purple Flower Mug': { gradient: 'linear-gradient(135deg,#7b6da0,#a090c4)', img: 'mug-purple.jpg' },
  'Blue Star Mug': { gradient: 'linear-gradient(135deg,#5a7aab,#7a9acb)', img: 'mug-blue.jpg' },
  'Pink Lily Mug': { gradient: 'linear-gradient(135deg,#c48090,#d8a0b0)', img: 'mug-pink.jpg' },
  'Tulip Mug': { gradient: 'linear-gradient(135deg,#c8906a,#e0b090)', img: 'mug-tulip.jpg' },
}
const FOOD_VISUALS = {
  'Cinnamon Roll': { gradient: 'linear-gradient(135deg,#b87840,#d49860)', img: 'cinnamon-roll.jpg' },
  'Choco Chip Muffin': { gradient: 'linear-gradient(135deg,#7a5030,#9a7050)', img: 'choco-muffin.jpg' },
  'Choco Chunk Cookies': { gradient: 'linear-gradient(135deg,#9a7845,#c8a06a)', img: 'cookies.jpg' },
  'Salmon Avocado Toast': { gradient: 'linear-gradient(135deg,#c87060,#e09080)', img: 'salmon-toast.jpg' },
}

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function mergeVisuals(items, lookup, category, idOffset) {
  return items.map(item => ({
    ...item,
    id: item.id + idOffset, // generate unique id
    category,
    desc: item.description || '',
    ...(lookup[item.name] || { gradient: 'linear-gradient(135deg,#8a6040,#c4956a)', img: '' }),
  }))
}

"""
content = re.sub(data_regex, new_data, content, flags=re.DOTALL)

# 2. Add props to HomeScreen
home_regex = r"function HomeScreen\(\{ user, favorites, cart, onNavigate, onToggleFavorite, onAddToCart \}\) \{"
home_new = "function HomeScreen({ user, favorites, cart, onNavigate, onToggleFavorite, onAddToCart, drinks, allProducts }) {"
content = content.replace(home_regex.replace('\\', ''), home_new)

# 3. Add props to ProductsScreen
prod_regex = r"function ProductsScreen\(\{ favorites, cart, onToggleFavorite, onAddToCart, cartCount, onCartClick \}\) \{"
prod_new = "function ProductsScreen({ favorites, cart, onToggleFavorite, onAddToCart, cartCount, onCartClick, drinks, mugs, foods }) {"
content = content.replace(prod_regex.replace('\\', ''), prod_new)

# 4. Modify App component to fetch data and use backend endpoints
app_regex = r"export default function App\(\) \{.*?(?=  return \()"

app_new = """export default function App() {
  const [screen, setScreen] = useState('login')
  const [user, setUser] = useState(null)
  const [cart, setCart] = useState([])
  const [favorites, setFavorites] = useState([])
  const [milkModal, setMilkModal] = useState(null)
  
  const [rawDrinks, setRawDrinks] = useState([])
  const [rawMugs, setRawMugs] = useState([])
  const [rawFoods, setRawFoods] = useState([])

  useEffect(() => {
    fetch(`${API}/drinks`).then(r => r.json()).then(setRawDrinks)
    fetch(`${API}/mugs`).then(r => r.json()).then(setRawMugs)
    fetch(`${API}/foods`).then(r => r.json()).then(setRawFoods)
    
    const saved = localStorage.getItem('brew_user')
    if (saved) {
      const u = JSON.parse(saved)
      fetch(`${API}/user/${u._id || u.id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({}) // just to get latest
      }).then(r => r.json()).then(latest => {
        if(latest && !latest.error) {
           setUser(latest)
           setFavorites(latest.favorites || [])
        } else {
           setUser(u)
           setFavorites(u.favorites || [])
        }
      }).catch(() => {
        setUser(u)
        setFavorites(u.favorites || [])
      })
      setScreen('home')
    }
  }, [])

  const drinks = mergeVisuals(rawDrinks, DRINK_VISUALS, 'drink', 0)
  const mugs = mergeVisuals(rawMugs, MUG_VISUALS, 'mug', 4)
  const foods = mergeVisuals(rawFoods, FOOD_VISUALS, 'food', 8)
  const allProducts = [...drinks, ...mugs, ...foods]

  const saveUser = (u) => {
    localStorage.setItem('brew_user', JSON.stringify(u))
    setUser(u)
    if(u._id) {
       fetch(`${API}/user/${u._id}`, {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(u)
       })
    }
  }

  const handleLogin = async (u) => {
    if(!u._id) {
       // it was a local register, try to register on backend
       try {
         const r = await fetch(`${API}/register`, {
           method: 'POST',
           headers: {'Content-Type': 'application/json'},
           body: JSON.stringify({name: u.name, email: u.email, password: u.password})
         })
         const backendUser = await r.json()
         if(!backendUser.error) u = backendUser
       } catch(e) {}
    } else {
      // Login flow should happen in LoginScreen really, but this is a fallback
    }
    localStorage.setItem('brew_user', JSON.stringify(u))
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
    const newStars = (user.stars || 0) + starsEarned
    const newFreeProducts = Math.floor(newStars / STARS_GOAL)
    const remainingStars = newStars % STARS_GOAL
    
    // Save order to backend
    if(user._id) {
       fetch(`${API}/orders`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
             userId: user._id,
             itemCount: cart.reduce((s, i) => s + i.quantity, 0),
             total: Math.round(total),
             stars: starsEarned
          })
       })
    }

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
      rewardsHistory: [...(user.rewardsHistory || []), rewardsEntry],
    })
    setCart([])
  }

"""

content = re.sub(app_regex, app_new, content, flags=re.DOTALL)

# Modify LoginScreen to use backend
login_regex = r"const handleSubmit = \(\) => \{.*?(?=  return \()"
login_new = """const handleSubmit = async () => {
    if (!form.email || !form.password) { setError('Please fill in all fields'); return }
    if (tab === 'register') {
      if (!form.name) { setError('Name is required'); return }
      try {
        const r = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/register`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({name: form.name, email: form.email, password: form.password})
        })
        const user = await r.json()
        if(user.error) throw new Error(user.error)
        onLogin(user)
      } catch(e) { setError(e.message) }
    } else {
      try {
        const r = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/login`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({email: form.email, password: form.password})
        })
        const user = await r.json()
        if(user.error) throw new Error(user.error)
        onLogin(user)
      } catch(e) { setError(e.message) }
    }
  }
"""

content = re.sub(login_regex, login_new, content, flags=re.DOTALL)

# Render changes to App return
app_ret_regex = r"    <div className=\"app-shell\">\n      \{screen === 'home' && \(\n        <HomeScreen user=\{user\} favorites=\{favorites\} cart=\{cart\}\n          onNavigate=\{setScreen\} onToggleFavorite=\{handleToggleFavorite\} onAddToCart=\{handleAddToCart\} />\n      \)\}\n      \{screen === 'products' && \(\n        <ProductsScreen favorites=\{favorites\} cart=\{cart\} cartCount=\{cartCount\}\n          onToggleFavorite=\{handleToggleFavorite\} onAddToCart=\{handleAddToCart\}\n          onCartClick=\{\(\) => setScreen\('order'\)\} />\n      \)\}"
app_ret_new = """    <div className="app-shell">
      {screen === 'home' && (
        <HomeScreen user={user} favorites={favorites} cart={cart} drinks={drinks} allProducts={allProducts}
          onNavigate={setScreen} onToggleFavorite={handleToggleFavorite} onAddToCart={handleAddToCart} />
      )}
      {screen === 'products' && (
        <ProductsScreen favorites={favorites} cart={cart} cartCount={cartCount} drinks={drinks} mugs={mugs} foods={foods}
          onToggleFavorite={handleToggleFavorite} onAddToCart={handleAddToCart}
          onCartClick={() => setScreen('order')} />
      )}"""
content = content.replace(app_ret_regex.replace('\\', ''), app_ret_new)

with open('frontend/src/App.jsx', 'w') as f:
    f.write(content)

