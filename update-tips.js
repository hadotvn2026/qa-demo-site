const fs = require('fs');
const path = require('path');

const elementsDir = path.join(__dirname, 'src/app/elements');

function convertToSeleniumJava(playwrightCode) {
  // basic conversion logic
  let code = playwrightCode;
  code = code.replace(/page\.getByRole\('([^']+)', \{ name: '([^']+)' \}\)/g, 'driver.findElement(By.xpath("//$1[text()=\'$2\']"))');
  code = code.replace(/page\.locator\('([^']+)'\)/g, 'driver.findElement(By.cssSelector("$1"))');
  code = code.replace(/\.click\(\)/g, '.click()');
  code = code.replace(/\.fill\('([^']+)'\)/g, '.sendKeys("$1")');
  code = code.replace(/page\.on\('dialog'.*/g, 'driver.switchTo().alert().accept();');
  code = code.replace(/page\.frameLocator\('([^']+)'\)/g, 'driver.switchTo().frame(driver.findElement(By.cssSelector("$1")))');
  if (code === playwrightCode) {
    return 'driver.findElement(By.cssSelector("..."));';
  }
  return code + ';';
}

function convertToSeleniumPython(playwrightCode) {
  let code = playwrightCode;
  code = code.replace(/page\.getByRole\('([^']+)', \{ name: '([^']+)' \}\)/g, 'driver.find_element(By.XPATH, "//$1[text()=\'$2\']")');
  code = code.replace(/page\.locator\('([^']+)'\)/g, 'driver.find_element(By.CSS_SELECTOR, "$1")');
  code = code.replace(/\.click\(\)/g, '.click()');
  code = code.replace(/\.fill\('([^']+)'\)/g, '.send_keys("$1")');
  code = code.replace(/page\.on\('dialog'.*/g, 'driver.switch_to.alert.accept()');
  code = code.replace(/page\.frameLocator\('([^']+)'\)/g, 'driver.switch_to.frame(driver.find_element(By.CSS_SELECTOR, "$1"))');
  if (code === playwrightCode) {
    return 'driver.find_element(By.CSS_SELECTOR, "...")';
  }
  return code;
}

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('page.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // We need to match <TipDrawer selector="..." tip="..." />
      // or selector={`...`}
      const regex = /<TipDrawer\s+selector=([{"`].+?[`"}])\s+tip=/g;
      
      content = content.replace(regex, (match, selectorContent) => {
        // Strip quotes/braces
        let rawSelector = selectorContent;
        if (rawSelector.startsWith('{`')) {
          rawSelector = rawSelector.slice(2, -2);
        } else if (rawSelector.startsWith('"') || rawSelector.startsWith("'")) {
          rawSelector = rawSelector.slice(1, -1);
        }
        
        // Unescape if needed
        rawSelector = rawSelector.replace(/\\"/g, '"');

        const java = convertToSeleniumJava(rawSelector);
        const python = convertToSeleniumPython(rawSelector);
        
        return `<TipDrawer \n        playwright={\`${rawSelector}\`}\n        java={\`${java}\`}\n        python={\`${python}\`}\n        tip=`;
      });

      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir(elementsDir);
console.log('Done updating tips');
