import { unlink } from "fs";
import { filePath } from "./page-objects/HackerNews.po";

async function globalSetup() {
  // delete file, so we start fresh each time.
  unlink(filePath, (err) => {
    if (err) {
      console.error(`Error removing file: ${err}`);
      return;
    }
    console.log(`File ${filePath} has been successfully removed.`);
  });
}
export default globalSetup;