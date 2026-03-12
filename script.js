 let searchBtn = document.querySelector('#search-btn');
let searchBar = document.querySelector('.search-bar-container');
let formBtn = document.querySelector('#login-btn');
let loginForm = document.querySelector('.login-form-container');
let formClose = document.querySelector('#form-close');
let menu = document.querySelector('#menu-bar');
let navbar = document.querySelector('.navbar');
let navLinks = document.querySelectorAll('header .navbar a');
let themeToggle = document.querySelector('#theme-toggle');
let contactForm = document.querySelector('#contact-form');
let videoPrev = document.querySelector('#video-prev');
let videoNext = document.querySelector('#video-next');

// Enhanced form functionality
let loginFormElement = document.querySelector('#login-form');
let signupFormElement = document.querySelector('#signup-form');
let showSignupBtn = document.querySelector('#show-signup');
let showLoginBtn = document.querySelector('#show-login');

// Service filtering
let categoryBtns = document.querySelectorAll('.category-btn');
let serviceBoxes = document.querySelectorAll('.services .box-container .box');

// Gallery functionality
let galleryCategoryBtns = document.querySelectorAll('.gallery-categories .category-btn');
let galleryBoxes = document.querySelectorAll('.gallery .box-container .box');


// Gallery filtering functionality
if(galleryCategoryBtns.length > 0) {
    galleryCategoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            galleryCategoryBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            const category = btn.getAttribute('data-category');
            
            // Filter gallery items
            galleryBoxes.forEach(box => {
                if (category === 'all' || box.getAttribute('data-category') === category) {
                    box.style.display = 'block';
                    box.style.animation = 'fadeInUp 0.6s ease forwards';
                } else {
                    box.style.display = 'none';
                }
            });
        });
    });
}

// Lightbox functionality
let lightboxModal = document.getElementById('lightbox-modal');
let lightboxImg = document.getElementById('lightbox-img');
let lightboxCaption = document.getElementById('lightbox-caption');
let closeLightbox = document.querySelector('.close-lightbox');
let lightboxPrev = document.getElementById('lightbox-prev');
let lightboxNext = document.getElementById('lightbox-next');

let currentImageIndex = 0;
let galleryImages = [];

// Initialize lightbox
function initLightbox() {
    if (!lightboxModal) return;
    
    // Get all gallery images
    const galleryImgElements = document.querySelectorAll('.gallery-img');
    galleryImages = Array.from(galleryImgElements);
    
    // Add click event to gallery images
    galleryImages.forEach((img, index) => {
        img.addEventListener('click', () => {
            openLightbox(index);
        });
    });
    
    // Close lightbox events
    if (closeLightbox) {
        closeLightbox.addEventListener('click', closeLightboxModal);
    }
    
    // Close on background click
    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) {
            closeLightboxModal();
        }
    });
    
    // Navigation events
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', () => navigateImage(-1));
    }
    if (lightboxNext) {
        lightboxNext.addEventListener('click', () => navigateImage(1));
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightboxModal.style.display === 'block') {
            switch(e.key) {
                case 'Escape':
                    closeLightboxModal();
                    break;
                case 'ArrowLeft':
                    navigateImage(-1);
                    break;
                case 'ArrowRight':
                    navigateImage(1);
                    break;
            }
        }
    });
}

function openLightbox(index) {
    currentImageIndex = index;
    const img = galleryImages[index];
    const box = img.closest('.box');
    const title = box.querySelector('h3').textContent;
    const description = box.querySelector('p').textContent;
    
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = `${title} - ${description}`;
    
    lightboxModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeLightboxModal() {
    lightboxModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function navigateImage(direction) {
    currentImageIndex = (currentImageIndex + direction + galleryImages.length) % galleryImages.length;
    openLightbox(currentImageIndex);
}

// Gallery search functionality
let gallerySearchInput = document.getElementById('gallery-search');

if(gallerySearchInput) {
    gallerySearchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        galleryBoxes.forEach(box => {
            const title = box.querySelector('h3').textContent.toLowerCase();
            const description = box.querySelector('p').textContent.toLowerCase();
            
            const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
            
            if (searchTerm === '' || matchesSearch) {
                box.style.display = 'block';
                box.style.animation = 'fadeInUp 0.6s ease forwards';
            } else {
                box.style.display = 'none';
            }
        });
        
        // Update category buttons to show "All" as active when searching
        if (searchTerm !== '') {
            galleryCategoryBtns.forEach(btn => btn.classList.remove('active'));
            const allBtn = document.querySelector('.category-btn[data-category="all"]');
            if (allBtn) allBtn.classList.add('active');
        }
    });
}

