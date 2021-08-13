import fs from "fs";
import path from "path";
import { reverseSortedInputs } from "../src";

let a = reverseSortedInputs(JSON.parse(fs.readFileSync(process.argv[2], "utf-8")));
let sum = a.map(e => e[1]).reduce((a, b) => a + b, 0);

function percent(size: number) {
    return ((size * 100 / sum).toFixed(2) + '%').padStart(6);
}

function print(size: number, file: string) {
    console.log(size.toLocaleString().padStart(8), percent(size), file);
}

function collapse(a: [file: string, size: number][]) {
    let b: [file: string, size: number, count: number][] = [];
    let m: Record<string, number> = {};
    for (let x of a) {
        let i = m[x[0]];
        if (i !== undefined) {
            b[i][1] += x[1];
            b[i][2]++;
        } else {
            m[x[0]] = b.length;
            b.push([...x, 1]);
        }
    }
    return b.sort((a, b) => b[1] - a[1]);
}

let depsOnly = process.argv.includes("--deps");
let noDeps = process.argv.includes("--no-deps");
let filtered: [file: string, size: number][] = [];
for (let [file, size] of a) {
    let b = file.split(path.sep);
    let i = b.indexOf('node_modules');
    let pkg = i !== -1 && (b[i + 1][0] === '@' ? `${b[i + 1]}/${b[i + 2]}` : b[i + 1]);
    if (depsOnly) {
        pkg && filtered.push([pkg, size]);
    } else if (noDeps) {
        pkg || filtered.push([file, size]);
    } else {
        filtered.push([pkg || file, size]);
    }
}

let sum2 = 0;
for (let [file, size, count] of collapse(filtered)) {
    sum2 += size;
    print(size, count > 1 ? file + ` (${count})` : file);
}
console.log("sum =", sum2);
