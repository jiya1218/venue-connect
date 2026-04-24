const vendors = [
  { name: "Photographers", image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&q=80" },
  { name: "Makeup Artists", image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&q=80" },
  { name: "Mehndi Artists", image: "https://images.unsplash.com/photo-1610041321427-8c710f5451ff?w=400&q=80" },
  { name: "Bands", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80" },
  { name: "Decorators", image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=80" },
  { name: "Caterers", image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=400&q=80" },
  { name: "Event Planners", image: "https://images.unsplash.com/photo-1505366518421-18cece5ebf4c?w=400&q=80" },
  { name: "Bridal Wear", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80" },
  { name: "Groom Wear", image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e5?w=400&q=80" },
  { name: "Invitations", image: "https://images.unsplash.com/photo-1572620786938-1a5568112668?w=400&q=80" },
  { name: "DJ", image: "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=400&q=80" },
  { name: "Florists", image: "https://images.unsplash.com/photo-1490750967868-88df5691cc5a?w=400&q=80" },
  { name: "Wedding Photographers", image: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&q=80" },
  { name: "Jewellers", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80" },
  { name: "Choreographers", image: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=400&q=80" },
  { name: "Tent Houses", image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&q=80" },
  { name: "Astrologers", image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80" },
  { name: "Cakes", image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&q=80" },
  { name: "Entertainers", image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=400&q=80" },
  { name: "Gifts", image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&q=80" },
  { name: "Magicians", image: "https://images.unsplash.com/photo-1593642533144-3d62aa4783ec?w=400&q=80" },
  { name: "Wedding Planners", image: "https://images.unsplash.com/photo-1522413452208-996ff3f3e740?w=400&q=80" }
];

async function checkImages() {
  for (const v of vendors) {
    try {
      const res = await fetch(v.image, { method: 'HEAD' });
      if (!res.ok) {
        console.log(`Missing Image - ${v.name}: ${res.status}`);
      }
    } catch (e) {
      console.log(`Error checking Image - ${v.name}: ${e.message}`);
    }
  }
}
checkImages();