window.onscroll = () =>{
    searchBtn.classList.remove('fa-times');
    searchBar.classList.remove('active');
    menu.classList.remove('fa-times');
    navbar.classList.remove('active');
    loginForm.classList.remove('active');

}

menu.addEventListener('click', () =>{
    menu.classList.toggle('fa-times');
    navbar.classList.toggle('active');
});

searchBtn.addEventListener('click', () =>{
    searchBtn.classList.toggle('fa-times');
    searchBar.classList.toggle('active');
});

formBtn.addEventListener('click', () =>{
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
        // User is logged in, show logout dropdown
        toggleLogoutDropdown();
    } else {
        // User is not logged in, show login form
        loginForm.classList.add('active');
    }
});

formClose.addEventListener('click', () =>{
    loginForm.classList.remove('active');
});

// Form switching functionality
if(showSignupBtn) {
    showSignupBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginFormElement.classList.remove('active');
        signupFormElement.classList.add('active');
    });
}

if(showLoginBtn) {
    showLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        signupFormElement.classList.remove('active');
        loginFormElement.classList.add('active');
    });
}

// Amazon-Style Shopping Cart Functionality
let cart = [];
let cartOpen = false;

// Initialize cart from localStorage
function initCart() {
    const savedCart = localStorage.getItem('travelCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

// Add item to cart
function addToCart(packageName, price) {
    const existingItem = cart.find(item => item.name === packageName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: Date.now(),
            name: packageName,
            price: price,
            quantity: 1,
            image: getRandomPackageImage()
        });
    }
    
    saveCart();
    updateCartUI();
    showNotification(`${packageName} added to cart!`, 'success');
    
    // Open cart sidebar
    if (!cartOpen) {
        toggleCart();
    }
}

// Buy Now function
function buyNow(packageName, price) {
    // Clear cart and add this item
    cart = [{
        id: Date.now(),
        name: packageName,
        price: price,
        quantity: 1,
        image: getRandomPackageImage()
    }];
    
    saveCart();
    updateCartUI();
    showNotification(`${packageName} ready for checkout!`, 'success');
    
    // Open cart and proceed to checkout
    if (!cartOpen) {
        toggleCart();
    }
    
    setTimeout(() => {
        checkout();
    }, 1000);
}

// Get random package image
function getRandomPackageImage() {
    const images = [
        'download (2).jpeg',
        'download.jpeg', 
        'download (3).jpeg',
        'download (6).jpeg'
    ];
    return images[Math.floor(Math.random() * images.length)];
}

