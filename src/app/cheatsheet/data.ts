export interface LocatorRecipe {
  recipe: string;
  xpath: string | null;
  css: string | null;
  dom: string | null;
  selenium: string | null;
}

export interface LocatorCategory {
  name: string;
  recipes: LocatorRecipe[];
}

// Sourced from "XPath / CSS / DOM / Selenium — Rosetta Stone and Cookbook" by
// Michael Sorens (v1.0.2, 2011-04-05). See
// https://www.cheat-sheets.org/saved-copy/Locators_table_1_0_2.pdf
//
// Special markers preserved verbatim from the original chart:
//   ⌦  = Not supported by Selenium
//   {Se: ...} = Selenium-only variation
//   ⦿  = single space character (used inside concat() expressions)
//   gEBI / gEBTN = getElementById / getElementsByTagName
export const CHEATSHEET: LocatorCategory[] = [
  {
    name: "General",
    recipes: [
      {
        recipe: "Whole web page",
        xpath: "xpath=/html",
        css: "css=html",
        dom: "document.documentElement",
        selenium: null,
      },
      {
        recipe: "Whole web page body",
        xpath: "xpath=/html/body",
        css: "css=body",
        dom: "document.body",
        selenium: null,
      },
      {
        recipe: "All text nodes of web page",
        xpath: "//text() ⌦",
        css: null,
        dom: null,
        selenium: null,
      },
      {
        recipe: "Element <E> by absolute reference",
        xpath: "xpath=/html/body/.../.../.../E",
        css: "css=body>…>…>…>E",
        dom: "document.body.childNodes[i]...childNodes[j]",
        selenium: null,
      },
    ],
  },
  {
    name: "Tag",
    recipes: [
      {
        recipe: "Element <E> by relative reference",
        xpath: "//E",
        css: "css=E",
        dom: "document.gEBTN('E')[0]",
        selenium: null,
      },
      {
        recipe: "Second <E> element anywhere on page",
        xpath: "xpath=(//E)[2]",
        css: null,
        dom: "document.gEBTN('E')[1]",
        selenium: null,
      },
      {
        recipe: "Image element",
        xpath: "//img",
        css: "css=img",
        dom: "document.images[0]",
        selenium: null,
      },
      {
        recipe: "Element <E> with attribute A",
        xpath: "//E[@A]",
        css: "css=E[A]",
        dom: "for each (e in document.gEBTN('E')) if (e.A) e",
        selenium: null,
      },
      {
        recipe: "Element <E> with attribute A containing text 't' exactly",
        xpath: "//E[@A='t']",
        css: "css=E[A='t']",
        dom: null,
        selenium: null,
      },
      {
        recipe: "Element <E> with attribute A containing text 't'",
        xpath: "//E[contains(@A,'t')]",
        css: "css=E[A*='t']",
        dom: null,
        selenium: null,
      },
      {
        recipe: "Element <E> whose attribute A begins with 't'",
        xpath: "//E[starts-with(@A, 't')]",
        css: "css=E[A^='t']",
        dom: null,
        selenium: null,
      },
      {
        recipe: "Element <E> whose attribute A ends with 't'",
        xpath: "//E[ends-with(@A, 't')] ⌦  OR  //E[substring(@A, string-length(@A) - string-length('t')+1)='t']",
        css: "css=E[A$='t']",
        dom: null,
        selenium: null,
      },
      {
        recipe: "Element <E> with attribute A containing word 'w'",
        xpath: "//E[contains(concat('⦿', @A, '⦿'), '⦿w⦿')]",
        css: "css=E[A~='w']",
        dom: null,
        selenium: null,
      },
      {
        recipe: "Element <E> with attribute A matching regex 'r'",
        xpath: "//E[matches(@A, 'r')] ⌦",
        css: null,
        dom: null,
        selenium: null,
      },
      {
        recipe: "Element <E1> with id I1 or element <E2> with id I2",
        xpath: "//E1[@id=I1] | //E2[@id=I2]",
        css: "css=E1#I1,E2#I2",
        dom: null,
        selenium: null,
      },
      {
        recipe: "Element <E1> with id I1 or id I2",
        xpath: "//E1[@id=I1 or @id=I2]",
        css: "css=E1#I1,E1#I2",
        dom: null,
        selenium: null,
      },
    ],
  },
  {
    name: "Attribute",
    recipes: [
      {
        recipe: "Attribute A of element <E>",
        xpath: "//E/@A ⌦   {Se: //E@A}",
        css: "{Se: css=E@A}",
        dom: "document.gEBTN('E')[0].getAttribute('A') ⌦   {Se: document.gEBTN('E')[0]@A}",
        selenium: null,
      },
      {
        recipe: "Attribute A of any element",
        xpath: "//*/@A ⌦   {Se: //*@A}",
        css: "{Se: css=*@A}",
        dom: null,
        selenium: null,
      },
      {
        recipe: "Attribute A1 of element <E> where attribute A2 is 't' exactly",
        xpath: "//E[@A2='t']/@A1 ⌦   {Se: //E[@A2='t']@A1}",
        css: "{Se: css=E[A2='t']@A1}",
        dom: null,
        selenium: null,
      },
      {
        recipe: "Attribute A of element <E> where A contains 't'",
        xpath: "//E[contains(@A,'t')]/@A ⌦   {Se: //E[contains(@A,'t')]@A}",
        css: "{Se: css=E[A*='t']@A}",
        dom: null,
        selenium: null,
      },
    ],
  },
  {
    name: "Id & Name",
    recipes: [
      {
        recipe: "Element <E> with id I",
        xpath: "//E[@id='I']",
        css: "css=E#I",
        dom: null,
        selenium: null,
      },
      {
        recipe: "Element with id I",
        xpath: "//*[@id='I']",
        css: "css=#I",
        dom: "document.gEBI('I')",
        selenium: "id=I",
      },
      {
        recipe: "Element <E> with name N",
        xpath: "//E[@name='N']",
        css: "css=E[name=N]",
        dom: null,
        selenium: null,
      },
      {
        recipe: "Element with name N",
        xpath: "//*[@name='N']",
        css: "css=[name=N]",
        dom: "document.getElementsByName('N')[0]",
        selenium: "name=N",
      },
      {
        recipe: "Element with id X or, failing that, a name X",
        xpath: "//*[@id='X' or @name='X']",
        css: null,
        dom: null,
        selenium: "X   OR   identifier=X",
      },
      {
        recipe: "Element with name N & specified 0-based index 'v'",
        xpath: "//*[@name='N'][v+1]",
        css: "css=[name=N]:nth-child(v+1)",
        dom: null,
        selenium: "name=N index=v",
      },
      {
        recipe: "Element with name N & specified value 'v'",
        xpath: "//*[@name='N'][@value='v']",
        css: "css=[name=N][value='v']",
        dom: null,
        selenium: "name=N value=v",
      },
    ],
  },
  {
    name: "Lang & Class",
    recipes: [
      {
        recipe: "Element <E> is explicitly in language L or subcode",
        xpath: "//E[@lang='L' or starts-with(@lang, concat('L', '-'))]",
        css: "css=E[lang|=L]",
        dom: null,
        selenium: null,
      },
      {
        recipe: "Element <E> is in language L or subcode (possibly inherited)",
        xpath: null,
        css: "css=E:lang(L)",
        dom: null,
        selenium: null,
      },
      {
        recipe: "Element with a class C",
        xpath: "//*[contains(concat('⦿', @class, '⦿'), '⦿C⦿')]",
        css: "css=.C",
        dom: "document.getElementsByClassName('C')[0]",
        selenium: null,
      },
      {
        recipe: "Element <E> with a class C",
        xpath: "//E[contains(concat('⦿', @class, '⦿'), '⦿C⦿')]",
        css: "css=E.C",
        dom: null,
        selenium: null,
      },
    ],
  },
  {
    name: "Text & Link",
    recipes: [
      {
        recipe: "Element containing text 't' exactly",
        xpath: "//*[.='t']",
        css: null,
        dom: null,
        selenium: null,
      },
      {
        recipe: "Element <E> containing text 't'",
        xpath: "//E[contains(text(),'t')]",
        css: "css=E:contains('t')",
        dom: null,
        selenium: null,
      },
      {
        recipe: "Link element",
        xpath: "//a",
        css: "css=a",
        dom: "document.links[0]",
        selenium: null,
      },
      {
        recipe: "<a> containing text 't' exactly",
        xpath: "//a[.='t']",
        css: null,
        dom: null,
        selenium: "link=t",
      },
      {
        recipe: "<a> containing text 't'",
        xpath: "//a[contains(text(),'t')]",
        css: "css=a:contains('t')",
        dom: null,
        selenium: null,
      },
      {
        recipe: "<a> with target link 'url'",
        xpath: "//a[@href='url']",
        css: "css=a[href='url']",
        dom: null,
        selenium: null,
      },
      {
        recipe: "Link URL labeled with text 't' exactly",
        xpath: "//a[.='t']/@href",
        css: null,
        dom: null,
        selenium: null,
      },
    ],
  },
  {
    name: "Parent & Child",
    recipes: [
      {
        recipe: "First child of element <E>",
        xpath: "//E/*[1]",
        css: "css=E > *:first-child   {Se: css=E > *}",
        dom: "document.gEBTN('E')[0].firstChild",
        selenium: null,
      },
      {
        recipe: "First <E> child",
        xpath: "//E[1]",
        css: "css=E:first-of-type ⌦   {Se: css=E}",
        dom: "document.gEBTN('E')[0]",
        selenium: null,
      },
      {
        recipe: "Last child of element E",
        xpath: "//E/*[last()]",
        css: "css=E *:last-child",
        dom: "document.gEBTN('E')[0].lastChild",
        selenium: null,
      },
      {
        recipe: "Last <E> child",
        xpath: "//E[last()]",
        css: "css=E:last-of-type ⌦",
        dom: "document.gEBTN('E')[document.gEBTN('E').length-1]",
        selenium: null,
      },
      {
        recipe: "Second <E> child",
        xpath: "//E[2]   OR   //E/following-sibling::E",
        css: "css=E:nth-of-type(2) ⌦",
        dom: "document.gEBTN('E')[1]",
        selenium: null,
      },
      {
        recipe: "Second child that is an <E> element",
        xpath: "//*[2][name()='E']",
        css: "css=E:nth-child(2)",
        dom: null,
        selenium: null,
      },
      {
        recipe: "Second-to-last <E> child",
        xpath: "//E[last()-1]",
        css: "css=E:nth-last-of-type(2) ⌦",
        dom: "document.gEBTN('E')[document.gEBTN('E').length-2]",
        selenium: null,
      },
      {
        recipe: "Second-to-last child that is an <E> element",
        xpath: "//*[last()-1][name()='E']",
        css: "css=E:nth-last-child(2) ⌦",
        dom: null,
        selenium: null,
      },
      {
        recipe: "Element <E1> with only <E2> children",
        xpath: "//E1/[E2 and not(*[not(self::E2)])]",
        css: null,
        dom: null,
        selenium: null,
      },
      {
        recipe: "Parent of element <E>",
        xpath: "//E/..",
        css: null,
        dom: "document.gEBTN('E')[0].parentNode",
        selenium: null,
      },
      {
        recipe: "Descendant <E> of element with id I using specific path",
        xpath: "//*[@id='I']/.../.../.../E",
        css: "css=#I > ... > ... > ... > E",
        dom: "document.gEBI('I')…gEBTN('E')[0]",
        selenium: null,
      },
      {
        recipe: "Descendant <E> of element with id I using unspecified path",
        xpath: "//*[@id='I']//E",
        css: "css=#I E",
        dom: "document.gEBI('I').gEBTN('E')[0]",
        selenium: null,
      },
      {
        recipe: "Element <E> with no children",
        xpath: "//E[count(*)=0]",
        css: "css=E:empty",
        dom: null,
        selenium: null,
      },
      {
        recipe: "Element <E> with an only child",
        xpath: "//E[count(*)=1]",
        css: null,
        dom: null,
        selenium: null,
      },
      {
        recipe: "Element <E> that is an only child",
        xpath: "//E[count(preceding-sibling::*)+count(following-sibling::*)=0]",
        css: "css=E:only-child",
        dom: null,
        selenium: null,
      },
      {
        recipe: "Element <E> with no <E> siblings",
        xpath: "//E[count(../E) = 1]",
        css: "css=E:only-of-type ⌦",
        dom: null,
        selenium: null,
      },
      {
        recipe: "Every Nth element starting with the (M+1)th",
        xpath: "//E[position() mod N = M + 1]",
        css: "css=E:nth-child(Nn + M)",
        dom: null,
        selenium: null,
      },
    ],
  },
  {
    name: "Sibling",
    recipes: [
      {
        recipe: "Element <E1> following some sibling <E2>",
        xpath: "//E2/following-sibling::E1",
        css: "css=E2 ~ E1",
        dom: null,
        selenium: null,
      },
      {
        recipe: "Element <E1> immediately following sibling <E2>",
        xpath: "//E2/following-sibling::*[1][name()='E1']",
        css: "css=E2 + E1",
        dom: null,
        selenium: null,
      },
      {
        recipe: "Element <E1> following sibling <E2> with one intermediary",
        xpath: "//E2/following-sibling::*[2][name()='E1']",
        css: "css=E2 + * + E1",
        dom: null,
        selenium: null,
      },
      {
        recipe: "Sibling element immediately following <E>",
        xpath: "//E/following-sibling::*",
        css: "css=E + *",
        dom: "document.gEBTN('E')[0].nextSibling",
        selenium: null,
      },
      {
        recipe: "Element <E1> preceding some sibling <E2>",
        xpath: "//E2/preceding-sibling::E1",
        css: null,
        dom: null,
        selenium: null,
      },
      {
        recipe: "Element <E1> immediately preceding sibling <E2>",
        xpath: "//E2/preceding-sibling::*[1][name()='E1']",
        css: null,
        dom: null,
        selenium: null,
      },
      {
        recipe: "Element <E1> preceding sibling <E2> with one intermediary",
        xpath: "//E2/preceding-sibling::*[2][name()='E1']",
        css: null,
        dom: null,
        selenium: null,
      },
      {
        recipe: "Sibling element immediately preceding <E>",
        xpath: "//E/preceding-sibling::*[1]",
        css: null,
        dom: "document.gEBTN('E2')[0].previousSibling",
        selenium: null,
      },
    ],
  },
  {
    name: "Table Cell",
    recipes: [
      {
        recipe: "Cell by row and column (e.g. 3rd row, 2nd column)",
        xpath: "//*[@id='TestTable']//tr[3]//td[2]   {Se: //*[@id='TestTable'].2.1}",
        css: "css=#TestTable tr:nth-child(3) td:nth-child(2)   {Se: css=#TestTable.2.1}",
        dom: "document.gEBI('TestTable').gEBTN('tr')[2].gEBTN('td')[1]   {Se: document.gEBI('TestTable').2.1}",
        selenium: null,
      },
      {
        recipe: "Cell immediately following cell containing 't' exactly",
        xpath: "//td[preceding-sibling::td='t']",
        css: null,
        dom: null,
        selenium: null,
      },
      {
        recipe: "Cell immediately following cell containing 't'",
        xpath: "//td[preceding-sibling::td[contains(.,'t')]]",
        css: "css=td:contains('t') ~ td",
        dom: null,
        selenium: null,
      },
    ],
  },
  {
    name: "Dynamic",
    recipes: [
      {
        recipe: "User interface element <E> that is disabled",
        xpath: "//E[@disabled]",
        css: "css=E:disabled",
        dom: null,
        selenium: null,
      },
      {
        recipe: "User interface element that is enabled",
        xpath: "//*[not(@disabled)]",
        css: "css=*:enabled",
        dom: null,
        selenium: null,
      },
      {
        recipe: "Checkbox (or radio button) that is checked",
        xpath: "//*[@checked]",
        css: "css=*:checked",
        dom: null,
        selenium: null,
      },
      {
        recipe: "Element being designated by a pointing device",
        xpath: null,
        css: "css=E:hover ⌦",
        dom: null,
        selenium: null,
      },
      {
        recipe: "Element has keyboard input focus",
        xpath: null,
        css: "css=E:focus ⌦",
        dom: null,
        selenium: null,
      },
      {
        recipe: "Unvisited link",
        xpath: null,
        css: "css=E:link ⌦",
        dom: null,
        selenium: null,
      },
      {
        recipe: "Visited link",
        xpath: null,
        css: "css=E:visited ⌦",
        dom: null,
        selenium: null,
      },
      {
        recipe: "Active element",
        xpath: null,
        css: "css=E:active ⌦",
        dom: null,
        selenium: null,
      },
    ],
  },
];
