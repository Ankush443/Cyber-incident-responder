const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

async function generateArchitectureDiagram() {
  console.log('Generating architecture diagram image...');
  
  // Launch a headless browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Get the HTML file path
  const htmlPath = path.join(__dirname, 'architecture.html');
  
  // Load the HTML file
  await page.goto(`file:${htmlPath}`, { waitUntil: 'networkidle0' });
  
  // Set viewport to match the diagram size
  await page.setViewport({ width: 900, height: 650 });
  
  // Wait for the diagram to render
  await page.waitForSelector('.diagram-container');
  
  // Take a screenshot
  await page.screenshot({
    path: path.join(__dirname, 'architecture-diagram.png'),
    fullPage: true
  });
  
  console.log('Screenshot saved to architecture-diagram.png');
  
  // Close the browser
  await browser.close();
}

generateArchitectureDiagram().catch(console.error); 