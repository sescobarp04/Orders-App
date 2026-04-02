/**
 * SESCOP Email Catalog Generator
 * Generates a professional HTML email + PDF catalog for Detroit market expansion
 * 
 * Usage: node generate-email-catalog.js
 * Output: 
 *   - catalog-email-EN.html (English email)
 *   - catalog-email-ES.html (Spanish email)
 *   - catalog-full.pdf (Visual PDF catalog)
 *   - catalog-product-list.pdf (Text PDF list)
 */

const fs = require('fs');
const path = require('path');
const { jsPDF } = require('jspdf');

// ============================================
// COMPANY INFORMATION
// ============================================
const COMPANY = {
  name: 'Sescop Investments LLC',
  brandName: 'SESCOP',
  fullName: 'Select Export & Supply Company of Products',
  slogan: {
    EN: 'Latin Flavors & Everyday Essentials',
    ES: 'Sabores Latinos y Esenciales del Día a Día'
  },
  phone: '(321) 447-0472',
  whatsapp: '+13214470472',
  email: 'dayrin.woodson@sescopllc.com',
  location: {
    EN: 'Based in Florida — Serving Indiana, Michigan & beyond',
    ES: 'Basados en Florida — Sirviendo a Indiana, Michigan y más allá'
  },
  detroitMessage: {
    EN: 'Now serving the Detroit Metropolitan Area!',
    ES: '¡Ahora servimos al Área Metropolitana de Detroit!'
  },
};

// ============================================
// BRAND COLORS (from logo)
// ============================================
const COLORS = {
  primary: '#2B5F8A',      // Dark blue from logo
  primaryLight: '#4FA3D1',  // Light blue from logo
  accent: '#E8963E',        // Warm orange accent
  dark: '#2C3E50',          // Dark text
  medium: '#5D6D7E',        // Medium gray text
  light: '#ECF0F1',         // Light background
  white: '#FFFFFF',
  warmBg: '#FFF8F0',        // Warm background for categories
  success: '#27AE60',       // Green for CTA
};

// ============================================
// CATEGORY DEFINITIONS
// ============================================
const CATEGORIES = [
  {
    id: 'bakery',
    name: { EN: 'Bakery & Pastries', ES: 'Panadería y Pastelería' },
    emoji: '🥐',
    description: {
      EN: 'Authentic Colombian & Venezuelan baked goods — golden empanadas, tequeños, and traditional breads.',
      ES: 'Productos de panadería auténticos colombianos y venezolanos — empanadas, tequeños y panes tradicionales.'
    },
    keywords: ['empanada', 'buñuelo', 'bunuelo', 'teque', 'pandebono', 'pandeyuca', 'arepa', 'almojabana', 'cheese bread', 'cheese fritter', 'corn cake'],
    heroCount: 4,
  },
  {
    id: 'latin-foods',
    name: { EN: 'Latin Foods', ES: 'Alimentos Latinos' },
    emoji: '🥘',
    description: {
      EN: 'Traditional Latin American favorites including chorizos, yuca bites, plantains, and specialty sides.',
      ES: 'Favoritos tradicionales latinoamericanos incluyendo chorizos, bocados de yuca, plátanos y acompañantes.'
    },
    keywords: ['chorizo', 'sausage', 'yuca bite', 'croqueta de yuca', 'platano', 'plantain', 'toston', 'patacon', 'papa criolla', 'yellow potato', 'arracacha', 'cassava', 'chow mein', 'curtido', 'flor de izote', 'morcilla', 'panela'],
    heroCount: 4,
  },
  {
    id: 'fruit-pulps',
    name: { EN: 'Fruit Pulps', ES: 'Pulpas de Fruta' },
    emoji: '🍹',
    description: {
      EN: 'Tropical fruit pulps in pouches and jugs — perfect for fresh juices and cocktails.',
      ES: 'Pulpas de frutas tropicales en bolsas y jarras — perfectas para jugos frescos y cócteles.'
    },
    keywords: ['pulpa', 'fruit pulp', 'garrafa', 'jug', 'pouch'],
    heroCount: 3,
  },
  {
    id: 'frozen-fruits',
    name: { EN: 'Frozen Fruits', ES: 'Frutas Congeladas' },
    emoji: '🍈',
    description: {
      EN: 'Premium whole frozen tropical fruits — soursop, passion fruit, lime, and more.',
      ES: 'Frutas tropicales enteras congeladas de primera calidad — guanábana, maracuyá, limón y más.'
    },
    keywords: ['fruta entera', 'fruta congelada', 'frozen', 'whole fruit', 'rodaja', 'slices', 'bucket', 'tarro'],
    heroCount: 2,
  },
  {
    id: 'desserts',
    name: { EN: 'Desserts', ES: 'Postres' },
    emoji: '🍮',
    description: {
      EN: 'Authentic Latin desserts — tres leches, flan, and specialty sweets.',
      ES: 'Postres latinos auténticos — tres leches, flan y dulces especiales.'
    },
    keywords: ['postre', 'tres leches', 'cuatro leches', 'flan', 'mousse', 'natas', 'churro dulce'],
    heroCount: 2,
  },
  {
    id: 'beverages',
    name: { EN: 'Beverages', ES: 'Bebidas' },
    emoji: '🥤',
    description: {
      EN: 'Popular Latin American sodas, juices, and wellness drinks.',
      ES: 'Refrescos, jugos y bebidas de bienestar populares de Latinoamérica.'
    },
    keywords: ['postobon', 'hit ', 'hit-', 'pony malta', 'colombiana', 'detox', 'fusion', 'glow', 'bliss', 'mosh', 'beverage', 'drink', 'water'],
    heroCount: 3,
  },
  {
    id: 'granos',
    name: { EN: 'Grains', ES: 'Granos' },
    emoji: '🌾',
    description: {
      EN: 'Essential Latin American grains — rice, beans, and sugars.',
      ES: 'Granos esenciales latinoamericanos — arroz, frijoles y azúcares.'
    },
    keywords: ['frijol', 'beans', 'arroz', 'rice', 'azucar', 'sugar', 'habas'],
    heroCount: 2,
  },
  {
    id: 'soups',
    name: { EN: 'Soups', ES: 'Sopas' },
    emoji: '🍲',
    description: {
      EN: 'Traditional hearty soups and creams, ready to heat and serve.',
      ES: 'Sopas y cremas tradicionales consistentes, listas para calentar y servir.'
    },
    keywords: ['sopa', 'soup', 'ajiaco', 'sancocho', 'crema'],
    heroCount: 2,
  },
  {
    id: 'cafe',
    name: { EN: 'Coffee', ES: 'Café' },
    emoji: '☕',
    description: {
      EN: 'Premium Latin American coffee blends.',
      ES: 'Mezclas de café latinoamericano de primera calidad.'
    },
    keywords: ['cafe ', 'coffee', 'aguila roja'],
    heroCount: 2,
  },
  {
    id: 'snacks',
    name: { EN: 'Traditional Sweets & Snacks', ES: 'Dulces y Botanas Tradicionales' },
    emoji: '🍪',
    description: {
      EN: 'Authentic Latin American snacks, cookies, and traditional treats.',
      ES: 'Botanas, galletas y dulces tradicionales auténticos de Latinoamérica.'
    },
    keywords: ['achiras', 'arequipe', 'beso de negra', 'bocadillo', 'cocosette', 'bonbonbum', 'bon bon bum', 'delight', 'cortado de leche', 'deditos', 'frunas', 'gomitas', 'manjar blanco', 'milo', 'natilla', 'oblea', 'barrilete', 'supercoco', 'torta negra', 'yogueta'],
    heroCount: 3,
  },
  {
    id: 'juegos',
    name: { EN: 'Games', ES: 'Juegos' },
    emoji: '🎲',
    description: {
      EN: 'Traditional tabletop games for the whole family.',
      ES: 'Juegos de mesa tradicionales para toda la familia.'
    },
    keywords: ['parques', 'juego', 'game'],
    heroCount: 1,
  },
];

