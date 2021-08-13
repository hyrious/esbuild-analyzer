import type { Metafile } from "esbuild";

export function reverseSortedInputs(meta: Metafile) {
    const result: [path: string, bytes: number][] = [];
    for (const [path, { bytes }] of Object.entries(meta.inputs)) {
        result.push([path, bytes]);
    }
    return result.sort((a, b) => b[1] - a[1]);
}
