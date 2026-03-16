class TextParticles {
  constructor() {
    this.canvas = document.querySelector('.js-text-canvas')
    if (!this.canvas) return
    
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.canvas.offsetWidth / this.canvas.offsetHeight,
      0.1,
      1000
    )
    this.camera.position.z = 5
    
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true
    })
    this.renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    
    this.colors = [0xff6b6b, 0x4ecdc4, 0xffe66d, 0xa8e6cf, 0xffd3b6]
    this.colorIndex = 0
    
    this.createParticles()
    this.addEvents()
    this.animate()
  }
  
  createParticles() {
    const count = 100
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    const offsets = new Float32Array(count)
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5
      
      offsets[i] = Math.random() * 10
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('offset', new THREE.BufferAttribute(offsets, 1))
    
    this.material = new THREE.PointsMaterial({
      color: this.colors[0],
      size: 0.08,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    })
    
    this.particleSystem = new THREE.Points(geometry, this.material)
    this.scene.add(this.particleSystem)
  }
  
  addEvents() {
    window.addEventListener('resize', () => {
      this.camera.aspect = this.canvas.offsetWidth / this.canvas.offsetHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight)
    })
  }
  
  animate() {
    requestAnimationFrame(() => this.animate())
    
    const t = performance.now() * 0.001
    
    // Rotate particle system
    this.particleSystem.rotation.y = t * 0.2
    this.particleSystem.rotation.x = t * 0.1
    this.slides = [...this.el.querySelectorAll('.js-slide')]
    this.bullets = [...this.el.querySelectorAll('.js-slider-bullet')]
    
    this.renderer = null
    this.scene = null
    this.clock = null
    this.camera = null
    
    // Unsplash API Access Key (demo key - replace with your own)
    this.unsplashAccessKey = 'fDSt2YZC6KNcsDMKXCeGkKaJlLOY-RnyvEah81YBpaI'
    
    this.images = []
    
    this.data = {
      current: 0,
      next: 1,
      total: 6, // Will be updated after images load
      delta: 0
    }
    
    this.state = {
      animating: false,
      text: false,
      initial: true
    }
    
    this.textures = null
    this.isTransitioning = false
    
    this.init()
  }
  
  async fetchRandomClothes() {
    try {
      // Fetch clothing images
      const clothingQuery = 'fashion clothing minimal'
      const clothingResponse = await fetch(
        `https://api.unsplash.com/search/photos?query=${clothingQuery}&per_page=14&orientation=portrait&client_id=${this.unsplashAccessKey}`
      )
      
      // Fetch background images (solid white/vanilla/black backgrounds only)
      const bgQueries = [
        'white wall background',
        'black wall background', 
        'beige wall background',
        'cream wall texture',
        'white studio background',
        'black studio background',
        'vanilla background texture'
      ]
      const randomBgQuery = bgQueries[Math.floor(Math.random() * bgQueries.length)]
      const bgResponse = await fetch(
        `https://api.unsplash.com/search/photos?query=${randomBgQuery}&per_page=7&color=white&client_id=${this.unsplashAccessKey}`
      )
      
      if (!clothingResponse.ok || !bgResponse.ok) {
        console.log('Using default images')
        return
      }
      
      const clothingData = await clothingResponse.json()
      const bgData = await bgResponse.json()
      
      if (clothingData.results && clothingData.results.length >= 14 && bgData.results && bgData.results.length >= 7) {
        // Get 7 background images (no clothing, just colors/textures)
        this.images = [
          bgData.results[0].urls.regular,
          bgData.results[1].urls.regular,
          bgData.results[2].urls.regular,
          bgData.results[3].urls.regular,
          bgData.results[4].urls.regular,
          bgData.results[5].urls.regular,
          bgData.results[6].urls.regular
        ]
        
        // Update data total
        this.data.total = this.images.length - 1
        
        // Get 14 clothing images for slides (foreground)
        const slideImages = clothingData.results.map(img => img.urls.regular)
        
        // Update slide images in DOM
        const slides = document.querySelectorAll('.js-slide')
        slides.forEach((slide, slideIndex) => {
          const images = slide.querySelectorAll('.js-slide__img img')
          images.forEach((img, imgIndex) => {
            const imageIndex = slideIndex * 2 + imgIndex
            if (slideImages[imageIndex]) {
              img.src = slideImages[imageIndex]
              img.onload = () => {
                slide.classList.add('loaded')
              }
            }
          })
        })
      } else {
        // Fallback to solid colors if API fails
        this.images = [
          'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1" height="1"%3E%3Crect fill="%23111" width="1" height="1"/%3E%3C/svg%3E',
          'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1" height="1"%3E%3Crect fill="%23222" width="1" height="1"/%3E%3C/svg%3E',
          'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1" height="1"%3E%3Crect fill="%23181818" width="1" height="1"/%3E%3C/svg%3E',
          'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1" height="1"%3E%3Crect fill="%23111" width="1" height="1"/%3E%3C/svg%3E',
          'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1" height="1"%3E%3Crect fill="%23222" width="1" height="1"/%3E%3C/svg%3E',
          'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1" height="1"%3E%3Crect fill="%23181818" width="1" height="1"/%3E%3C/svg%3E',
          'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1" height="1"%3E%3Crect fill="%23111" width="1" height="1"/%3E%3C/svg%3E'
        ]
        this.data.total = this.images.length - 1
      }
    } catch (error) {
      console.log('Error fetching images, using fallback:', error)
      // Fallback to solid colors
      this.images = [
        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1" height="1"%3E%3Crect fill="%23111" width="1" height="1"/%3E%3C/svg%3E',
        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1" height="1"%3E%3Crect fill="%23222" width="1" height="1"/%3E%3C/svg%3E',
        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1" height="1"%3E%3Crect fill="%23181818" width="1" height="1"/%3E%3C/svg%3E',
        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1" height="1"%3E%3Crect fill="%23111" width="1" height="1"/%3E%3C/svg%3E',
        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1" height="1"%3E%3Crect fill="%23222" width="1" height="1"/%3E%3C/svg%3E',
        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1" height="1"%3E%3Crect fill="%23181818" width="1" height="1"/%3E%3C/svg%3E',
        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1" height="1"%3E%3Crect fill="%23111" width="1" height="1"/%3E%3C/svg%3E'
      ]
      this.data.total = this.images.length - 1
    }
  }
  
  setStyles() {
    this.slides.forEach((slide, index) => {
      if (index === 0) return
      
      TweenMax.set(slide, { autoAlpha: 0 })
    })
    
    this.bullets.forEach((bullet, index) => {
      if (index === 0) return
      
      const txt = bullet.querySelector('.js-slider-bullet__text')
      const line = bullet.querySelector('.js-slider-bullet__line')
      
      TweenMax.set(txt, {
        alpha: 0.25
      })
      TweenMax.set(line, {
        scaleX: 0,
        transformOrigin: 'left'
      })
    })
  }
  
  cameraSetup() {
    this.camera = new THREE.OrthographicCamera(
      this.el.offsetWidth / -2,
      this.el.offsetWidth / 2,
      this.el.offsetHeight / 2,
      this.el.offsetHeight / -2,
      1,
      1000
    )

    this.camera.lookAt(this.scene.position)
    this.camera.position.z = 1
  }

  setup() {
    this.scene = new THREE.Scene()
    this.clock = new THREE.Clock(true)
    
    this.renderer = new THREE.WebGLRenderer({ alpha: true })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(this.el.offsetWidth, this.el.offsetHeight)
    
    this.inner.appendChild(this.renderer.domElement)
  }
  
  loadTextures() {
    const loader = new THREE.TextureLoader()
    loader.crossOrigin = ''
    
    this.textures = []
    let loadedCount = 0
    const totalImages = this.images.length
    
    this.images.forEach((image, index) => {
      const texture = loader.load(image + '?v=' + Date.now(), () => {
        loadedCount++
        
        // Only render when needed
        if (loadedCount === 1 || loadedCount === totalImages) {
          this.render()
        }
        
        // Update size after first image is loaded
        if (index === 0 && this.mat && texture.image) {
          this.mat.uniforms.size.value = [
            texture.image.naturalWidth,
            texture.image.naturalHeight
          ]
        }
      })
      
      texture.minFilter = THREE.LinearFilter
      texture.generateMipmaps = false

      this.textures.push(texture)
    })
    
    this.disp = loader.load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/58281/rock-_disp.png', () => this.render())
    this.disp.magFilter = this.disp.minFilter = THREE.LinearFilter
    this.disp.wrapS = this.disp.wrapT = THREE.RepeatWrapping
  }
  
  createMesh() {
    this.mat = new THREE.ShaderMaterial( {
      uniforms: {
        dispPower: { type: 'f', value: 0.0 },
        intensity: { type: 'f', value: 0.5 },
        res: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        size: { value: new THREE.Vector2(1, 1) },
        texture1: { type: 't', value: this.textures[0] },
        texture2: { type: 't', value: this.textures[1] },
        disp: { type: 't', value: this.disp }
      },
      transparent: true,
      vertexShader: this.vert,
      fragmentShader: this.frag
    })

    const geometry = new THREE.PlaneBufferGeometry(
      this.el.offsetWidth, 
      this.el.offsetHeight, 
      1
    )
    
    const mesh = new THREE.Mesh(geometry, this.mat)

    this.scene.add(mesh)    
  }
  
  transitionNext() {
    TweenMax.to(this.mat.uniforms.dispPower, 2.5, {
      value: 1,
      ease: Expo.easeInOut,
      onUpdate: () => this.render(),
      onComplete: () => {
        this.mat.uniforms.dispPower.value = 0.0
        this.changeTexture()
        this.render()
        this.state.animating = false
        this.isTransitioning = false
      }
    })
    
    const current = this.slides[this.data.current]
    const next = this.slides[this.data.next]
    
    const currentImages = current.querySelectorAll('.js-slide__img')
    const nextImages = next.querySelectorAll('.js-slide__img')
    
    const currentText = current.querySelectorAll('.js-slider__text-line div')
    const nextText = next.querySelectorAll('.js-slider__text-line div')
    
    const currentBullet = this.bullets[this.data.current]
    const nextBullet = this.bullets[this.data.next]
    
    const currentBulletTxt = currentBullet.querySelectorAll('.js-slider-bullet__text')
    const nextBulletTxt = nextBullet.querySelectorAll('.js-slider-bullet__text')
    
    const currentBulletLine = currentBullet.querySelectorAll('.js-slider-bullet__line')
    const nextBulletLine = nextBullet.querySelectorAll('.js-slider-bullet__line')
    
    const tl = new TimelineMax({ paused: true })
    
    if (this.state.initial) {
      TweenMax.to('.js-scroll', 1.5, {
        yPercent: 100,
        alpha: 0,
        ease: Power4.easeInOut
      })
      
      this.state.initial = false
    }
    
    tl
    .staggerFromTo(currentImages, 1.5, {
      yPercent: 0,
      scale: 1
    }, {
      yPercent: -185,
      scaleY: 1.5,
      ease: Expo.easeInOut
    }, 0.075)
    .to(currentBulletTxt, 1.5, {
      alpha: 0.25,
      ease: Linear.easeNone
    }, 0)
    .set(currentBulletLine, {
      transformOrigin: 'right'
    }, 0)
    .to(currentBulletLine, 1.5, {
      scaleX: 0,
      ease: Expo.easeInOut
    }, 0)
    
    if (currentText) {
      tl
      .fromTo(currentText, 2, {
        yPercent: 0
      }, {
        yPercent: -100,
        ease: Power4.easeInOut
      }, 0)  
    }
    
    tl
    .set(current, {
      autoAlpha: 0
    })
    .set(next, {
      autoAlpha: 1
    }, 1)
    
    if (nextText) {
      tl
      .fromTo(nextText, 2, {
        yPercent: 100
      }, {
        yPercent: 0,
        ease: Power4.easeOut
      }, 1.5)  
    }
    
    tl
    .staggerFromTo(nextImages, 1.5, {
      yPercent: 150,
      scaleY: 1.5
    }, {
      yPercent: 0,
      scaleY: 1,
      ease: Expo.easeInOut
    }, 0.075, 1)
    .to(nextBulletTxt, 1.5, {
      alpha: 1,
      ease: Linear.easeNone
    }, 1)
    .set(nextBulletLine, {
      transformOrigin: 'left'
    }, 1)
    .to(nextBulletLine, 1.5, {
      scaleX: 1,
      ease: Expo.easeInOut
    }, 1)
    
    tl.play()
  }
  
  prevSlide() {
    
  }
  
  nextSlide = (e) => {
    // Don't advance slide if modal is open or already transitioning
    const modal = document.getElementById('storyModal')
    if (modal && modal.classList.contains('active')) return
    if (this.state.animating || this.isTransitioning) return
    
    this.state.animating = true
    this.isTransitioning = true
    
    this.transitionNext()
    
    this.data.current = this.data.current === this.data.total ? 0 : this.data.current + 1
    this.data.next = this.data.current === this.data.total ? 0 : this.data.current + 1
  }
  
  changeTexture() {
    this.mat.uniforms.texture1.value = this.textures[this.data.current]
    this.mat.uniforms.texture2.value = this.textures[this.data.next]
  }
 
  listeners() {
    // Debounce wheel events to prevent spam
    const debouncedNextSlide = debounce(this.nextSlide, 100)
    window.addEventListener('wheel', debouncedNextSlide, { passive: true })
    
    // Add click events to bullets
    this.bullets.forEach((bullet, index) => {
      bullet.addEventListener('click', () => {
        if (this.state.animating || this.isTransitioning) return
        this.goToSlide(index)
      })
    })
  }
  
  goToSlide(targetIndex) {
    if (targetIndex === this.data.current) return
    
    this.state.animating = true
    this.isTransitioning = true
    
    this.data.next = targetIndex
    this.transitionNext()
    
    this.data.current = targetIndex
    this.data.next = this.data.current === this.data.total ? 0 : this.data.current + 1
  }
  
  destroy() {
    // Clean up WebGL resources
    if (this.mat) this.mat.dispose()
    if (this.renderer) this.renderer.dispose()
    this.textures.forEach(texture => texture.dispose())
    if (this.disp) this.disp.dispose()
  }
  
  render() {
    this.renderer.render(this.scene, this.camera)
  }
  
  async init() {
    this.setup()
    this.cameraSetup()
    
    // Fetch images first
    await this.fetchRandomClothes()
    
    this.loadTextures()
    this.createMesh()
    this.setStyles()
    this.render()
    this.listeners()
  }
}