const TEXT = {
  EN: {
    dear: 'Dear Valued Partner,',
    intro1: `<strong>${COMPANY.name}</strong> is a Florida-based distributor specializing in <strong>authentic Latin American frozen foods and beverages</strong>. We are excited to announce that we are now expanding our distribution to the <strong>Detroit metropolitan area</strong>.`,
    intro2: `We offer over <strong>{count}+ products</strong> across ${CATEGORIES.length} categories, perfect for restaurants, supermarkets, and specialty stores looking to bring the best Latin American flavors to their customers.`,
    intro3: `Below is a preview of our product lines. <strong>Contact us for wholesale pricing and to set up your first order.</strong>`,
    ready: 'Ready to Order?',
    orderCTA: 'Contact us today for product pricing, samples, and to set up your wholesale account.',
    phone: 'Phone',
    whatsapp: 'WhatsApp',
    email: 'Email',
    location: 'Location',
    footer1: '📎 <em>Full product catalog attached — {imgCount} products with images + complete list of {count}+ items</em>',
    footer2: '🔄 Know someone who might be interested? Feel free to forward this email!',
    moreProducts: '+ {count} more products in this category — see full catalog attached',
    productLines: 'Our Product Lines',
    linesSubtitle: 'Serving Indiana, Michigan, Florida & beyond',
    businessTogether: "Let's Do Business Together",
    closing: "We offer competitive wholesale pricing for restaurants, supermarkets, and specialty stores. Contact us to set up your account and place your order.",
    productList: 'Complete Product List',
    wholesaleCatalog: 'Wholesale Catalog',
    productName: 'PRODUCT NAME',
    packaging: 'PACKAGING',
    uncategorized: 'Other/Uncategorized'
  },
  ES: {
    dear: 'Estimado Socio Comercial,',
    intro1: `<strong>${COMPANY.name}</strong> es un distribuidor con sede en Florida especializado en <strong>alimentos congelados y bebidas auténticas de Latinoamérica</strong>. Nos emociona anunciar que estamos expandiendo nuestra distribución al <strong>área metropolitana de Detroit</strong>.`,
    intro2: `Ofrecemos más de <strong>{count}+ productos</strong> en ${CATEGORIES.length} categorías, ideales para restaurantes, supermercados y tiendas especializadas que buscan llevar los mejores sabores latinos a sus clientes.`,
    intro3: `A continuación encontrará un avance de nuestras líneas de productos. <strong>Contáctenos para obtener precios mayoristas y organizar su primer pedido.</strong>`,
    ready: '¿Listo para ordenar?',
    orderCTA: 'Contáctenos hoy para precios de productos, muestras y para abrir su cuenta de mayorista.',
    phone: 'Teléfono',
    whatsapp: 'WhatsApp',
    email: 'Correo',
    location: 'Ubicación',
    footer1: '📎 <em>Catálogo completo adjunto — {imgCount} productos con fotos + lista completa de {count}+ artículos</em>',
    footer2: '🔄 ¿Conoce a alguien interesado? ¡Siéntase libre de reenviar este correo!',
    moreProducts: '+ {count} productos más en esta categoría — vea el catálogo completo adjunto',
    productLines: 'Nuestras Líneas de Productos',
    linesSubtitle: 'Sirviendo a Indiana, Michigan, Florida y más allá',
    businessTogether: 'Hagamos Negocios Juntos',
    closing: 'Ofrecemos precios mayoristas competitivos para restaurantes, supermercados y tiendas especializadas. Contáctenos para configurar su cuenta y realizar su pedido.',
    productList: 'Lista Completa de Productos',
    wholesaleCatalog: 'Catálogo Mayorista',
    productName: 'NOMBRE DEL PRODUCTO',
    packaging: 'EMPAQUE',
    uncategorized: 'Otros / Sin Categoría'
  }
};

