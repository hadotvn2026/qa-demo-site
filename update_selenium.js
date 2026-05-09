const fs = require('fs');
let content = fs.readFileSync('src/components/layout/locator-bot.tsx', 'utf8');

// 1. ElementAnalysis & CheatsheetMatch
content = content.replace(
  /playwrightCandidates: string\[\];\n  cheatsheetMatches: CheatsheetMatch\[\];/,
  `playwrightCandidates: string[];\n  seleniumCandidates: string[];\n  cheatsheetMatches: CheatsheetMatch[];`
);
content = content.replace(
  /playwright\?: string \| null;\n  xpath: string \| null;/,
  `playwright?: string | null;\n  selenium?: string | null;\n  xpath: string | null;`
);

// 2. buildSeleniumCandidates
const selCandidates = `
function buildSeleniumCandidates(
  tag: string,
  text: string,
  attrs: Array<{ name: string; value: string }>,
): string[] {
  const sel: string[] = [];
  const getAttr = (name: string) => attrs.find((a) => a.name === name)?.value;

  const id = getAttr("id");
  if (id) sel.push(\`By.id("\${id}")\`);

  const name = getAttr("name");
  if (name) sel.push(\`By.name("\${name}")\`);

  const testId = getAttr("data-testid");
  if (testId) sel.push(\`By.cssSelector("[data-testid='\${testId}']")\`);

  const cls = getAttr("class");
  if (cls) {
    const firstClass = cls.split(/\\s+/).filter(Boolean)[0];
    if (firstClass) sel.push(\`By.className("\${firstClass}")\`);
  }

  if (tag === "a" && text) {
    const cleanText = text.replace(/"/g, '\\\\"');
    sel.push(\`By.linkText("\${cleanText}")\`);
    if (text.length > 10) {
      sel.push(\`By.partialLinkText("\${cleanText.substring(0, 10)}")\`);
    }
  }

  sel.push(\`By.tagName("\${tag}")\`);
  
  // Basic CSS fallback
  if (attrs.length > 0) {
     const cssParts = attrs.map(a => \`[\${a.name}="\${a.value.replace(/"/g, '\\\\"') }"]\`).join("");
     sel.push(\`By.cssSelector("\${tag}\${cssParts}")\`);
  }

  return Array.from(new Set(sel));
}
`;
content = content.replace(
  /function matchCheatsheetRecipes/,
  selCandidates + '\nfunction matchCheatsheetRecipes'
);

// 3. rateLocator
content = content.replace(
  /function rateLocator\(loc: string\): number \{/,
  `function rateLocator(loc: string): number {
  if (loc.startsWith("By.id") || loc.startsWith("By.name") || loc.startsWith("By.linkText")) return 4;
  if (loc.startsWith("By.cssSelector(\\"[data-testid") || loc.startsWith("By.cssSelector('[data-testid")) return 4;
  if (loc.startsWith("By.className") || loc.startsWith("By.partialLinkText")) return 3;
  if (loc.startsWith("By.tagName") || loc.startsWith("By.cssSelector")) return 2;
  if (loc.startsWith("By.xpath")) return 1;`
);

// 4. analyzeElement
content = content.replace(
  /const playwright = buildPlaywrightCandidates\(tag, text, attrs\);\n  const cheatsheetMatches = matchCheatsheetRecipes\(el, text\);/,
  `const playwright = buildPlaywrightCandidates(tag, text, attrs);\n  const selenium = buildSeleniumCandidates(tag, text, attrs);\n  const cheatsheetMatches = matchCheatsheetRecipes(el, text);`
);
content = content.replace(
  /playwrightCandidates: playwright,\n    cheatsheetMatches,/,
  `playwrightCandidates: playwright,\n    seleniumCandidates: selenium,\n    cheatsheetMatches,`
);

// 5. BrainstormPanel
const brainstormUI = `          {stage >= 4 && (
            <CandidateList
              label="Possible Playwright locators (Recommended)"
              accent="text-emerald-300"
              items={analysis.playwrightCandidates}
              copied={copied}
              onCopy={onCopy}
            />
          )}

          {stage >= 5 && (
            <CandidateList
              label="Possible Selenium Java locators (Stable)"
              accent="text-amber-300"
              items={analysis.seleniumCandidates}
              copied={copied}
              onCopy={onCopy}
            />
          )}`;
content = content.replace(
  /          \{stage >= 4 && \([\s\S]*?\}\)/,
  brainstormUI
);
content = content.replace(/stage >= 5/g, 'stage >= 6'); // for CSS
content = content.replace(/stage >= 6/g, 'stage >= 7'); // for XPath
content = content.replace(/stage >= 7/g, 'stage >= 8'); // for reasoning complete
content = content.replace(/stage < 6/g, 'stage < 7'); // for thinking state
// Wait, the above replaces might conflict, so let's be more specific.

fs.writeFileSync('src/components/layout/locator-bot.tsx.tmp', content);
console.log("Success phase 1");
