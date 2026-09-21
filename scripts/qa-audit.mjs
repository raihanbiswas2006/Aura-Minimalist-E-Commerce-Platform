// Route audit script
const routes = [
  '/',
  '/c/furniture',
  '/c/lighting',
  '/c/textiles',
  '/c/decor',
  '/c/sale',
  '/p/nordic-lounge-chair',
  '/p/minimalist-ceramic-lamp',
  '/p/linen-throw-pillow',
  '/search?q=linen',
  '/search?q=xyzq987',
  '/cart',
  '/checkout',
  '/wishlist',
  '/account',
  '/account/orders',
  '/admin',
  '/about',
  '/shipping',
  '/returns',
  '/contact',
  '/privacy',
  '/terms',
  '/robots.txt',
  '/sitemap.xml',
  '/this-page-does-not-exist'
];

async function runAudit() {
  console.log('Beginning Aura QA Route Audit on http://localhost:3000...\n');
  let passed = 0;
  let failed = 0;

  for (const route of routes) {
    const url = `http://localhost:3000${route}`;
    try {
      const res = await fetch(url);
      const isExpected404 = route === '/this-page-does-not-exist';
      const expectedStatus = isExpected404 ? 404 : 200;

      if (res.status === expectedStatus) {
        console.log(`[PASS] ${route} -> Status: ${res.status}`);
        passed++;
      } else {
        console.log(`[FAIL] ${route} -> Expected ${expectedStatus}, Got: ${res.status}`);
        failed++;
      }
    } catch (err) {
      console.log(`[ERROR] ${route} -> ${err.message}`);
      failed++;
    }
  }

  console.log(`\nAudit Complete! Passed: ${passed}/${routes.length}, Failed: ${failed}`);
  if (failed > 0) process.exit(1);
}

runAudit();