// Helper to strip emojis and special characters for PDF
function sanitizeForPDF(text) {
  if (!text) return '';
  // Remove emojis and non-standard characters that cause encoding issues in PDF
  return text.replace(/[^\x00-\x7F]/g, "").trim();
}

function formatProductName(name) {
  if (!name) return '';
  if (name.includes('/')) {
    const parts = name.split('/');
    // Assuming part 1 is Spanish and part 2 is English (often the case in the data)
    // We want "English / Spanish"
    const es = parts[0].trim();
    const en = parts[1].trim();
    return `${en} / ${es}`;
  }
  return name;
}

function loadProducts() {
  const raw = fs.readFileSync(path.join(__dirname, 'data', 'products.json'), 'utf8');
  return JSON.parse(raw);
}

function productHasImage(product) {
  if (!product.image) return false;
  const imagePath = path.join(__dirname, 'public', product.image);
  return fs.existsSync(imagePath);
}

function getImageBase64(product) {
  if (!product.image) return null;
  const imagePath = path.join(__dirname, 'public', product.image);
  if (!fs.existsSync(imagePath)) return null;
  const ext = path.extname(imagePath).slice(1).toLowerCase();
  const mime = ext === 'jpg' ? 'jpeg' : ext;
  const data = fs.readFileSync(imagePath);
  return `data:image/${mime};base64,${data.toString('base64')}`;
}

function getLogoBase64() {
  const logoPath = path.join(__dirname, 'public', 'images', 'logo-sescop.jpg');
  if (!fs.existsSync(logoPath)) {
    console.error('Logo not found at', logoPath);
    return '';
  }
  const data = fs.readFileSync(logoPath);
  return `data:image/jpeg;base64,${data.toString('base64')}`;
}

function categorizeProduct(product) {
  const name = product.name.toLowerCase();
  const sku = (product.sku || '').toLowerCase();

  for (const cat of CATEGORIES) {
    // Check exclude keywords first
    if (cat.excludeKeywords) {
      const excluded = cat.excludeKeywords.some(kw => name.includes(kw.toLowerCase()));
      if (excluded) continue;
    }

    const matched = cat.keywords.some(kw => name.includes(kw.toLowerCase()) || sku.includes(kw.toLowerCase()));
    if (matched) return cat.id;
  }

  return 'other';
}

function organizeByCategory(products) {
  const grouped = {};
  CATEGORIES.forEach(cat => { grouped[cat.id] = []; });
  grouped['other'] = [];

  products.forEach(p => {
    const catId = categorizeProduct(p);
    grouped[catId].push(p);
  });

  return grouped;
}

// ============================================
// HTML EMAIL GENERATOR (Gmail-compatible)
// ============================================

function generateCategoryShowcase(cat, products, logoBase64, lang = 'EN') {
  const t = TEXT[lang];
  const withImages = products.filter(p => productHasImage(p));
  const heroProducts = withImages.slice(0, cat.heroCount);

  if (heroProducts.length === 0) return '';

  const productCards = heroProducts.map(p => {
    const img = getImageBase64(p);
    // Clean product name - remove packaging details for cleaner display
    const fullName = formatProductName(p.name);
    const displayName = fullName.split('(')[0].trim();

    return `
      <td style="width:${Math.floor(100 / heroProducts.length)}%;padding:8px;vertical-align:top;text-align:center;">
        <div style="background:#FFFFFF;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.1);border:1px solid #E8E8E8;">
          <div style="width:100%;height:220px;overflow:hidden;background:#FFFFFF;display:flex;align-items:center;justify-content:center;">
             <img src="${img}" alt="${displayName}" style="max-width:96%;max-height:210px;width:auto;height:auto;object-fit:contain;display:block;" />
           </div>
           <div style="padding:10px 8px;">
             <p style="margin:0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;color:${COLORS.dark};font-weight:600;line-height:1.3;">${displayName}</p>
          </div>
        </div>
      </td>
    `;
  }).join('');

  return `
    <!-- Category: ${cat.name[lang]} -->
    <tr>
      <td style="padding:25px 30px 5px 30px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td style="padding-bottom:8px;">
              <span style="font-size:24px;vertical-align:middle;">${cat.emoji}</span>
              <span style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:20px;font-weight:700;color:${COLORS.primary};vertical-align:middle;margin-left:8px;">${cat.name[lang]}</span>
            </td>
          </tr>
          <tr>
            <td>
              <p style="margin:0 0 12px 0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;color:${COLORS.medium};line-height:1.5;">${cat.description[lang]}</p>
            </td>
          </tr>
          <tr>
            <td>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  ${productCards}
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding-top:8px;">
              <p style="margin:0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;color:${COLORS.primaryLight};font-style:italic;">${t.moreProducts.replace('{count}', products.length - heroProducts.length)}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:10px 30px;">
        <div style="border-bottom:1px solid #E8E8E8;"></div>
      </td>
    </tr>
  `;
}