// Toggle cart sidebar
function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    cartOpen = !cartOpen;
    
    if (cartOpen) {
        cartSidebar.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        cartSidebar.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Update cart UI
function updateCartUI() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartCount.textContent = '0';
        cartTotal.textContent = 'Rs 0';
        return;
    }
    
    let total = 0;
    let itemCount = 0;
    
    cartItems.innerHTML = cart.map(item => {
        total += item.price * item.quantity;
        itemCount += item.quantity;
        
        return `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">Rs ${item.price}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                        <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    cartCount.textContent = itemCount;
    cartTotal.textContent = `Rs ${total}`;
}

// Update item quantity
function updateQuantity(itemId, change) {
    const item = cart.find(item => item.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(itemId);
        } else {
            saveCart();
            updateCartUI();
        }
    }
}

// Remove item from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    updateCartUI();
    showNotification('Item removed from cart', 'info');
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('travelCart', JSON.stringify(cart));
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Create checkout summary
    const orderSummary = {
        items: cart,
        total: total,
        itemCount: itemCount,
        timestamp: new Date().toISOString()
    };
    
    // Save order to localStorage (in real app, this would go to backend)
    localStorage.setItem('lastOrder', JSON.stringify(orderSummary));
    
    // Show success message
    showNotification(`Order placed successfully! Total: Rs ${total}`, 'success');
    
    // Clear cart
    cart = [];
    saveCart();
    updateCartUI();
    
    // Close cart
    toggleCart();
    
    // Redirect to contact page for booking confirmation
    setTimeout(() => {
        window.location.href = 'contact.html';
    }, 1500);
}

// Close cart when clicking outside
document.addEventListener('click', (e) => {
    const cartSidebar = document.getElementById('cart-sidebar');
    const floatingCartBtn = document.getElementById('floating-cart-btn');
    
    if (cartOpen && 
        !cartSidebar.contains(e.target) && 
        !floatingCartBtn.contains(e.target) &&
        !e.target.closest('.add-to-cart') &&
        !e.target.closest('.buy-now') &&
        !e.target.closest('.related-btn')) {
        toggleCart();
    }
});

// Initialize cart when page loads
window.addEventListener('DOMContentLoaded', () => {
    initCart();
});

// Automatic Video Switching
const videos = [
    'pexels_videos_2324274 (2160p).mp4',
    'pexels_videos_1893629 (2160p).mp4',
    'pexels_videos_2169879 (2160p).mp4',
    'pexels_videos_1994828 (1080p).mp4',
    'video (1080p).mp4'
];

let currentVideoIndex = 0;
let videoAutoTimer;
const videoSlider = document.querySelector('#video-slider');

function switchToVideo(index) {
    currentVideoIndex = (index + videos.length) % videos.length;
    const newSrc = videos[currentVideoIndex];
    
    // Fade out, change video, then fade in
    videoSlider.style.opacity = '0';
    
    setTimeout(() => {
        videoSlider.src = newSrc;
        videoSlider.play();
        videoSlider.style.opacity = '1';
    }, 300);
}

function startAutoVideoSwitch() {
    stopAutoVideoSwitch();
    videoAutoTimer = setInterval(() => {
        switchToVideo(currentVideoIndex + 1);
    }, 10000); // Switch every 10 seconds
}

function stopAutoVideoSwitch() {
    if (videoAutoTimer) {
        clearInterval(videoAutoTimer);
        videoAutoTimer = undefined;
    }
}

// Manual navigation with arrow buttons
if(videoPrev) {
    videoPrev.addEventListener('click', () => {
        switchToVideo(currentVideoIndex - 1);
        restartAutoVideoSwitch();
    });
}

if(videoNext) {
    videoNext.addEventListener('click', () => {
        switchToVideo(currentVideoIndex + 1);
        restartAutoVideoSwitch();
    });
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if(e.key === 'ArrowLeft') {
        switchToVideo(currentVideoIndex - 1);
        restartAutoVideoSwitch();
    }
    if(e.key === 'ArrowRight') {
        switchToVideo(currentVideoIndex + 1);
        restartAutoVideoSwitch();
    }
});

function restartAutoVideoSwitch() {
    startAutoVideoSwitch();
}

// Pause on hover and when tab is not visible
const homeSection = document.querySelector('.home');
if(homeSection) {
    homeSection.addEventListener('mouseenter', stopAutoVideoSwitch);
    homeSection.addEventListener('mouseleave', startAutoVideoSwitch);
}

document.addEventListener('visibilitychange', () => {
    if(document.hidden) { 
        stopAutoVideoSwitch(); 
    } else { 
        startAutoVideoSwitch(); 
    }
});

// Start automatic video switching when page loads
window.addEventListener('load', () => {
    if(videoSlider) {
        startAutoVideoSwitch();
    }
});

// Add video transition CSS
const videoTransitionStyle = document.createElement('style');
videoTransitionStyle.textContent = `
    #video-slider {
        transition: opacity 0.3s ease-in-out;
    }
`;
document.head.appendChild(videoTransitionStyle);




// Packages filtering and search (only runs on packages page)
(() =>{
  const chips = document.querySelectorAll('.packages .filters .chip');
  const cards = document.querySelectorAll('.packages .box .content');
  const searchInput = document.querySelector('#pkg-search');
  if(!cards.length) return;

  let activeFilter = 'all';

  function applyFilters(){
    const q = (searchInput?.value || '').trim().toLowerCase();
    cards.forEach(card =>{
      const tags = (card.getAttribute('data-tags') || '').toLowerCase();
      const title = (card.getAttribute('data-title') || '').toLowerCase();
      const matchFilter = activeFilter === 'all' || tags.includes(activeFilter);
      const matchSearch = !q || title.includes(q) || tags.includes(q);
      card.parentElement.style.display = (matchFilter && matchSearch) ? '' : 'none';
    });
  }

  chips.forEach(chip =>{
    chip.addEventListener('click', ()=>{
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeFilter = chip.getAttribute('data-filter') || 'all';
      applyFilters();
    });
  });
  if(searchInput){
    searchInput.addEventListener('input', applyFilters);
  }
})();

var swiper = new Swiper(".review-slider", {
    spaceBetween: 20,
    loop:true,
    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
    },
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    breakpoints: {
        640: {
            slidesPerView: 1,
        },
        768: {
            slidesPerView: 2,
        },
        1024: {
            slidesPerView: 3,
        },
    },
});

// Active nav highlight on scroll
let sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () =>{
  let scrollY = window.pageYOffset;
  sections.forEach(sec =>{
    const offset = sec.offsetTop - 150;
    const height = sec.offsetHeight;
    const id = sec.getAttribute('id');
    if(scrollY >= offset && scrollY < offset + height){
      navLinks.forEach(l => l.classList.remove('active'));
      const activeLink = document.querySelector('header .navbar a[href="#'+id+'"]');
      if(activeLink) activeLink.classList.add('active');
    }
  });
});

// Smooth scroll for in-page nav links with fixed header offset
const header = document.querySelector('header');
const headerOffset = () => (header ? header.offsetHeight + 10 : 0);
navLinks.forEach(link =>{
  link.addEventListener('click', (e)=>{
    const href = link.getAttribute('href') || '';
    if(href.startsWith('#')){
      const target = document.querySelector(href);
      if(target){
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset();
        window.scrollTo({ top, behavior: 'smooth' });
        history.replaceState(null, '', href);
      }
    }
  });
});

// Adjust scroll on load if landing on a hash
window.addEventListener('load', () =>{
  if(location.hash){
    const target = document.querySelector(location.hash);
    if(target){
      const top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset();
      window.scrollTo(0, top);
    }
  }
});

// Theme toggle with persistence
const savedTheme = localStorage.getItem('theme');
if(savedTheme === 'dark'){
  document.body.classList.add('dark');
}
if(themeToggle){
  themeToggle.addEventListener('click', () =>{
    document.body.classList.toggle('dark');
    const mode = document.body.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('theme', mode);
  });
}

// Close mobile menu after clicking a nav link
navLinks.forEach(link =>{
  link.addEventListener('click', ()=>{
    menu.classList.remove('fa-times');
    navbar.classList.remove('active');
  });
});

// Contact form submission to API
if(contactForm){
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('input[type="submit"]');
    const originalBtnText = submitBtn.value;
    const messageDisplay = document.getElementById('message-display');
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.value = 'Sending...';
    
    // Get form data
    const formData = {
      name: contactForm.querySelector('[name="name"]').value.trim(),
      email: contactForm.querySelector('[name="email"]').value.trim(),
      phone: contactForm.querySelector('[name="phone"]').value.trim(),
      subject: contactForm.querySelector('[name="subject"]').value.trim(),
      message: contactForm.querySelector('[name="message"]').value.trim()
    };
    
    try {
      const response = await fetch('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Success
        if (messageDisplay) {
          messageDisplay.innerHTML = '<p style="color: green; font-size: 1.6rem;">✓ Message sent successfully! We will get back to you soon.</p>';
        }
        showNotification('Message sent successfully!', 'success');
        contactForm.reset();
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          if (messageDisplay) messageDisplay.innerHTML = '';
        }, 5000);
      } else {
        // Error from server
        if (messageDisplay) {
          messageDisplay.innerHTML = `<p style="color: red; font-size: 1.6rem;">✗ ${data.error || 'Failed to send message'}</p>`;
        }
        showNotification(data.error || 'Failed to send message', 'error');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      if (messageDisplay) {
        messageDisplay.innerHTML = '<p style="color: red; font-size: 1.6rem;">✗ Network error. Please check your connection and try again.</p>';
      }
      showNotification('Network error. Please try again later.', 'error');
    } finally {
      // Re-enable submit button
      submitBtn.disabled = false;
      submitBtn.value = originalBtnText;
    }
  });
}

// Service filtering functionality
if(categoryBtns.length > 0) {
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-category');
            
            // Update active button
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter services
            if(category === 'all') {
                serviceBoxes.forEach(box => {
                    box.style.display = 'block';
                    box.style.animation = 'fadeIn 0.5s ease-in';
                });
            } else {
                serviceBoxes.forEach(box => {
                    if(box.getAttribute('data-category') === category) {
                        box.style.display = 'block';
                        box.style.animation = 'fadeIn 0.5s ease-in';
                    } else {
                        box.style.display = 'none';
                    }
                });
            }
        });
    });
}

// Add fadeIn animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

// Travel Tools Functionality
const weatherBtn = document.querySelector('#weather-btn');
const cityInput = document.querySelector('#city-input');
const weatherResult = document.querySelector('#weather-result');
const convertBtn = document.querySelector('#convert-btn');
const amountInput = document.querySelector('#amount-input');
const fromCurrency = document.querySelector('#from-currency');
const toCurrency = document.querySelector('#to-currency');
const resultAmount = document.querySelector('#result-amount');
const calculateBtn = document.querySelector('#calculate-btn');
const budgetResult = document.querySelector('#budget-result');

// Weather API (using OpenWeatherMap - you'll need an API key)
if(weatherBtn && cityInput && weatherResult) {
    weatherBtn.addEventListener('click', async () => {
        const city = cityInput.value.trim();
        if(!city) {
            weatherResult.innerHTML = 'Please enter a city name';
            return;
        }
        
        weatherResult.innerHTML = 'Loading weather data...';
        
        try {
            // For demo purposes, using mock data
            // In production, you'd use: `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=YOUR_API_KEY&units=metric`
            const mockWeather = {
                name: city,
                main: { temp: Math.floor(Math.random() * 30) + 10 },
                weather: [{ description: 'Partly cloudy', icon: '02d' }],
                wind: { speed: Math.floor(Math.random() * 20) + 5 }
            };
            
            weatherResult.innerHTML = `
                <div style="text-align: center;">
                    <h4>${mockWeather.name}</h4>
                    <p><strong>Temperature:</strong> ${mockWeather.main.temp}°C</p>
                    <p><strong>Condition:</strong> ${mockWeather.weather[0].description}</p>
                    <p><strong>Wind Speed:</strong> ${mockWeather.wind.speed} km/h</p>
                </div>
            `;
        } catch (error) {
            weatherResult.innerHTML = 'Error fetching weather data. Please try again.';
        }
    });
}

// Currency Converter (using mock exchange rates)
if(convertBtn && amountInput && fromCurrency && toCurrency && resultAmount) {
    convertBtn.addEventListener('click', () => {
        const amount = parseFloat(amountInput.value);
        const from = fromCurrency.value;
        const to = toCurrency.value;
        
        if(!amount || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }
        
        // Mock exchange rates (in production, use a real API)
        const rates = {
            USD: { INR: 83.5, EUR: 0.92, GBP: 0.79, JPY: 150.5 },
            EUR: { INR: 90.8, USD: 1.09, GBP: 0.86, JPY: 163.6 },
            INR: { USD: 0.012, EUR: 0.011, GBP: 0.0095, JPY: 1.8 },
            GBP: { INR: 105.7, EUR: 1.16, USD: 1.27, JPY: 190.5 },
            JPY: { INR: 0.56, EUR: 0.0061, USD: 0.0066, GBP: 0.0052 }
        };
        
        if(from === to) {
            resultAmount.value = amount;
        } else if(rates[from] && rates[from][to]) {
            resultAmount.value = (amount * rates[from][to]).toFixed(2);
        } else {
            resultAmount.value = 'Error';
        }
    });
}

// Budget Calculator
if(calculateBtn && budgetResult) {
    calculateBtn.addEventListener('click', () => {
        const hotelCost = parseFloat(document.querySelector('#hotel-cost').value) || 0;
        const foodCost = parseFloat(document.querySelector('#food-cost').value) || 0;
        const transportCost = parseFloat(document.querySelector('#transport-cost').value) || 0;
        const activitiesCost = parseFloat(document.querySelector('#activities-cost').value) || 0;
        const tripDays = parseFloat(document.querySelector('#trip-days').value) || 0;
        
        if(tripDays <= 0) {
            showNotification('Please enter a valid number of days', 'error');
            return;
        }
        
        const totalCost = (hotelCost + foodCost + transportCost + activitiesCost) * tripDays;
        const dailyAverage = totalCost / tripDays;
        
        budgetResult.innerHTML = `
            <div style="text-align: center;">
                <h4>Budget Summary</h4>
                <p><strong>Total Trip Cost:</strong> ₹${totalCost.toLocaleString()}</p>
                <p><strong>Daily Average:</strong> ₹${dailyAverage.toLocaleString()}</p>
                <p><strong>Duration:</strong> ${tripDays} days</p>
            </div>
        `;
        
        showNotification('Budget calculated successfully!', 'success');
    });
}

// Notification System
function showNotification(message, type = 'info', duration = 5000) {
    const container = document.querySelector('#notification-container');
    if (!container) return;

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    notification.innerHTML = `
        <button class="close-btn">&times;</button>
        <h4>${type.charAt(0).toUpperCase() + type.slice(1)}</h4>
        <p>${message}</p>
    `;

    container.appendChild(notification);

    // Auto remove after duration
    setTimeout(() => {
        removeNotification(notification);
    }, duration);

    // Close button functionality
    const closeBtn = notification.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        removeNotification(notification);
    });
}

function removeNotification(notification) {
    notification.style.animation = 'slideOut 0.3s ease forwards';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Login form submission to API (standard login form)
const standardLoginForm = document.querySelector('.login-form-container form');
if(standardLoginForm) {
    standardLoginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = standardLoginForm.querySelector('input[type="submit"]');
        const originalBtnText = submitBtn.value;
        
        // Disable submit button
        submitBtn.disabled = true;
        submitBtn.value = 'Logging in...';
        
        // Get form data
        const email = standardLoginForm.querySelector('input[type="Email"]').value.trim();
        const password = standardLoginForm.querySelector('input[type="password"]').value;
        
        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Success - store token and user info
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                showNotification('Login successful! Welcome back, ' + data.user.name, 'success');
                
                // Close login form
                const formClose = document.querySelector('#form-close');
                if (formClose) {
                    loginForm.classList.remove('active');
                }
                
                // Update UI to show logged in state
                const userIcon = document.querySelector('#login-btn');
                if (userIcon) {
                    userIcon.style.color = 'var(--orange)';
                    userIcon.title = 'Logged in as ' + data.user.name;
                }
                
                // Reset form
                standardLoginForm.reset();
            } else {
                // Error from server
                showNotification(data.error || 'Login failed. Please check your credentials.', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            showNotification('Network error. Please check your connection and try again.', 'error');
        } finally {
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.value = originalBtnText;
        }
    });
}

// Toggle logout dropdown
function toggleLogoutDropdown() {
    let dropdown = document.querySelector('.logout-dropdown');
    
    if (!dropdown) {
        // Create dropdown if it doesn't exist
        dropdown = document.createElement('div');
        dropdown.className = 'logout-dropdown';
        
        const user = localStorage.getItem('user');
        let userName = 'User';
        if (user) {
            try {
                const userData = JSON.parse(user);
                userName = userData.name || userName;
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
        
        dropdown.innerHTML = `
            <div class="logout-dropdown-content">
                <div class="user-info">
                    <i class="fas fa-user"></i>
                    <span>${userName}</span>
                </div>
                <div class="logout-actions">
                    <button id="logout-btn" class="btn logout-btn">
                        <i class="fas fa-sign-out-alt"></i>
                        Logout
                    </button>
                </div>
            </div>
        `;
        
        // Position the dropdown near the user icon
        const userIcon = document.querySelector('#login-btn');
        const iconRect = userIcon.getBoundingClientRect();
        dropdown.style.position = 'fixed';
        dropdown.style.top = (iconRect.bottom + 5) + 'px';
        dropdown.style.right = (window.innerWidth - iconRect.right) + 'px';
        dropdown.style.zIndex = '1000';
        
        document.body.appendChild(dropdown);
        
        // Add logout button event listener
        document.getElementById('logout-btn').addEventListener('click', logout);
    }
    
    // Toggle visibility
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    const dropdown = document.querySelector('.logout-dropdown');
    const userIcon = document.querySelector('#login-btn');
    
    if (dropdown && dropdown.style.display === 'block' && 
        !dropdown.contains(e.target) && !userIcon.contains(e.target)) {
        dropdown.style.display = 'none';
    }
});

// Logout functionality
async function logout() {
    try {
        // Call server logout endpoint (optional, for logging purposes)
        const token = localStorage.getItem('token');
        if (token) {
            try {
                await fetch('http://localhost:3000/api/logout', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            } catch (error) {
                console.log('Server logout failed, proceeding with client logout');
            }
        }
        
        // Clear authentication data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Update UI
        const userIcon = document.querySelector('#login-btn');
        if (userIcon) {
            userIcon.style.color = '';
            userIcon.title = 'Login';
        }
        
        // Hide logout dropdown if visible
        const logoutDropdown = document.querySelector('.logout-dropdown');
        if (logoutDropdown) {
            logoutDropdown.style.display = 'none';
        }
        
        showNotification('Logged out successfully', 'info');
        
        // Redirect to home page after a short delay
        setTimeout(() => {
            window.location.href = 'FEE PROJECT.HTML#home';
        }, 1000);
    } catch (error) {
        console.error('Logout error:', error);
        // Still proceed with client logout even if server call fails
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        showNotification('Logged out successfully', 'info');
        setTimeout(() => {
            window.location.href = 'FEE PROJECT.HTML#home';
        }, 1000);
    }
}

// Check if user is logged in on page load
window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
        try {
            const userData = JSON.parse(user);
            const userIcon = document.querySelector('#login-btn');
            if (userIcon) {
                userIcon.style.color = 'var(--orange)';
                userIcon.title = 'Logged in as ' + userData.name;
            }
        } catch (error) {
            console.error('Error parsing user data:', error);
        }
    }
});

// Signup form submission to API
if(signupFormElement) {
    signupFormElement.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = signupFormElement.querySelector('input[type="submit"]');
        const originalBtnText = submitBtn.value;
        
        submitBtn.disabled = true;
        submitBtn.value = 'Creating account...';
        
        // Get form data
        const inputs = signupFormElement.querySelectorAll('input');
        const formData = {
            name: inputs[0].value.trim(),
            email: inputs[1].value.trim(),
            phone: inputs[2].value.trim(),
            password: inputs[3].value,
            confirmPassword: inputs[4].value
        };
        
        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            showNotification('Passwords do not match', 'error');
            submitBtn.disabled = false;
            submitBtn.value = originalBtnText;
            return;
        }
        
        try {
            const response = await fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                showNotification('Account created successfully! Welcome, ' + data.user.name, 'success');
                
                // Switch to login form or close
                if (showLoginBtn) {
                    signupFormElement.classList.remove('active');
                    loginFormElement.classList.add('active');
                }
                
                signupFormElement.reset();
            } else {
                showNotification(data.error || 'Registration failed', 'error');
            }
        } catch (error) {
            console.error('Signup error:', error);
            showNotification('Network error. Please try again.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.value = originalBtnText;
        }
    });
}


// Loading Spinner Control
const loadingSpinner = document.querySelector('#loading-spinner');

if(loadingSpinner) {
    // Hide spinner after page loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingSpinner.classList.add('hidden');
            setTimeout(() => {
                loadingSpinner.style.display = 'none';
            }, 500);
        }, 2000);
    });

    // Show spinner on page refresh
    window.addEventListener('beforeunload', () => {
        loadingSpinner.classList.remove('hidden');
        loadingSpinner.style.display = 'flex';
    });
}