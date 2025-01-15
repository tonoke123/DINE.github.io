function showAddForm() {
  document.getElementById('modalTitle').textContent = 'เพิ่มร้านค้าใหม่';
  document.getElementById('shopForm').reset();
  document.getElementById('shopFormModal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('shopFormModal').style.display = 'none';
}

function editShop(shopDataStr) {
  try {
    const shop = JSON.parse(decodeURIComponent(shopDataStr));
    document.getElementById('modalTitle').textContent = 'แก้ไขข้อมูลร้านค้า';
    const form = document.getElementById('shopForm');
    
    // แยก location เพื่อกรอกข้อมูล
    const location = shop.location;
    const terminalMatch = location.match(/Terminal (\d+)/);
    const floorMatch = location.match(/Floor (\d+)/);
    const zoneMatch = location.match(/Zone\s+([A-Z])/);

    // กรอกข้อมูลลงในฟอร์ม
    form.elements['name'].value = shop.name;
    form.elements['category'].value = shop.category;
    if (terminalMatch) form.elements['terminal'].value = terminalMatch[1];
    if (floorMatch) form.elements['floor'].value = floorMatch[1];
    if (zoneMatch) form.elements['zone'].value = `Food Court Zone ${zoneMatch[1]}`;
    form.elements['locationType'].value = shop.locationType;
    form.elements['hours'].value = shop.hours;
    form.elements['contact'].value = shop.contact;
    form.elements['products'].value = shop.products;
    form.elements['description'].value = shop.description;

    // แสดงรูปภาพเดิม
    const previewImg = document.getElementById('previewImg');
    const detailPreviewImg = document.getElementById('detailPreviewImg');
    
    previewImg.src = shop.image || './images/defaults/no-image.png';
    detailPreviewImg.src = shop.detailImage || './images/defaults/no-image.png';
    previewImg.style.display = 'block';
    detailPreviewImg.style.display = 'block';

    // แสดง modal
    document.getElementById('shopFormModal').style.display = 'flex';
  } catch (error) {
    console.error('Error parsing shop data:', error);
    alert('เกิดข้อผิดพลาดในการโหลดข้อมูลร้านค้า');
  }
}

function deleteShop(category, shopName) {
  if (confirm(`ต้องการลบร้าน ${shopName} ใช่หรือไม่?`)) {
    try {
      // ลบร้านค้าจาก shopData
      const index = shopData[category].findIndex(shop => shop.name === shopName);
      if (index > -1) {
        shopData[category].splice(index, 1);
        
        // บันทึกข้อมูลลงใน localStorage
        localStorage.setItem('shopData', JSON.stringify(shopData));
        
        // แจ้งเตือนสำเร็จ
        alert('ลบร้านค้าสำเร็จ');
        
        // อัพเดตการแสดงผล
        renderShopList();
        
        // ส่ง event เพื่อให้หน้า index รับรู้การเปลี่ยนแปลง
        window.dispatchEvent(new Event('shopDataUpdated'));
      }
    } catch (error) {
      console.error('Error deleting shop:', error);
      alert('เกิดข้อผิดพลาดในการลบร้านค้า');
    }
  }
}

// เพิ่มฟังก์ชันแสดงตัวอย่างรูปภาพ
function previewImage(input, imgId) {
  const file = input.files[0];
  if (file) {
    const reader = new FileReader();
    const img = document.getElementById(imgId);
    
    reader.onload = function(e) {
      img.src = e.target.result;
      img.style.display = 'block';
    }
    
    reader.readAsDataURL(file);
  }
}

// เพิ่มฟังก์ชันจัดการรูปภาพ
async function handleImageUpload(file, type) {
  try {
    if (!file) {
      return `./images/defaults/no-image.png`;
    }
    // ในที่นี้จะจำลองการบันทึกไฟล์ด้วยการแปลงเป็น Base64
    const base64 = await convertImageToBase64(file);
    
    // สร้าง unique filename
    const filename = `${Date.now()}-${file.name}`;
    const path = type === 'preview' ? 
      `/images/shops/previews/${filename}` : 
      `/images/shops/details/${filename}`;
    
    // TODO: ในการใช้งานจริงควรอัพโหลดไฟล์ไปยัง server
    // แต่ในตัวอย่างนี้จะเก็บเป็น Base64 ใน localStorage
    
    return base64;
  } catch (error) {
    console.error('Error handling image upload:', error);
    return './images/defaults/no-image.png';
  }
}

// แก้ไขฟังก์ชัน handleSubmit
function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);

  // สร้าง location string
  const location = `Terminal ${formData.get('terminal')}, Floor ${formData.get('floor')}, ${formData.get('zone')}`;
  
  Promise.all([
    handleImageUpload(form.elements['image'].files[0], 'preview'),
    handleImageUpload(form.elements['detailImage'].files[0], 'detail')
  ]).then(([image, detailImage]) => {
    const shopData = {
      name: formData.get('name'),
      category: formData.get('category'),
      location: location,
      locationType: formData.get('locationType'),
      hours: formData.get('hours'),
      contact: formData.get('contact'),
      products: formData.get('products'),
      description: formData.get('description'),
      image: image || document.getElementById('previewImg').src,
      detailImage: detailImage || document.getElementById('detailPreviewImg').src
    };

    saveShopData(shopData);
    closeModal();
    renderShopList();
  });
}

