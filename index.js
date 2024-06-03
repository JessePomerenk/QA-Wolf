// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
// Author: Jesse Pomerenk
const { chromium } = require("playwright");
const { expect } = require("playwright/test");
const fs = require('fs');

/*
  <rant>
    Typescript is better. Fight me.
    Also this isn't really a proper playwright test. This is just a node file that we are shoving playwright scripts into which means we cant use all the fun magic of playwright.
    Also how was this not just a git repo that we could have just forked?
  </rant>
*/


/*file is JS so cant protect the type like I want to */
async function saveLinkToCsv(title, href, filename ) { 
  fs.appendFile(`${filename}.csv`, `${title}, ${href}\r\n`, function (err) {
    if (err) throw err;
    console.log('Saved!');
  });
}
/* Get the links from the hackerNews page and save the title and href to a csv */
async function saveHackerNewsArticles(linkCount = 10, filename = 'test') {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com");

  // this should go in a page object file
  const linkTable = page.locator("table").locator("table").nth(1); // get the link table
  const rows = linkTable.locator("tr"); // get all link rows
  const links = rows.locator(".titleline").getByRole('link'); // get all links in row title
  const filteredLinks = links.filter({hasNot:page.locator("../sitebit")}); //filter to only links that are not the sublinks

  // make sure we have at least the ammount of links we are looking for
  expect(await filteredLinks.count()).toBeGreaterThanOrEqual(linkCount);

  // use a for loop in a test which is a no-no. https://playwright.dev/docs/best-practices#make-tests-as-isolated-as-possible
  for(let i=0; i<linkCount; i++){
    const link = filteredLinks.nth(i)
    const linkText =  (await link.innerText()).replace(',', ''); // get text and remove commas to keep csv sterile
    const linkHref =  await link.getAttribute('href');
    await saveLinkToFile(linkText, linkHref, filename);
  }
}

(async () => {
  await saveHackerNewsArticles();
})();