function generateEmailHTML(groupedProducts, lang = 'EN') {
  const logoBase64 = getLogoBase64();
  const t = TEXT[lang];

  let categoryShowcases = '';
  for (const cat of CATEGORIES) {
    const products = groupedProducts[cat.id];
    if (products.length > 0) {
      categoryShowcases += generateCategoryShowcase(cat, products, logoBase64, lang);
    }
  }

  const totalProducts = Object.values(groupedProducts).reduce((sum, arr) => sum + arr.length, 0);
  const totalWithImages = Object.values(groupedProducts).reduce((sum, arr) => sum + arr.filter(p => productHasImage(p)).length, 0);

  return `<!DOCTYPE html>
<html lang="${lang.toLowerCase()}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${COMPANY.brandName} - ${t.productLines}</title>
  <!--[if mso]>
  <style type="text/css">
    table { border-collapse: collapse; }
    td { font-family: Arial, sans-serif; }
  </style>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#F0F2F5;font-family:'Helvetica Neue',Arial,sans-serif;">

<!-- Email wrapper -->
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#F0F2F5;">
  <tr>
    <td align="center" style="padding:20px 10px;">
      
      <!-- Main container -->
      <table role="presentation" width="650" cellspacing="0" cellpadding="0" border="0" style="max-width:650px;width:100%;background-color:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
        
        <!-- HEADER -->
        <tr>
          <td style="background:linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%);padding:30px;text-align:center;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td align="center" style="padding-bottom:15px;">
                  <img src="${logoBase64}" alt="SESCOP Logo" style="width:140px;height:140px;border-radius:50%;border:4px solid rgba(255,255,255,0.3);object-fit:cover;" />
                </td>
              </tr>
              <tr>
                <td align="center">
                  <h1 style="margin:0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:26px;font-weight:800;color:#FFFFFF;letter-spacing:1px;">${COMPANY.brandName}</h1>
                  <p style="margin:5px 0 0 0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;color:rgba(255,255,255,0.85);letter-spacing:2px;text-transform:uppercase;">${COMPANY.slogan[lang]}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- DETROIT ANNOUNCEMENT BANNER -->
        <tr>
          <td style="background:${COLORS.accent};padding:14px 30px;text-align:center;">
            <p style="margin:0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:16px;font-weight:700;color:#FFFFFF;">
              🎉 ${COMPANY.detroitMessage[lang]}
            </p>
          </td>
        </tr>

        <!-- INTRO SECTION -->
        <tr>
          <td style="padding:30px 30px 15px 30px;">
            <p style="margin:0 0 12px 0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:15px;color:${COLORS.dark};line-height:1.6;">
              ${t.dear}
            </p>
            <p style="margin:0 0 12px 0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:15px;color:${COLORS.dark};line-height:1.6;">
              ${t.intro1}
            </p>
            <p style="margin:0 0 12px 0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:15px;color:${COLORS.dark};line-height:1.6;">
              ${t.intro2.replace('{count}', totalProducts)}
            </p>
            <p style="margin:0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:15px;color:${COLORS.dark};line-height:1.6;">
              ${t.intro3}
            </p>
          </td>
        </tr>

        <tr>
          <td style="padding:5px 30px 10px 30px;">
            <div style="border-bottom:2px solid ${COLORS.primaryLight};"></div>
          </td>
        </tr>

        <!-- CATEGORY SHOWCASES -->
        ${categoryShowcases}

        <!-- CTA SECTION -->
        <tr>
          <td style="padding:25px 30px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%);border-radius:12px;">
              <tr>
                <td style="padding:25px 30px;text-align:center;">
                  <h2 style="margin:0 0 10px 0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:22px;font-weight:700;color:#FFFFFF;">${t.ready}</h2>
                  <p style="margin:0 0 20px 0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;color:rgba(255,255,255,0.9);line-height:1.5;">${t.orderCTA}</p>
                  
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                    <tr>
                      <td style="padding:5px 0;">
                        <span style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:15px;color:#FFFFFF;">📞 ${t.phone}: <strong>${COMPANY.phone}</strong></span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:5px 0;">
                        <span style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:15px;color:#FFFFFF;">💬 ${t.whatsapp}: <strong>${COMPANY.whatsapp}</strong></span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:5px 0;">
                        <span style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:15px;color:#FFFFFF;">✉️ ${t.email}: <strong>${COMPANY.email}</strong></span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="background:#F8F9FA;padding:20px 30px;border-top:1px solid #E8E8E8;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td align="center">
                  <p style="margin:0 0 8px 0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;color:${COLORS.medium};line-height:1.5;">
                    📍 ${t.location}: ${COMPANY.location[lang]}
                  </p>
                  <p style="margin:0 0 8px 0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;color:${COLORS.medium};line-height:1.5;">
                    ${t.footer1.replace('{imgCount}', totalWithImages).replace('{count}', totalProducts)}
                  </p>
                  <p style="margin:0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;color:${COLORS.primaryLight};font-weight:600;">
                    ${t.footer2}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
      <!-- End main container -->

    </td>
  </tr>
</table>
<!-- End email wrapper -->

</body>
</html>`;
}

// ============================================
// PDF CATALOG GENERATOR (Visual catalog with images)
// ============================================

