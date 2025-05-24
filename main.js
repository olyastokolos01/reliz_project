document.addEventListener("DOMContentLoaded", () => {
  // Search functionality
  const searchForm = document.querySelector(".search-form");
  const searchInput = document.querySelector(".search-input");
  const productCards = document.querySelectorAll(".product-card");
  
  if (searchForm) {
    searchForm.addEventListener("submit", function(event) {
      event.preventDefault();
      
      const searchQuery = searchInput.value.trim().toLowerCase();
      
      productCards.forEach(card => {
        if (searchQuery !== "") {
          const productTitle = card.querySelector('h3').textContent.toLowerCase();
          if (productTitle.includes(searchQuery)) {
            card.style.display = "block";
          } else {
            card.style.display = "none";
          }
        } else {
          card.style.display = "block";
        }
      });
    });
  }

  // Cart functionality
  const cartCount = document.querySelector(".cart-count");
  let counter = parseInt(localStorage.getItem("cartCount") || "0");
  
  // Initialize cart count from localStorage
  if (cartCount) {
    cartCount.textContent = counter;
  }
  
  // Add to cart click handlers
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  
  addToCartButtons.forEach(button => {
    button.addEventListener("click", function(event) {
      event.preventDefault();
      
      // Increment cart counter
      counter++;
      localStorage.setItem("cartCount", counter);
      
      if (cartCount) {
        cartCount.textContent = counter;
      }
      
      // Get product information
      const card = this.closest(".product-card");
      const productInfo = {
        id: Date.now().toString(), // Generate a unique ID
        title: card.querySelector("h3").textContent,
        imgSrc: card.querySelector(".product-img").getAttribute("src"),
        price: card.querySelector(".product-price").textContent,
        quantity: 1
      };
      
      // Add to cart in localStorage
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart.push(productInfo);
      localStorage.setItem("cart", JSON.stringify(cart));
      
      // Optional: Show confirmation message
      alert("Товар додано до кошика!");
    });
  });
  
  // Cart icon click handler to navigate to cart page
  const cartIcon = document.querySelector(".header-icon:last-child");
  if (cartIcon) {
    cartIcon.addEventListener("click", function() {
      window.location.href = "cart.html";
    });
  }
  
  // Mobile menu toggle
  const mobileMenuToggle = document.querySelector(".mobile-menu");
  const navLinks = document.querySelector(".nav-links");
  
  if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener("click", function() {
      navLinks.classList.toggle("active");
    });
  }
});