// เพิ่มฟังก์ชันแปลงรูปภาพเป็น Base64
function convertImageToBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

// แก้ไขฟังก์ชัน renderShopList เพื่อแสดงรูปภาพ
function renderShopList(filterCategory = 'all') {
    const shopList = document.querySelector('.shop-list');
    let shops = [];
    
    // ดึงข้อมูลจาก localStorage ก่อน
    try {
        const savedData = localStorage.getItem('shopData');
        if (savedData) {
            Object.assign(shopData, JSON.parse(savedData));
        }
    } catch (error) {
        console.error('Error loading shop data:', error);
    }
    
    // รวมร้านค้าจากทุกหมวดหมู่
    if (filterCategory === 'all') {
        for (let category in shopData) {
            if (Array.isArray(shopData[category])) {
                shops = shops.concat(shopData[category]);
            }
        }
    } else {
        shops = shopData[filterCategory] || [];
    }
    
    // ถ้าไม่มีร้านค้า
    if (shops.length === 0) {
        shopList.innerHTML = '<div class="no-shops">ไม่พบร้านค้า</div>';
        return;
    }
    
    // แก้ไขการส่งข้อมูลให้กับฟังก์ชัน editShop
    shopList.innerHTML = shops.map(shop => `
        <div class="shop-item">
            <img src="${shop.image || './images/defaults/no-image.png'}" 
                 alt="${shop.name}"
                 onerror="this.src='./images/defaults/no-image.png'">
            <div class="shop-item-header">
                <h3>${shop.name}</h3>
                <div class="shop-actions">
                    <button class="edit-btn" onclick="editShop('${encodeURIComponent(JSON.stringify(shop))}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="deleteShop('${shop.category}', '${shop.name}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <p><strong>หมวดหมู่:</strong> ${shop.category}</p>
            <p><strong>สถานที่:</strong> ${shop.location}</p>
            <p><strong>เวลาทำการ:</strong> ${shop.hours}</p>
        </div>
    `).join('');
}

// เพิ่มฟังก์ชัน filterShopList
function filterShopList(category = 'all') {
  const selectedCategory = category === 'all' ? 
    document.getElementById('categoryFilter').value : category;
    
  // ดึงข้อมูลจาก localStorage ก่อน
  try {
    const savedData = localStorage.getItem('shopData');
    if (savedData) {
      Object.assign(shopData, JSON.parse(savedData));
    }
  } catch (error) {
    console.error('Error loading shop data:', error);
  }
  
  // แสดงผลตามหมวดหมู่
  renderShopList(selectedCategory);
}

// แก้ไข event listener เมื่อโหลดหน้า
document.addEventListener('DOMContentLoaded', () => {
    // โหลดข้อมูลจาก localStorage ก่อน
    try {
        const savedData = localStorage.getItem('shopData');
        if (savedData) {
            Object.assign(shopData, JSON.parse(savedData));
        }
    } catch (error) {
        console.error('Error loading shop data:', error);
    }
    
    // แสดงรายการร้านค้าทั้งหมด
    renderShopList('all');
});