function generateCatalogHTML(groupedProducts) {
  const logoBase64 = getLogoBase64();
  const t = TEXT['EN']; // Base for catalog headers

  let categoryPages = '';

  for (const cat of CATEGORIES) {
    const products = groupedProducts[cat.id];
    const withImages = products.filter(p => productHasImage(p));

    if (withImages.length === 0) continue;

    // Create product grid - 3 products per row for larger images
    let productGrid = '';
    for (let i = 0; i < withImages.length; i += 3) {
      const row = withImages.slice(i, i + 3);
      const cells = row.map(p => {
        const img = getImageBase64(p);
        const displayName = formatProductName(p.name);
        const packaging = p.quantity_unit || '';

        return `
          <td style="width:33.33%;padding:10px;vertical-align:top;text-align:center;">
            <div style="background:#FFFFFF;border-radius:14px;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,0.1);border:1px solid #EEEEEE;height:100%;">
              <div style="width:100%;height:200px;overflow:hidden;background:#FFFFFF;display:flex;align-items:center;justify-content:center;padding-top:10px;">
                <img src="${img}" alt="${p.name}" style="max-width:94%;max-height:180px;width:auto;height:auto;object-fit:contain;display:block;" />
              </div>
              <div style="padding:12px 6px;">
                <p style="margin:0 0 5px 0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;color:#2C3E50;font-weight:700;line-height:1.3;">${displayName}</p>
                <p style="margin:0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;color:#7F8C8D;">${packaging}</p>
              </div>
            </div>
          </td>
        `;
      }).join('');

      // Fill remaining cells in row
      const emptyCells = Array(3 - row.length).fill('<td style="width:33.33%;padding:10px;"></td>').join('');

      productGrid += `<tr>${cells}${emptyCells}</tr>`;
    }

    categoryPages += `
      <!-- Category Section: ${cat.name['EN']} / ${cat.name['ES']} -->
      <div style="page-break-inside:avoid;margin-bottom:30px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td style="padding:12px 20px;background:linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryLight});border-radius:10px 10px 0 0;">
              <span style="font-size:22px;vertical-align:middle;">${cat.emoji}</span>
              <span style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:18px;font-weight:700;color:#FFFFFF;vertical-align:middle;margin-left:8px;">${cat.name['EN']} / ${cat.name['ES']}</span>
              <span style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;color:rgba(255,255,255,0.9);float:right;line-height:30px;">${withImages.length} products</span>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 20px;background:#F8F9FA;border-radius:0 0 10px 10px;border:1px solid #E8E8E8;border-top:none;">
              <p style="margin:0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;color:${COLORS.medium};line-height:1.4;">${cat.description['EN']} / ${cat.description['ES']}</p>
            </td>
          </tr>
        </table>
        
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:10px;">
          ${productGrid}
        </table>
      </div>
    `;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${COMPANY.brandName} Product Catalog</title>
  <style>
    @media print {
      body { margin: 0; }
      .page-break { page-break-before: always; }
    }
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      margin: 0;
      padding: 0;
      background: #FFFFFF;
      color: #2C3E50;
    }
  </style>
</head>
<body>

  <!-- COVER PAGE -->
  <div style="min-height:95vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;background:linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 50%, #FFFFFF 50%);padding:40px;">
    <div style="background:#FFFFFF;border-radius:24px;padding:50px 60px;box-shadow:0 20px 60px rgba(0,0,0,0.15);max-width:550px;width:100%;">
      <img src="${logoBase64}" alt="SESCOP Logo" style="width:180px;height:180px;border-radius:50%;margin-bottom:25px;border:4px solid ${COLORS.primaryLight};" />
      <h1 style="margin:0;font-size:36px;font-weight:800;color:${COLORS.primary};letter-spacing:2px;">PRODUCT CATALOG</h1>
      <h2 style="margin:5px 0 0 0;font-size:24px;font-weight:700;color:${COLORS.primaryLight};">CATÁLOGO DE PRODUCTOS</h2>
      <p style="margin:15px 0 0 0;font-size:14px;color:${COLORS.primaryLight};text-transform:uppercase;letter-spacing:3px;">${COMPANY.slogan['EN']} / ${COMPANY.slogan['ES']}</p>
      <div style="margin:25px 0;border-bottom:2px solid ${COLORS.primaryLight};width:80px;margin-left:auto;margin-right:auto;"></div>
      <p style="margin:0 0 5px 0;font-size:16px;color:${COLORS.dark};font-weight:600;">Authentic Latin American Products</p>
      <p style="margin:0 0 5px 0;font-size:14px;color:${COLORS.medium};">Frozen Foods • Beverages • Specialty Items</p>
      <p style="margin:20px 0 0 0;font-size:13px;color:${COLORS.accent};font-weight:600;">📞 ${COMPANY.phone}  |  ✉️ ${COMPANY.email}</p>
    </div>
  </div>

  <!-- CATALOG CONTENT -->
  <div style="padding:30px 25px;max-width:800px;margin:0 auto;">
    
    <div style="text-align:center;margin-bottom:30px;">
      <h2 style="margin:0;font-size:24px;color:${COLORS.primary};">${t.productLines} / Nuestras Líneas</h2>
      <p style="margin:5px 0;font-size:14px;color:${COLORS.medium};">${t.linesSubtitle}</p>
    </div>

    ${categoryPages}

  </div>

  <!-- CONTACT PAGE -->
  <div style="background:linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryLight});padding:50px 30px;text-align:center;margin-top:30px;">
    <h2 style="margin:0 0 10px 0;font-size:28px;color:#FFFFFF;font-weight:700;">${t.businessTogether}</h2>
    <h3 style="margin:0 0 20px 0;font-size:22px;color:rgba(255,255,255,0.9);font-weight:700;">Hagamos Negocios Juntos</h3>
    <p style="margin:0 0 25px 0;font-size:16px;color:rgba(255,255,255,0.9);max-width:500px;margin-left:auto;margin-right:auto;line-height:1.6;">
      ${t.closing}<br><br>
      Ofrecemos precios mayoristas competitivos para restaurantes, supermercados y tiendas especializadas. Contáctenos para configurar su cuenta y realizar su primer pedido.
    </p>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="background:rgba(255,255,255,0.15);border-radius:12px;padding:20px 40px;">
      <tr><td style="padding:8px 0;font-size:16px;color:#FFFFFF;">📞 ${t.phone}: <strong>${COMPANY.phone}</strong></td></tr>
      <tr><td style="padding:8px 0;font-size:16px;color:#FFFFFF;">💬 WhatsApp: <strong>${COMPANY.whatsapp}</strong></td></tr>
      <tr><td style="padding:8px 0;font-size:16px;color:#FFFFFF;">✉️ ${t.email}: <strong>${COMPANY.email}</strong></td></tr>
      <tr><td style="padding:8px 0;font-size:14px;color:rgba(255,255,255,0.8);">📍 ${COMPANY.location['EN']}</td></tr>
    </table>
  </div>

</body>
</html>`;
}

// ============================================
// PDF CATALOG GENERATOR (jspdf)
// ============================================

function setupPDFdoc(doc) {
  // Add a helper for hex to rgb if needed or just use hex
  // jspdf support for hex is doc.setFillColor('#hex')
  return doc;
}

function generateCatalogPDF(groupedProducts) {
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4'
  });

  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentWidth = pageWidth - (margin * 2);

  // 1. COVER PAGE
  // Background
  doc.setFillColor(43, 95, 138); // COLORS.primary
  doc.rect(0, 0, pageWidth, pageHeight * 0.4, 'F');

  // Logo
  const logoPath = path.join(__dirname, 'public', 'images', 'logo-sescop.jpg');
  if (fs.existsSync(logoPath)) {
    const logoData = fs.readFileSync(logoPath).toString('base64');
    doc.addImage(logoData, 'JPEG', (pageWidth / 2) - 25, (pageHeight * 0.2) - 25, 50, 50);
  }

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.text('PRODUCT CATALOG', pageWidth / 2, pageHeight * 0.43, { align: 'center' });
  doc.text('CATÁLOGO DE PRODUCTOS', pageWidth / 2, pageHeight * 0.47, { align: 'center' });

  doc.setTextColor(79, 163, 209); // COLORS.primaryLight
  doc.setFontSize(10);
  doc.text(`${COMPANY.slogan.EN.toUpperCase()} / ${COMPANY.slogan.ES.toUpperCase()}`, pageWidth / 2, pageHeight * 0.51, { align: 'center' });

  doc.setTextColor(44, 62, 80); // COLORS.dark
  doc.setFontSize(14);
  doc.text('Authentic Latin American Products', pageWidth / 2, pageHeight * 0.6, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(93, 109, 126); // COLORS.medium
  doc.setFontSize(10);
  doc.text('Frozen Foods • Beverages • Specialty Items', pageWidth / 2, pageHeight * 0.64, { align: 'center' });

  doc.setTextColor(232, 150, 62); // COLORS.accent
  doc.setFont('helvetica', 'bold');
  doc.text(`${COMPANY.phone} | ${COMPANY.email}`, pageWidth / 2, pageHeight * 0.75, { align: 'center' });

  // 2. CATEGORY PAGES
  for (const cat of CATEGORIES) {
    const products = groupedProducts[cat.id];
    const withImages = products.filter(p => productHasImage(p));

    if (withImages.length === 0) continue;

    doc.addPage();
    let y = 25;

    // Category Header
    doc.setFillColor(43, 95, 138); // COLORS.primary
    doc.rect(margin, y, contentWidth, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(`${sanitizeForPDF(cat.name.EN)} / ${sanitizeForPDF(cat.name.ES)}`, margin + 5, y + 10);

    y += 22;
    doc.setTextColor(93, 109, 126); // COLORS.medium
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const descText = `${cat.description.EN} / ${cat.description.ES}`;
    const descLines = doc.splitTextToSize(descText, contentWidth);
    doc.text(descLines, margin, y);
    y += (descLines.length * 4) + 5;

    // Product Grid
    const colWidth = contentWidth / 3;
    const imgSize = 35;
    let currentX = margin;

    for (let i = 0; i < withImages.length; i++) {
      const p = withImages[i];

      // Check if we need a new page
      if (y > pageHeight - 60) {
        doc.addPage();
        y = 25;
      }

      // Draw Item
      const imgPath = path.join(__dirname, 'public', p.image);
      try {
        const imgData = fs.readFileSync(imgPath).toString('base64');
        const imgFormat = p.image.toLowerCase().endsWith('.png') ? 'PNG' : 'JPEG';

        // Use jsPDF native method to get properties
        const props = doc.getImageProperties(imgData);
        const originalRatio = props.width / props.height;

        let renderWidth = imgSize;
        let renderHeight = imgSize;

        // Adjust and center
        if (originalRatio > 1) { // Landscape
          renderHeight = imgSize / originalRatio;
        } else { // Portrait
          renderWidth = imgSize * originalRatio;
        }

        const offsetX = (colWidth - renderWidth) / 2;
        const offsetY = (imgSize - renderHeight) / 2;

        doc.addImage(imgData, imgFormat, currentX + offsetX, y + offsetY, renderWidth, renderHeight);
      } catch (e) {
        console.error(`Error processing image ${p.image}:`, e.message);
      }

      doc.setTextColor(44, 62, 80);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      const displayName = formatProductName(p.name);
      const nameLines = doc.splitTextToSize(displayName, colWidth - 5);
      doc.text(nameLines, currentX + (colWidth / 2), y + imgSize + 5, { align: 'center' });

      doc.setTextColor(149, 165, 166);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.text(p.quantity_unit || '', currentX + (colWidth / 2), y + imgSize + 5 + (nameLines.length * 4), { align: 'center' });

      // Move to next column/row
      if ((i + 1) % 3 === 0) {
        currentX = margin;
        y += imgSize + 25;
      } else {
        currentX += colWidth;
      }
    }
  }

  // 3. CONTACT FOOTER on every page could be added, but let's just add a final contact page if needed
  doc.addPage();
  doc.setFillColor(43, 95, 138);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text("Let's Do Business Together", pageWidth / 2, pageHeight * 0.3, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  const closingLines = doc.splitTextToSize("We offer competitive wholesale pricing for restaurants, supermarkets, and specialty stores. Contact us to set up your account and place your first order.", contentWidth - 40);
  doc.text(closingLines, pageWidth / 2, pageHeight * 0.4, { align: 'center' });

  doc.rect(margin + 20, pageHeight * 0.55, contentWidth - 40, 40, 'S');
  doc.setFontSize(14);
  doc.text(`Phone: ${COMPANY.phone}`, pageWidth / 2, pageHeight * 0.62, { align: 'center' });
  doc.text(`WhatsApp: ${COMPANY.whatsapp}`, pageWidth / 2, pageHeight * 0.68, { align: 'center' });
  doc.text(`Email: ${COMPANY.email}`, pageWidth / 2, pageHeight * 0.74, { align: 'center' });
  doc.setFontSize(10);
  doc.text(COMPANY.location.EN, pageWidth / 2, pageHeight * 0.82, { align: 'center' });

  return Buffer.from(doc.output('arraybuffer'));
}

function generateProductListPDF(groupedProducts) {
  const doc = new jsPDF();
  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let y = 30;

  doc.setFillColor(43, 95, 138);
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('Complete Product List / Lista de Productos', margin, 25);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`${COMPANY.name} - Wholesale Catalog / Catálogo Mayorista`, margin, 32);

  y = 50;

  for (const cat of CATEGORIES) {
    const products = groupedProducts[cat.id];
    if (products.length === 0) continue;

    // Category Header
    if (y > pageHeight - 30) { doc.addPage(); y = 20; }
    doc.setFillColor(240, 242, 245);
    doc.rect(margin, y, pageWidth - (margin * 2), 8, 'F');
    doc.setTextColor(43, 95, 138);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(`${sanitizeForPDF(cat.name.EN)} / ${sanitizeForPDF(cat.name.ES)} (${products.length} products)`, margin + 2, y + 6);
    y += 12;

    // Table Header
    doc.setTextColor(127, 140, 141);
    doc.setFontSize(8);
    doc.text("PRODUCT NAME / NOMBRE DEL PRODUCTO", margin + 2, y);
    doc.text("PACKAGING / EMPAQUE", margin + 120, y);
    y += 4;
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;

    // Items
    doc.setTextColor(44, 62, 80);
    doc.setFont('helvetica', 'normal');
    for (const p of products) {
      if (y > pageHeight - 15) {
        doc.addPage();
        y = 20;
        // Repeat headers if needed, or just continue
      }

      doc.setFontSize(8);
      const displayName = formatProductName(p.name);
      const nameLines = doc.splitTextToSize(displayName, 110);
      doc.text(nameLines, margin + 2, y);
      doc.text(p.quantity_unit || 'N/A', margin + 120, y);

      y += (nameLines.length * 4) + 2;
      doc.setDrawColor(240, 240, 240);
      doc.line(margin, y - 1, pageWidth - margin, y - 1);
    }
    y += 5;
  }

  return Buffer.from(doc.output('arraybuffer'));
}

function generateProductListHTML(groupedProducts) {
  const logoBase64 = getLogoBase64();
  const t = TEXT['EN'];

  let listContent = '';

  for (const cat of CATEGORIES) {
    const products = groupedProducts[cat.id];
    if (products.length === 0) continue;

    const rows = products.map((p, idx) => {
      const displayName = formatProductName(p.name);
      const packaging = p.quantity_unit || 'N/A';
      const hasImg = productHasImage(p) ? '📷' : '';
      const bgColor = idx % 2 === 0 ? '#FFFFFF' : '#F8F9FA';

      return `
        <tr style="background:${bgColor};">
          <td style="padding:8px 12px;font-size:13px;color:${COLORS.dark};border-bottom:1px solid #F0F0F0;">${displayName}</td>
          <td style="padding:8px 12px;font-size:12px;color:${COLORS.medium};border-bottom:1px solid #F0F0F0;text-align:center;">${packaging}</td>
          <td style="padding:8px 12px;font-size:12px;color:${COLORS.medium};border-bottom:1px solid #F0F0F0;text-align:center;">${hasImg}</td>
        </tr>
      `;
    }).join('');

    listContent += `
      <div style="margin-bottom:25px;page-break-inside:avoid;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
          <tr>
            <td colspan="3" style="padding:12px 15px;background:linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryLight});color:#FFFFFF;">
              <span style="font-size:18px;vertical-align:middle;">${cat.emoji}</span>
              <span style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:16px;font-weight:700;vertical-align:middle;margin-left:8px;">${cat.name.EN} / ${cat.name.ES}</span>
              <span style="float:right;font-size:13px;opacity:0.85;line-height:24px;">${products.length} items</span>
            </td>
          </tr>
          <tr style="background:${COLORS.primary};">
            <td style="padding:8px 12px;font-size:12px;color:#FFFFFF;font-weight:600;text-transform:uppercase;letter-spacing:1px;width:60%;">Product Name / Nombre</td>
            <td style="padding:8px 12px;font-size:12px;color:#FFFFFF;font-weight:600;text-transform:uppercase;letter-spacing:1px;text-align:center;width:30%;">Packaging / Empaque</td>
            <td style="padding:8px 12px;font-size:12px;color:#FFFFFF;font-weight:600;text-transform:uppercase;letter-spacing:1px;text-align:center;width:10%;">Photo / Foto</td>
          </tr>
          ${rows}
        </table>
      </div>
    `;
  }

  // Handle uncategorized products
  const otherProducts = groupedProducts['other'] || [];
  if (otherProducts.length > 0) {
    const rows = otherProducts.map((p, idx) => {
      const bgColor = idx % 2 === 0 ? '#FFFFFF' : '#F8F9FA';
      const hasImg = productHasImage(p) ? '📷' : '';
      return `
        <tr style="background:${bgColor};">
          <td style="padding:8px 12px;font-size:13px;color:${COLORS.dark};border-bottom:1px solid #F0F0F0;">${p.name}</td>
          <td style="padding:8px 12px;font-size:12px;color:${COLORS.medium};border-bottom:1px solid #F0F0F0;text-align:center;">${p.quantity_unit || 'N/A'}</td>
          <td style="padding:8px 12px;font-size:12px;color:${COLORS.medium};border-bottom:1px solid #F0F0F0;text-align:center;">${hasImg}</td>
        </tr>
      `;
    }).join('');

    listContent += `
      <div style="margin-bottom:25px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
          <tr>
            <td colspan="3" style="padding:12px 15px;background:#95A5A6;color:#FFFFFF;">
              <span style="font-size:18px;vertical-align:middle;">📦</span>
              <span style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:16px;font-weight:700;vertical-align:middle;margin-left:8px;">Other Products</span>
              <span style="float:right;font-size:13px;opacity:0.85;line-height:24px;">${otherProducts.length} items</span>
            </td>
          </tr>
          <tr style="background:#7F8C8D;">
            <td style="padding:8px 12px;font-size:12px;color:#FFFFFF;font-weight:600;text-transform:uppercase;letter-spacing:1px;width:60%;">Product Name</td>
            <td style="padding:8px 12px;font-size:12px;color:#FFFFFF;font-weight:600;text-transform:uppercase;letter-spacing:1px;text-align:center;width:30%;">Packaging</td>
            <td style="padding:8px 12px;font-size:12px;color:#FFFFFF;font-weight:600;text-transform:uppercase;letter-spacing:1px;text-align:center;width:10%;">Photo</td>
          </tr>
          ${rows}
        </table>
      </div>
    `;
  }

  const totalProducts = Object.values(groupedProducts).reduce((sum, arr) => sum + arr.length, 0);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SESCOP - Complete Product List</title>
  <style>
    @media print {
      body { margin: 0; }
    }
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      margin: 0;
      padding: 0;
      background: #F5F5F5;
      color: #2C3E50;
    }
  </style>
</head>
<body>

  <!-- Header -->
  <div style="background:linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryLight});padding:25px 30px;text-align:center;">
    <img src="${logoBase64}" alt="SESCOP" style="width:80px;height:80px;border-radius:50%;border:3px solid rgba(255,255,255,0.3);margin-bottom:10px;" />
    <h1 style="margin:0;font-size:22px;color:#FFFFFF;font-weight:700;">Complete Product List</h1>
    <p style="margin:5px 0 0 0;font-size:13px;color:rgba(255,255,255,0.8);">${totalProducts} Products • Contact us for pricing</p>
  </div>

  <div style="padding:25px;max-width:800px;margin:0 auto;">
    ${listContent}
  </div>

  <!-- Footer -->
  <div style="background:${COLORS.primary};padding:20px;text-align:center;">
    <p style="margin:0 0 5px 0;font-size:14px;color:#FFFFFF;font-weight:600;">${COMPANY.name}</p>
    <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.8);">📞 ${COMPANY.phone}  |  ✉️ ${COMPANY.email}  |  💬 WhatsApp: ${COMPANY.whatsapp}</p>
  </div>

</body>
</html>`;
}

