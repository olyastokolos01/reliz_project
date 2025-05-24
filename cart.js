document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.querySelector(".cart-container"); // You'll need to add this element to your cart.html
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  let totalSetPrice = 0;
  const totalPriceElement = document.querySelector(".total-price"); // You'll need to add this element to your cart.html
  const idArray = [];
  const itemCards = {};

  // Create cart HTML if there are items
  if (cartItems.length > 0) {
    cartItems.forEach((item) => {
      // Check if item with this ID already exists in the cart
      if (!idArray.includes(item.id)) {
        idArray.push(item.id);
        
        // Get the price as a number (removing currency symbol and formatting)
        const priceValue = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
        
        // Create cart item HTML
        const cartItemHTML = `
          <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-content">
              <div class="cart-item-image">
                <img src="${item.imgSrc}" alt="${item.title}">
              </div>
              <div class="cart-item-details">
                <h3 class="cart-item-title">${item.title}</h3>
                <p class="cart-item-price" data-price="${priceValue}">${item.price}</p>
                <div class="cart-item-quantity">
                  <button class="quantity-btn" data-action="minus">-</button>
                  <input type="text" class="quantity-input" value="1" readonly>
                  <button class="quantity-btn" data-action="plus">+</button>
                </div>
                <button class="remove-item-btn" data-action="remove">Видалити</button>
              </div>
            </div>
          </div>
        `;
        
        cartContainer.insertAdjacentHTML("beforeend", cartItemHTML);
        
        // Store reference to the cart item
        itemCards[item.id] = cartContainer.lastElementChild;
        
        // Add to total price
        totalSetPrice += priceValue;
      } else {
        // If item already exists, increase quantity
        const existingCard = itemCards[item.id];
        const quantityInput = existingCard.querySelector(".quantity-input");
        let newValue = parseInt(quantityInput.value) + 1;
        quantityInput.value = newValue;
        
        // Update price in the UI
        const priceElement = existingCard.querySelector(".cart-item-price");
        const unitPrice = parseFloat(priceElement.dataset.price);
        const newPrice = (unitPrice * newValue).toFixed(2);
        priceElement.innerText = newPrice + " грн";
        
        // Add to total price
        totalSetPrice += unitPrice;
      }
    });
    
    // Add order summary section
    const orderSummaryHTML = `
      <div class="order-summary">
        <h2>Сума замовлення</h2>
        <div class="summary-row">
          <span>Товари:</span>
          <span class="total-price">${totalSetPrice.toFixed(2)} грн</span>
        </div>
        <div class="summary-row">
          <span>Доставка:</span>
          <span>За тарифами перевізника</span>
        </div>
        <div class="summary-row total">
          <span>Загалом:</span>
          <span class="total-price">${totalSetPrice.toFixed(2)} грн</span>
        </div>
        <button class="checkout-btn">Оформити замовлення</button>
      </div>
    `;
    
    cartContainer.insertAdjacentHTML("afterend", orderSummaryHTML);
    
    // Update total price elements
    document.querySelectorAll(".total-price").forEach(el => {
      el.innerText = totalSetPrice.toFixed(2) + " грн";
    });
  } else {
    // If cart is empty
    cartContainer.innerHTML = `
      <div class="empty-cart">
        <h2>Ваш кошик порожній</h2>
        <p>Додайте товари до кошика, щоб оформити замовлення</p>
        <a href="index.html" class="btn">Перейти до покупок</a>
      </div>
    `;
  }

  // Handle quantity decrease
  document.querySelectorAll("[data-action='minus']").forEach(btn => {
    btn.addEventListener("click", () => {
      const cartItem = btn.closest(".cart-item");
      const quantityInput = cartItem.querySelector(".quantity-input");
      const currentValue = parseInt(quantityInput.value);
      
      if (currentValue > 1) {
        const newValue = currentValue - 1;
        quantityInput.value = newValue;
        
        const priceElement = cartItem.querySelector(".cart-item-price");
        const unitPrice = parseFloat(priceElement.dataset.price);
        priceElement.innerText = (unitPrice * newValue).toFixed(2) + " грн";
        
        // Update total price
        totalSetPrice -= unitPrice;
        document.querySelectorAll(".total-price").forEach(el => {
          el.innerText = totalSetPrice.toFixed(2) + " грн";
        });
        
        // Update cart in localStorage
        updateCartQuantity(cartItem.dataset.id, newValue);
      }
    });
  });

  // Handle quantity increase
  document.querySelectorAll("[data-action='plus']").forEach(btn => {
    btn.addEventListener("click", () => {
      const cartItem = btn.closest(".cart-item");
      const quantityInput = cartItem.querySelector(".quantity-input");
      const currentValue = parseInt(quantityInput.value);
      const newValue = currentValue + 1;
      
      quantityInput.value = newValue;
      
      const priceElement = cartItem.querySelector(".cart-item-price");
      const unitPrice = parseFloat(priceElement.dataset.price);
      priceElement.innerText = (unitPrice * newValue).toFixed(2) + " грн";
      
      // Update total price
      totalSetPrice += unitPrice;
      document.querySelectorAll(".total-price").forEach(el => {
        el.innerText = totalSetPrice.toFixed(2) + " грн";
      });
      
      // Update cart in localStorage
      updateCartQuantity(cartItem.dataset.id, newValue);
    });
  });

  // Handle remove item
  document.querySelectorAll("[data-action='remove']").forEach(btn => {
    btn.addEventListener("click", () => {
      const cartItem = btn.closest(".cart-item");
      const itemId = cartItem.dataset.id;
      const quantityInput = cartItem.querySelector(".quantity-input");
      const quantity = parseInt(quantityInput.value);
      const priceElement = cartItem.querySelector(".cart-item-price");
      const unitPrice = parseFloat(priceElement.dataset.price);
      
      // Update total price
      totalSetPrice -= unitPrice * quantity;
      document.querySelectorAll(".total-price").forEach(el => {
        el.innerText = totalSetPrice.toFixed(2) + " грн";
      });
      
      // Remove item from DOM
      cartItem.remove();
      
      // Remove item from localStorage
      removeFromCart(itemId);
      
      // Update cart count in header
      const cartCount = document.querySelector(".cart-count");
      const newCount = parseInt(localStorage.getItem("cartCount")) - quantity;
      localStorage.setItem("cartCount", Math.max(0, newCount));
      
      if (cartCount) {
        cartCount.textContent = Math.max(0, newCount);
      }
      
      // Show empty cart message if all items are removed
      if (cartContainer.children.length === 0) {
        cartContainer.innerHTML = `
          <div class="empty-cart">
            <h2>Ваш кошик порожній</h2>
            <p>Додайте товари до кошика, щоб оформити замовлення</p>
            <a href="index.html" class="btn">Перейти до покупок</a>
          </div>
        `;
        
        // Remove order summary
        const orderSummary = document.querySelector(".order-summary");
        if (orderSummary) {
          orderSummary.remove();
        }
      }
    });
  });

  // Checkout button handler
  const checkoutBtn = document.querySelector(".checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      // Here you would normally redirect to a checkout page
      alert("Перенаправлення на сторінку оформлення замовлення...");
      // window.location.href = "checkout.html";
    });
  }

  // Helper function to update cart item quantity in localStorage
  function updateCartQuantity(itemId, newQuantity) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const itemsWithId = cart.filter(item => item.id === itemId);
    
    // Remove all instances of this item
    const updatedCart = cart.filter(item => item.id !== itemId);
    
    // Add back the correct number of this item
    for (let i = 0; i < newQuantity; i++) {
      updatedCart.push(itemsWithId[0]);
    }
    
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    
    // Update cart count in header
    const totalItems = updatedCart.length;
    localStorage.setItem("cartCount", totalItems);
    
    const cartCount = document.querySelector(".cart-count");
    if (cartCount) {
      cartCount.textContent = totalItems;
    }
  }

  // Helper function to remove item from cart
  function removeFromCart(itemId) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = cart.filter(item => item.id !== itemId);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  }
});