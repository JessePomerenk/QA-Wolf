import { Locator, Page } from "playwright/test";
import { appendFile } from "fs";

export class HackerNewsPageObject {
    public linkTable: Locator;
    public rows: Locator;
    public links: Locator;
    public filteredLinks: Locator;

    constructor(page:Page) {
        this.linkTable = page.locator("table").locator("table").nth(1); // get the link table
        this.rows = this.linkTable.locator("tr"); // get all link rows
        this.links = this.rows.locator(".titleline").getByRole('link'); // get all links in row title
        this.filteredLinks = this.links.filter({hasNot:page.locator('.sitestr')}); //filter to only links that are not the sublinks
    }

    // should actually be in a util file, but im lazy.
    async saveLinkToCsv(title:string, href:string|null ) { 
        // creates file if it doesnt exist, and appends to it if it does.
        appendFile(filePath, `${title}, ${href}\r\n`, function (err) {
          if (err) throw err;
          console.log(`Saved: ${title}, ${href} to File: ${filePath}`);
        });
      }
}

export const filePath = "test.csv";