// Initialize shop list on page load
document.addEventListener('DOMContentLoaded', () => {
  renderShopList();
});

function saveShopData(shop) {
  // สร้างหมวดหมู่ถ้ายังไม่มี
  if (!shopData[shop.category]) {
    shopData[shop.category] = [];
  }

  // ตรวจสอบว่าเป็นการแก้ไขหรือเพิ่มใหม่
  const existingIndex = shopData[shop.category].findIndex(
    item => item.name === shop.name
  );

  if (existingIndex >= 0) {
    // อัพเดตข้อมูลที่มีอยู่
    shopData[shop.category][existingIndex] = {
      ...shopData[shop.category][existingIndex],
      ...shop
    };
  } else {
    // เพิ่มข้อมูลใหม่
    shopData[shop.category].push(shop);
  }

  // บันทึกลง localStorage และ trigger event
  try {
    localStorage.setItem('shopData', JSON.stringify(shopData));
    // สร้าง event เพื่อแจ้งการเปลี่ยนแปลงข้อมูล
    window.dispatchEvent(new Event('shopDataUpdated'));
  } catch (error) {
    console.error('Error saving shop data:', error);
    alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    return false;
  }

  alert(existingIndex >= 0 ? 'อัพเดตข้อมูลสำเร็จ' : 'เพิ่มร้านค้าใหม่สำเร็จ');
  return true;
}

// โหลดข้อมูลจาก localStorage เมื่อเปิดหน้า
document.addEventListener('DOMContentLoaded', () => {
  try {
    const savedData = localStorage.getItem('shopData');
    if (savedData) {
      Object.assign(shopData, JSON.parse(savedData));
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error);
  }
  renderShopList();
});

// เพิ่มการโหลดข้อมูลเมื่อเปิดหน้า admin
document.addEventListener('DOMContentLoaded', () => {
  try {
    const savedData = localStorage.getItem('shopData');
    if (savedData) {
      Object.assign(shopData, JSON.parse(savedData));
    }
  } catch (error) {
    console.error('Error loading initial data:', error);
  }
  
  renderShopList();
});

function filterShops() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const locationFilter = document.getElementById('locationFilter').value;
    
    let filteredShops = [];
    
    // รวมร้านค้าจากทุกหมวดหมู่
    if (categoryFilter === 'all') {
        for (let category in shopData) {
            if (Array.isArray(shopData[category])) {
                filteredShops = filteredShops.concat(shopData[category]);
            }
        }
    } else {
        filteredShops = shopData[categoryFilter] || [];
    }
    
    // กรองตามพื้นที่
    if (locationFilter !== 'all') {
        filteredShops = filteredShops.filter(shop => 
            shop.locationType === locationFilter
        );
    }
    
    // กรองตามคำค้นหา
    if (searchInput) {
        filteredShops = filteredShops.filter(shop => 
            shop.name.toLowerCase().includes(searchInput) ||
            shop.products.toLowerCase().includes(searchInput) ||
            shop.description?.toLowerCase().includes(searchInput) ||
            shop.location.toLowerCase().includes(searchInput)
        );
    }
    
    renderFilteredShops(filteredShops);
}

function renderFilteredShops(shops) {
    const shopList = document.querySelector('.shop-list');
    
    if (shops.length === 0) {
        shopList.innerHTML = '<div class="no-shops">ไม่พบร้านค้าที่ค้นหา</div>';
        return;
    }
    
    shopList.innerHTML = shops.map(shop => `
        <div class="shop-item">
            <img src="${shop.image || './images/defaults/no-image.png'}" 
                 alt="${shop.name}"
                 onerror="this.src='./images/defaults/no-image.png'">
            <div class="shop-item-header">
                <h3>${shop.name}</h3>
                <div class="shop-actions">
                    <button class="edit-btn" onclick="editShop('${encodeURIComponent(JSON.stringify(shop))}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="deleteShop('${shop.category}', '${shop.name}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <p><strong>หมวดหมู่:</strong> ${shop.category}</p>
            <p><strong>สถานที่:</strong> ${shop.location}</p>
            <p><strong>เวลาทำการ:</strong> ${shop.hours}</p>
        </div>
    `).join('');
}
