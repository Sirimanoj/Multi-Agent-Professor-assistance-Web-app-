import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  await page.goto('http://localhost:5173/');
  
  await new Promise(r => setTimeout(r, 1000));
  await page.evaluate(() => {
    document.querySelectorAll('button')[0].click();
  });
  
  await new Promise(r => setTimeout(r, 1000));
  await page.type('input[type="email"]', 'professor@university.edu');
  await page.type('input[type="password"]', 'password');
  await page.evaluate(() => {
    document.querySelector('button[type="submit"]').click();
  });

  await new Promise(r => setTimeout(r, 3000));
  
  if (!fs.existsSync('../video-showcase/public/assets/screens')) {
    fs.mkdirSync('../video-showcase/public/assets/screens', { recursive: true });
  }
  await page.screenshot({ path: '../video-showcase/public/assets/screens/professor.png' });
  console.log('Saved professor.png');

  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const lg = btns.find(b => b.innerText.includes('Logout'));
    if (lg) lg.click();
  });

  await new Promise(r => setTimeout(r, 1500));
  await page.evaluate(() => {
    document.querySelectorAll('button')[1].click();
  });
  
  await new Promise(r => setTimeout(r, 1000));
  await page.type('input[type="email"]', 'student@university.edu');
  await page.type('input[type="password"]', 'password');
  await page.evaluate(() => {
    document.querySelector('button[type="submit"]').click();
  });

  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: '../video-showcase/public/assets/screens/student.png' });
  console.log('Saved student.png');

  await browser.close();
})();