// Toggle active link
const links = document.querySelectorAll('.js-nav a')

links.forEach(link => {
  link.addEventListener('click', (e) => {
    // Allow navigation to other pages
    if (link.getAttribute('href') && link.getAttribute('href') !== '#') {
      return // Let the link navigate normally
    }
    e.preventDefault()
    links.forEach(other => other.classList.remove('is-active'))
    link.classList.add('is-active')
  })
})

// Story Modal Functionality
const storyData = [
  {
    title: "Timeless Elegance",
    story: "Inspired by the fusion of classic tailoring and contemporary minimalism, this piece represents the perfect balance between tradition and modernity. Crafted with meticulous attention to detail, each stitch tells a story of dedication to the art of fashion.",
    material: "Premium Italian Cotton",
    inspiration: "Architectural Lines",
    collection: "Urban Minimalist 2025"
  },
  {
    title: "Modern Comfort",
    story: "Where luxury meets everyday wearability. This design embodies the philosophy that true style shouldn't compromise comfort. Born from the idea that fashion should empower, not restrict.",
    material: "Sustainable Bamboo Blend",
    inspiration: "Natural Movement",
    collection: "Conscious Living 2025"
  },
  {
    title: "Bold Statements",
    story: "For those who refuse to blend in. This piece challenges conventional fashion norms, pushing boundaries while maintaining sophistication. It's not just clothing—it's a declaration of individuality.",
    material: "Technical Performance Fabric",
    inspiration: "Urban Warriors",
    collection: "Fearless Edition 2025"
  },
  {
    title: "Crafted Excellence",
    story: "Every detail matters. From the initial sketch to the final stitch, this garment represents hundreds of hours of craftsmanship. A testament to the belief that true luxury lies in quality, not quantity.",
    material: "Japanese Selvedge Denim",
    inspiration: "Artisan Heritage",
    collection: "Master Craft 2025"
  },
  {
    title: "Minimalist Impact",
    story: "Less is more, but better. This design strips away the unnecessary to reveal pure form and function. Clean lines meet thoughtful construction in a piece that speaks volumes through simplicity.",
    material: "Merino Wool Blend",
    inspiration: "Scandinavian Design",
    collection: "Essential Forms 2025"
  },
  {
    title: "Eternal Threads",
    story: "Fashion fades, style is eternal. This timeless piece transcends seasonal trends, designed to become a cherished part of your wardrobe for years to come. Classic, versatile, unforgettable.",
    material: "Cashmere & Silk",
    inspiration: "Timeless Icons",
    collection: "Heritage Line 2025"
  },
  {
    title: "Redefined Classics",
    story: "Taking the familiar and making it extraordinary. Traditional silhouettes reimagined through a contemporary lens, proving that respect for the past and vision for the future can coexist beautifully.",
    material: "Organic Linen",
    inspiration: "Renaissance Revival",
    collection: "Neo Classic 2025"
  },
  {
    title: "Luxury Details",
    story: "True luxury reveals itself in the details invisible to the casual observer. Hand-finished seams, precisely placed pockets, and thoughtful proportions make this piece a masterclass in refined elegance.",
    material: "Egyptian Cotton Poplin",
    inspiration: "Refined Opulence",
    collection: "Haute Essentials 2025"
  },
  {
    title: "Urban Sophistication",
    story: "The city is your runway. Designed for the modern urbanite who demands both style and functionality, this piece transitions effortlessly from boardroom to after-hours, always impeccable.",
    material: "Technical Wool",
    inspiration: "Metropolitan Life",
    collection: "City Refined 2025"
  },
  {
    title: "Speaking Volumes",
    story: "Style that needs no introduction. This bold yet elegant piece makes an unmistakable statement, reflecting the confidence and character of those who wear it. Fashion as a language, speaking fluently.",
    material: "Italian Viscose",
    inspiration: "Power Dressing",
    collection: "Statement Makers 2025"
  },
  {
    title: "Woven Confidence",
    story: "Confidence isn't worn, it's embodied. This garment is engineered to make you feel unstoppable, combining expert fit with premium materials that move with you, empowering every step.",
    material: "Stretch Performance Blend",
    inspiration: "Inner Strength",
    collection: "Empowered 2025"
  },
  {
    title: "Fashion Forward",
    story: "The future of fashion starts here. Innovative construction techniques meet sustainable practices in a piece that looks ahead while honoring craftsmanship traditions. Tomorrow's classic, today.",
    material: "Recycled Tech Fabric",
    inspiration: "Future Vision",
    collection: "Next Gen 2025"
  },
  {
    title: "Traditional Innovation",
    story: "Where heritage meets tomorrow. Ancient textile techniques are reimagined through modern technology, creating something entirely new yet deeply rooted in tradition. The best of both worlds.",
    material: "Heritage Tweed Blend",
    inspiration: "Cultural Fusion",
    collection: "Evolution Series 2025"
  },
  {
    title: "Your Story",
    story: "This is more than fashion—it's a canvas for your personal narrative. Each time you wear this piece, you add to its story, creating memories and moments that make it uniquely yours.",
    material: "Premium Cotton Jersey",
    inspiration: "Personal Journey",
    collection: "Individual Stories 2025"
  }
]

