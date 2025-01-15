function getRandomFloor() {
  return Math.floor(Math.random() * 4) + 1;
}

const shopData = {
  'thai-food': [
    {
      name: 'ส้มตำนัว',
      location: 'Terminal 1, Floor 1, Food Court Zone A',
      locationType: 'public',
      hours: '06:00 - 22:00',
      image: '/images/dine/previews/ส1.png',
      detailImage: '/images/dine/details/ส2.jpg',
      category: 'อาหารไทย',
      contact: '02-123-4567',
      products: 'ส้มตำ, ไก่ย่าง, ข้าวเหนียว',
      description: 'ร้านส้มตำรสเด็ด ที่คัดสรรวัตถุดิบคุณภาพ พร้อมเสิร์ฟความอร่อยแบบอีสานแท้ๆ'
    },
    {
      name: 'ครัวคุณย่า',
      location: 'Terminal 1, Floor 2, Food Court Zone B',
      locationType: 'public',
      hours: '06:00 - 22:00',
      image: '/images/dine/previews/ย1.png',
      detailImage: '/images/dine/details/ย2.jpg',
      category: 'อาหารไทย',
      contact: '02-123-4568',
      products: 'แกงเขียวหวาน, ผัดไทย, ข้าวผัด',
      description: 'ครัวคุณย่า ร้านอาหารไทยรสชาติต้นตำรับ ที่พร้อมเสิร์ฟเมนูยอดนิยมอย่างแกงเขียวหวาน ผัดไทย และข้าวผัด'
    },
    {
      name: 'ร้านข้าวแกงปักษ์ใต้',
      location: 'Terminal 2, Floor 1, Food Court Zone E',
      locationType: 'transit',
      hours: '07:00 - 21:00',
      image: '/images/dine/previews/.jpg',
      detailImage: '/images/dine/details/.jpg',
      category: 'อาหารไทย',
      contact: '02-987-6543',
      products: 'แกงไตปลา, ข้าวยำ, ผัดสะตอ',
      description: 'ร้านข้าวแกงปักษ์ใต้ ที่พร้อมเสิร์ฟเมนูยอดนิยมอย่างแกงไตปลา ข้าวยำ และผัดสะตอ'
    }
  ],
  'international-food': [
    {
      name: 'McDonald',
      location: 'Terminal 1, Floor 1, Food Court Zone C',
      locationType: 'public',
      hours: '06:00 - 22:00',
      image: '/images/dine/previews/ber1.jpg',
      detailImage: '/images/dine/details/ber2.jpg',
      category: 'Fast Food',
      contact: '02-123-4569',
      products: 'Burgers, Fries, Soft Drinks',
      description: 'ร้านอาหารฟาสต์ฟู้ดที่มีเมนูยอดนิยมอย่างเบอร์เกอร์ เฟรนช์ฟรายส์ และเครื่องดื่ม'
    },
    {
      name: 'Subway',
      location: 'Terminal 1, Floor 2, Food Court Zone D',
      locationType: 'public',
      hours: '06:00 - 22:00',
      image: '/images/dine/previews/s1.png',
      detailImage: '/images/dine/details/s2.jpg',
      category: 'Fast Food',
      contact: '02-123-4570',
      products: 'Sandwiches, Salads, Drinks',
      description: 'ร้านแซนด์วิชที่มีเมนูยอดนิยมอย่างแซนด์วิช สลัด และเครื่องดื่ม'
    },
    {
      name: 'Starbucks',
      location: 'Terminal 2, Floor 3, Lounge Area',
      locationType: 'transit',
      hours: '05:00 - 23:00',
      image: '/images/dine/previews/st1.png',
      detailImage: '/images/dine/details/st2.jpg',
      category: 'Cafe',
      contact: '02-567-8901',
      products: 'Coffee, Pastries, Sandwiches',
      description: 'ร้านกาแฟที่มีเมนูยอดนิยมอย่างกาแฟ ขนมอบ และแซนด์วิช'
    }
  ],
  'japanese-food': [
    {
      name: 'Sushi Express',
      location: 'Terminal 1, Floor 3, Food Court Zone F',
      locationType: 'public',
      hours: '10:00 - 22:00',
      image: '/images/dine/previews/su1.png',
      detailImage: '/images/dine/details/su2.jpg',
      category: 'อาหารญี่ปุ่น',
      contact: '02-345-6789',
      products: 'Sushi, Sashimi, Miso Soup',
      description: 'ร้านซูชิที่มีเมนูยอดนิยมอย่างซูชิ ซาชิมิ และซุปมิโสะ'
    },
    {
      name: 'Ramen House',
      location: 'Terminal 2, Floor 2, Food Court Zone G',
      locationType: 'transit',
      hours: '11:00 - 21:00',
      image: '/images/dine/previews/r1.jpg',
      detailImage: '/images/dine/details/ra2.jpg',
      category: 'อาหารญี่ปุ่น',
      contact: '02-654-3210',
      products: 'Ramen, Gyoza, Rice Bowls',
      description: 'ร้านราเมนที่มีเมนูยอดนิยมอย่างราเมน เกี๊ยวซ่า และข้าวหน้าต่างๆ'
    }
  ],
  'desserts-and-drinks': [
    {
      name: 'Swensen',
      location: 'Terminal 1, Floor 4, Food Court Zone H',
      locationType: 'public',
      hours: '10:00 - 22:00',
      image: '/images/dine/previews/sw1.jpg',
      detailImage: '/images/dine/details/sw2.jpg',
      category: 'Desserts',
      contact: '02-123-7890',
      products: 'Ice Cream, Sundaes, Milkshakes',
      description: 'ร้านไอศกรีมที่มีเมนูยอดนิยมอย่างไอศกรีม ซันเดย์ และมิลค์เชค'
    },
    {
      name: 'Mister Donut',
      location: 'Terminal 2, Floor 4, Food Court Zone I',
      locationType: 'transit',
      hours: '06:00 - 20:00',
      image: '/images/dine/previews/m1.png',
      detailImage: '/images/dine/details/m2.jpg',
      category: 'Desserts',
      contact: '02-456-7890',
      products: 'Donuts, Coffee, Tea',
      description: 'ร้านโดนัทที่มีเมนูยอดนิยมอย่างโดนัท กาแฟ และชา'
    }
  ]
};