let currentTerminal = 'all';
let currentArea = 'all';
let currentCategory = 'all';
let searchQuery = '';
let currentFloor = 'all'; // เพิ่มตัวแปรเก็บชั้นปัจจุบัน

// เพิ่มฟังก์ชันค้นหา
function searchShops() {
  const searchInput = document.querySelector('.search-bar input[type="text"]');
  searchQuery = searchInput.value.toLowerCase().trim();
  filterShops(currentCategory);
}

// เพิ่มฟังก์ชันโหลดข้อมูลจาก localStorage
function loadShopData() {
  try {
    const savedData = localStorage.getItem('shopData');
    if (savedData) {
      // อัพเดตข้อมูลร้านค้าจาก localStorage
      Object.assign(shopData, JSON.parse(savedData));
    }
  } catch (error) {
    console.error('Error loading shop data:', error);
  }
}

function switchTerminal(terminal) {
  currentTerminal = terminal;
  filterShops(currentCategory);
}

function switchArea(area) {
  currentArea = area;
  filterShops(currentCategory);
}

function switchFloor(floor) {
  currentFloor = floor;
  filterShops(currentCategory);
}

function filterShops(category, isInitialLoad = false) {
  currentCategory = category;
  
  // เปลี่ยนสถานะ active ของปุ่มหมวดหมู่
  document.querySelectorAll('.category-item').forEach(item => {
    item.classList.remove('active');
  });
  
  if (isInitialLoad) {
    document.querySelector('[onclick="filterShops(\'all\')"]').classList.add('active');
  } else if (event && event.currentTarget) {
    event.currentTarget.classList.add('active');
  }

  // ดึงและกรองข้อมูลร้านค้า
  let shops = (category === 'all') ? 
    Object.values(shopData).flat() : 
    shopData[category] || [];
    
  // กรองตาม Terminal
  if (currentTerminal !== 'all') {
    shops = shops.filter(shop => shop.location.toLowerCase().includes(`terminal ${currentTerminal}`));
  }
  
  // กรองตาม Area (public/transit)
  if (currentArea !== 'all') {
    shops = shops.filter(shop => shop.locationType === currentArea);
  }

  // เพิ่มการกรองตามชั้น
  if (currentFloor !== 'all') {
    shops = shops.filter(shop => 
      shop.location.toLowerCase().includes(`floor ${currentFloor}`) ||
      shop.location.toLowerCase().includes(`ชั้น ${currentFloor}`)
    );
  }

  // กรองตามคำค้นหา
  if (searchQuery) {
    shops = shops.filter(shop => 
      shop.name.toLowerCase().includes(searchQuery) ||
      shop.products.toLowerCase().includes(searchQuery) ||
      shop.category.toLowerCase().includes(searchQuery)
    );
  }
  
  // แสดงผลร้านค้า
  const shopGrid = document.querySelector('.shop-grid');
  shopGrid.innerHTML = shops.length > 0 ? renderShops(shops) : '<div class="no-shops">ไม่พบร้านค้าที่ค้นหา</div>';
}

// เพิ่มฟังก์ชันสำหรับดึง URL ของรูปภาพ
function getImageUrl(imageData, type = 'preview') {
  // กรณีไม่มีข้อมูลรูปภาพ หรือเป็น #
  if (!imageData || imageData === '#') {
    return './images/defaults/no-image.png';
  }
  
  // กรณีเป็น Base64 หรือ URL เต็ม
  if (imageData.startsWith('data:') || imageData.startsWith('http')) {
    return imageData;
  }
  
  // กรณีเป็น path ในโปรเจค
  try {
    if (imageData.startsWith('./') || imageData.startsWith('/')) {
      // ทดลองโหลดรูปจาก path ที่กำหนด
      const img = new Image();
      img.src = imageData;
      return imageData;
    }
  } catch (error) {
    console.warn('ไม่สามารถโหลดรูปภาพจาก path:', imageData);
  }
  
  // กรณีไม่สามารถโหลดรูปได้ ให้ใช้รูป default
  return './images/defaults/no-image.png';
}

// แก้ไขส่วนที่แสดงรูปใน HTML template
function renderShops(shops) {
  return shops.map(shop => `
    <div class="shop-card">
      <img src="${getImageUrl(shop.image, 'preview')}" alt="${shop.name}"
           onerror="this.src='./images/defaults/no-image.png'">
      <h3>${shop.name}</h3>
      <p><i class="fas fa-map-marker-alt"></i> ${shop.location}</p>
      <p><i class="far fa-clock"></i> ${shop.hours}</p>
      <p><i class="fas fa-tag"></i> ${shop.locationType === 'public' ? 'Public Area' : 'Transit Area'}</p>
      <button onclick="openPopup('${JSON.stringify(shop).replace(/"/g, '&quot;')}')">
        ดูรายละเอียด
      </button>
    </div>
  `).join('');
}

// เริ่มต้นเมื่อโหลดหน้า
document.addEventListener('DOMContentLoaded', () => {
  // โหลดข้อมูลล่าสุดจาก localStorage ก่อน
  loadShopData();
  
  // จากนั้นจึงแสดงผล
  filterShops('all', true);

  // เพิ่ม Event Listeners สำหรับการค้นหา
  const searchInput = document.querySelector('.search-bar input[type="text"]');
  const searchButton = document.querySelector('.search-bar button');

  // ค้นหาเมื่อกดปุ่ม
  searchButton.addEventListener('click', searchShops);

  // ค้นหาเมื่อกด Enter
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      searchShops();
    }
  });

  // Real-time search (ค้นหาขณะพิมพ์)
  searchInput.addEventListener('input', () => {
    // ใช้ debounce เพื่อไม่ให้ค้นหาถี่เกินไป
    clearTimeout(searchInput.debounceTimer);
    searchInput.debounceTimer = setTimeout(searchShops, 300);
  });
});

// เพิ่มฟังก์ชันอัพเดตข้อมูลแบบ real-time
window.addEventListener('storage', (e) => {
  if (e.key === 'shopData') {
    loadShopData();
    filterShops(currentCategory);
  }
});

// เพิ่ม event listener สำหรับการอัพเดตข้อมูล
window.addEventListener('shopDataUpdated', () => {
  // โหลดข้อมูลใหม่จาก localStorage
  loadShopData();
  // แสดงผลใหม่
  filterShops(currentCategory);
});