const modal = document.getElementById('storyModal')
const closeModal = document.getElementById('closeModal')
const modalImage = document.getElementById('modalImage')
const modalTitle = document.getElementById('modalTitle')
const modalStory = document.getElementById('modalStory')
const modalMaterial = document.getElementById('modalMaterial')
const modalInspiration = document.getElementById('modalInspiration')
const modalCollection = document.getElementById('modalCollection')

// Add click event to all images
document.querySelectorAll('.js-slide__img').forEach((img, index) => {
  img.addEventListener('click', () => {
    const imgSrc = img.querySelector('img').src
    const data = storyData[index % storyData.length]
    
    modalImage.src = imgSrc
    modalTitle.textContent = data.title
    modalStory.textContent = data.story
    modalMaterial.textContent = data.material
    modalInspiration.textContent = data.inspiration
    modalCollection.textContent = data.collection
    
    modal.classList.add('active')
    document.body.style.overflow = 'hidden'
  })
})

// Prevent wheel events from propagating when modal is open
modal.addEventListener('wheel', (e) => {
  e.stopPropagation()
}, { passive: true })

// Close modal
closeModal.addEventListener('click', () => {
  modal.classList.remove('active')
  document.body.style.overflow = ''
})

modal.querySelector('.story-modal__overlay').addEventListener('click', () => {
  modal.classList.remove('active')
  document.body.style.overflow = ''
})

// Init classes
// const slider = new Slider() // Disabled due to missing definition

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