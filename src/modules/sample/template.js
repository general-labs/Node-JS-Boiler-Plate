import fs from "fs";
import path from "path";
import * as mCache from "../../core/cache/memory-cache";

export default async (req, res) => {
  const templatePath = path.join(__dirname, 'theme/index.html');
  fs.readFile(templatePath, 'utf8', function (err, contents) {
    console.log("---- N Cache TEST ----- ", mCache.get('gal_gadot'));
    res.status(200).send(contents);
  });  
}