class Collection {
  constructor(type, gridId) {
    this.type = type // 'mens' or 'womens'
    this.gridElement = document.getElementById(gridId)
    this.unsplashAccessKey = 'fDSt2YZC6KNcsDMKXCeGkKaJlLOY-RnyvEah81YBpaI'
    this.products = []
    this.currentSlide = 0
    
    this.init()
  }
  
  async init() {
    this.showLoading()
    await this.fetchProducts()
    this.renderProducts()
    this.setupNavigation()
    this.addScrollListener()
  }
  
  showLoading() {
    this.gridElement.innerHTML = '<div class="loading">Loading collection...</div>'
  }
  
  async fetchProducts() {
    try {
      // Fetch specific clothing item images
      const queries = this.type === 'mens' 
        ? ['blazer men', 'denim jacket', 'overcoat men', 'dress shirt', 'chinos pants', 'leather jacket',
           'sweater men', 'hoodie men', 'suit men', 'jacket men', 'parka men', 't-shirt men']
        : ['dress women', 'blouse women', 'coat women', 'blazer women', 'trousers women', 'evening dress',
           'jumpsuit women', 'turtleneck women', 'trench coat', 'cardigan women', 'skirt women', 'camisole women']
      
      const imagePromises = queries.map(query => 
        fetch(`https://api.unsplash.com/search/photos?query=${query}&per_page=1&orientation=portrait&client_id=${this.unsplashAccessKey}`)
          .then(res => res.json())
          .then(data => data.results[0])
      )
      
      const images = await Promise.all(imagePromises)
      
      // Create product objects from images
      this.products = images.map((img, index) => ({
        id: index + 1,
        name: this.generateProductName(index),
        description: this.generateDescription(),
        price: this.generatePrice(),
        image: img?.urls?.regular || 'https://via.placeholder.com/400x600?text=No+Image',
        photographer: img?.user?.name || 'Unknown'
      }))
      
    } catch (error) {
      console.error('Error fetching products:', error)
      this.gridElement.innerHTML = '<div class="loading">Error loading products. Please refresh.</div>'
    }
  }
  
  generateProductName(index) {
    const mensNames = [
      'Tailored Wool Blazer', 'Raw Denim Jacket', 'Cashmere Overcoat', 
      'Oxford Button-Down Shirt', 'Slim Fit Chinos', 'Biker Leather Jacket',
      'Merino Wool Sweater', 'Tech Fleece Hoodie', 'Two-Piece Suit',
      'Windbreaker Jacket', 'Down Puffer Parka', 'Premium Cotton Tee'
    ]
    
    const womensNames = [
      'Midi Wrap Dress', 'Silk Button-Up Blouse', 'Wool Peacoat',
      'Structured Blazer', 'High-Waist Trousers', 'Maxi Evening Dress',
      'Linen Jumpsuit', 'Cashmere Turtleneck', 'Oversized Trench Coat',
      'Ribbed Knit Cardigan', 'Pleated Midi Skirt', 'Satin Camisole'
    ]
    
    const names = this.type === 'mens' ? mensNames : womensNames
    return names[index % names.length]
  }
  
  generateDescription() {
    const descriptions = [
      'Premium quality fabric with timeless design. Crafted for the modern individual.',
      'Exceptional comfort meets contemporary style. A wardrobe essential.',
      'Modern fit with classic appeal. Perfect for any occasion.',
      'Versatile piece designed for everyday elegance and sophistication.',
      'Luxurious materials and expert tailoring. Statement piece for your collection.',
      'Contemporary design meets traditional craftsmanship. Uniquely refined.'
    ]
    
    return descriptions[Math.floor(Math.random() * descriptions.length)]
  }
  
  generatePrice() {
    const prices = [89, 129, 149, 179, 199, 249, 299, 349]
    return prices[Math.floor(Math.random() * prices.length)]
  }
  
  renderProducts() {
    this.gridElement.innerHTML = `
      <div class="product-slider">
        ${this.products.map((product, index) => `
          <div class="product-slide ${index === 0 ? 'active' : ''}" data-index="${index}">
            <div class="product-card">
              <div class="product-image-wrapper">
                <img src="${product.image}" alt="${product.name}" class="product-image">
              </div>
              <div class="product-details">
                <h2 class="product-name">${product.name}</h2>
                <p class="product-description">${product.description}</p>
                <span class="product-price">$${product.price}</span>
                <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="product-nav">
        ${this.products.map((_, index) => `
          <div class="product-bullet ${index === 0 ? 'active' : ''}" data-index="${index}">
            <span class="product-bullet__text">${String(index + 1).padStart(2, '0')}</span>
            <span class="product-bullet__line"></span>
          </div>
        `).join('')}
      </div>
      <div class="scroll-hint">Scroll to browse</div>
    `
  }
  
  setupNavigation() {
    const bullets = document.querySelectorAll('.product-bullet')
    bullets.forEach(bullet => {
      bullet.addEventListener('click', () => {
        const index = parseInt(bullet.dataset.index)
        this.goToSlide(index)
      })
    })
  }
  
  addScrollListener() {
    let isScrolling = false
    
    window.addEventListener('wheel', (e) => {
      if (isScrolling) return
      
      if (e.deltaY > 0) {
        this.nextSlide()
      } else {
        this.prevSlide()
      }
      
      isScrolling = true
      setTimeout(() => { isScrolling = false }, 800)
    }, { passive: true })
  }
  
  goToSlide(index) {
    if (index < 0 || index >= this.products.length) return
    
    const slides = document.querySelectorAll('.product-slide')
    const bullets = document.querySelectorAll('.product-bullet')
    
    slides.forEach(slide => slide.classList.remove('active'))
    bullets.forEach(bullet => bullet.classList.remove('active'))
    
    slides[index].classList.add('active')
    bullets[index].classList.add('active')
    
    this.currentSlide = index
  }
  
  nextSlide() {
    const nextIndex = (this.currentSlide + 1) % this.products.length
    this.goToSlide(nextIndex)
  }
  
  prevSlide() {
    const prevIndex = (this.currentSlide - 1 + this.products.length) % this.products.length
    this.goToSlide(prevIndex)
  }
}

function addToCart(productId) {
  const cartTotal = document.querySelector('.cart-total')
  const currentCount = parseInt(cartTotal.textContent)
  cartTotal.textContent = currentCount + 1
  
  // Animate cart
  TweenMax.fromTo(cartTotal, 0.3, {
    scale: 1
  }, {
    scale: 1.5,
    ease: Back.easeOut,
    onComplete: () => {
      TweenMax.to(cartTotal, 0.2, { scale: 1 })
    }
  })
  
  console.log(`Added product ${productId} to cart`)
}

// Toggle active link
const links = document.querySelectorAll('.js-nav a')

links.forEach(link => {
  link.addEventListener('click', (e) => {
    if (link.getAttribute('href').startsWith('http')) return
    links.forEach(other => other.classList.remove('is-active'))
    link.classList.add('is-active')
  })
})

// Page Transition Handler
window.addEventListener('load', () => {
  setTimeout(() => {
    document.body.classList.add('page-ready')
  }, 100)
})

document.addEventListener('DOMContentLoaded', () => {
  // Handle all navigation links
  const navLinks = document.querySelectorAll('.nav a')
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href')
      if (href && href !== '#' && !href.startsWith('http')) {
        e.preventDefault()
        
        const transition = document.querySelector('.page-transition')
        transition.classList.add('active')
        
        setTimeout(() => {
          window.location.href = href
        }, 400)
      }
    })
  })
})
