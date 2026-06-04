import fs from "fs";

export const read = (path) => {
    return JSON.parse(fs.readFileSync(path, "utf-8"));
};

export const write = (path, data) => {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
};