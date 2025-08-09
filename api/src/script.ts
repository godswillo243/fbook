import array from "../data.json";
import fs from "fs";
const strs = array.resources.map((resource) => resource.secure_url);

(async function () {
  const data = JSON.stringify(strs);
  fs.writeFile(
    "./data2.json",
    data,
    { encoding: "utf-8" },
    (error) => error && console.log(error)
  );
})();
