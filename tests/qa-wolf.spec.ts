import { expect, test } from "playwright/test";
import { HackerNewsPageObject } from "../page-objects/HackerNews.po";


test.describe("Get links from HackerNews", () => {
    test("save to CSV", async ({page})=> {
        const hackerNews = new HackerNewsPageObject(page);
        const linkCount = 10;
        await page.goto('/') // go to hackernews becasue we have baseUrl set in the playwright config.
        expect(await hackerNews.filteredLinks.count()).toBeGreaterThanOrEqual(linkCount);
        
        // use a for loop in a test which is a no-no. https://playwright.dev/docs/best-practices#make-tests-as-isolated-as-possible
        for(let i=0; i<linkCount; i++){
            const link = hackerNews.filteredLinks.nth(i)
            const linkText =  (await link.innerText()).replace(',', ''); // get text and remove commas to keep csv sterile
            const linkHref =  await link.getAttribute('href');
            await hackerNews.saveLinkToCsv(linkText, linkHref);
        }
    })
})