// ============================================
// MAIN EXECUTION
// ============================================

function main() {
  console.log('🚀 SESCOP Email Catalog Generator');
  console.log('================================\n');

  // 1. Load products
  console.log('📦 Loading products...');
  const products = loadProducts();
  console.log(`   Found ${products.length} products`);

  // 2. Check images
  const withImages = products.filter(p => productHasImage(p));
  console.log(`   ${withImages.length} products have images\n`);

  // 3. Categorize
  console.log('📂 Categorizing products...');
  const grouped = organizeByCategory(products);

  for (const cat of CATEGORIES) {
    const total = grouped[cat.id].length;
    const imgs = grouped[cat.id].filter(p => productHasImage(p)).length;
    console.log(`   ${cat.emoji} ${cat.name.EN}: ${total} products (${imgs} with images)`);
  }

  const otherCount = (grouped['other'] || []).length;
  if (otherCount > 0) {
    console.log(`   📦 Other/Uncategorized: ${otherCount} products`);
  }
  console.log('');

  // 4. Generate HTML emails (EN and ES)
  ['EN', 'ES'].forEach(lang => {
    console.log(`✉️  Generating ${lang} email HTML...`);
    const emailHTML = generateEmailHTML(grouped, lang);
    const emailPath = path.join(__dirname, 'exports', 'catalogs', `catalog-email-${lang}.html`);
    fs.writeFileSync(emailPath, emailHTML, 'utf8');
    console.log(`   ✅ Saved: catalog-email-${lang}.html`);
  });

  // 5. Generate PDF catalog
  console.log('📄 Generating visual catalog (HTML)...');
  const catalogHTML = generateCatalogHTML(grouped);
  const catalogHTMLPath = path.join(__dirname, 'exports', 'catalogs', 'catalog-full.html');
  fs.writeFileSync(catalogHTMLPath, catalogHTML, 'utf8');
  console.log(`   ✅ Saved: catalog-full.html`);

  console.log('📄 Generating visual catalog (PDF)...');
  try {
    const catalogPDF = generateCatalogPDF(grouped);
    fs.writeFileSync(path.join(__dirname, 'exports', 'catalogs', 'catalog-full.pdf'), catalogPDF);
    console.log(`   ✅ Saved: catalog-full.pdf (Direct PDF)`);
  } catch (e) {
    console.error(`   ❌ Failed to generate catalog-full.pdf: ${e.message}`);
  }

  // 6. Generate full product list
  console.log('📋 Generating full product list (HTML)...');
  const listHTML = generateProductListHTML(grouped);
  const listPath = path.join(__dirname, 'exports', 'catalogs', 'catalog-product-list.html');
  fs.writeFileSync(listPath, listHTML, 'utf8');
  console.log(`   ✅ Saved: catalog-product-list.html`);

  console.log('📋 Generating full product list (PDF)...');
  try {
    const listPDF = generateProductListPDF(grouped);
    fs.writeFileSync(path.join(__dirname, 'exports', 'catalogs', 'catalog-product-list.pdf'), listPDF);
    console.log(`   ✅ Saved: catalog-product-list.pdf (Direct PDF)`);
  } catch (e) {
    console.error(`   ❌ Failed to generate catalog-product-list.pdf: ${e.message}`);
  }

  console.log('\n================================');
  console.log('🎉 All files generated successfully!\n');
  console.log('📧 EMAIL WORKFLOW:');
  console.log('   1. Open "catalog-email-EN.html" or "catalog-email-ES.html" in Chrome');
  console.log('   2. Select all (Ctrl+A) and Copy (Ctrl+C)');
  console.log('   3. Open Gmail → Compose new email');
  console.log('   4. Paste (Ctrl+V) into the email body');
  console.log('   5. Attach "catalog-full.pdf"');
  console.log('   6. Attach "catalog-product-list.pdf"');
  console.log('   7. Send! 🚀\n');
}

main();
