function openPopup(shopData) {
  try {
    const shop = JSON.parse(shopData);
    const popup = document.querySelector('.popup');
    
    popup.innerHTML = `
      <button class="close-btn" onclick="closePopup()">×</button>
      <div class="tag">${shop.category}</div>
      <h2>${shop.name}</h2>
      <div class="detail-image">
        <img src="${getImageUrl(shop.detailImage || shop.image, 'detail')}" 
             alt="${shop.name}"
             onerror="this.src='./images/defaults/no-image.png'">
      </div>
      
      <!-- เพิ่มส่วนแสดงคำอธิบายร้าน -->
      ${shop.description ? `
        <div class="shop-description">
          <p><i class="fas fa-quote-left"></i> ${shop.description}</p>
        </div>
      ` : ''}
      
      <hr>
      <div class="shop-info-grid">
        <div class="info-section">
          <h3><i class="fas fa-info-circle"></i> ข้อมูลทั่วไป</h3>
          <p><i class="far fa-clock"></i> เวลาเปิด-ปิด: ${shop.hours}</p>
          <p><i class="fas fa-phone"></i> ติดต่อ: ${shop.contact}</p>
        </div>
        
        <div class="info-section">
          <h3><i class="fas fa-map-marked-alt"></i> สถานที่ตั้ง</h3>
          <p><i class="fas fa-map-marker-alt"></i> ${shop.location}</p>
          <p><i class="fas fa-tag"></i> ${shop.locationType === 'public' ? 'Public Area' : 'Transit Area'}</p>
        </div>
        
        <div class="info-section full-width">
          <h3><i class="fas fa-utensils"></i> เมนูแนะนำ</h3>
          <div class="products-list">
            ${shop.products.split(',').map(product => 
              `<span class="product-tag">${product.trim()}</span>`
            ).join('')}
          </div>
        </div>
      </div>
    `;
    
    const popupOverlay = document.getElementById('popupOverlay');
    if (popupOverlay) {
      popupOverlay.style.display = 'flex';
    } else {
      console.error('Popup overlay not found');
    }
  } catch (error) {
    console.error('Error in openPopup:', error);
  }
}

function closePopup() {
  const popupOverlay = document.getElementById('popupOverlay');
  if (popupOverlay) {
    popupOverlay.style.display = 'none';
  }
}

// รอให้ DOM โหลดเสร็จก่อนเพิ่ม event listeners
document.addEventListener('DOMContentLoaded', () => {
  const popupOverlay = document.getElementById('popupOverlay');
  if (popupOverlay) {
    // ปิด popup เมื่อคลิกพื้นที่นอก popup
    popupOverlay.addEventListener('click', (e) => {
      if (e.target.id === 'popupOverlay') {
        closePopup();
      }
    });

    // ปิด popup เมื่อกด ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closePopup();
      }
    });
  }
});
