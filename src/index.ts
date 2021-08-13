import type { Metafile } from "esbuild";

export function reverseSortedInputs(meta: Metafile) {
    const result: [path: string, bytes: number][] = [];
    let first: Metafile["outputs"][string]["inputs"] | undefined;
    for (let [output, data] of Object.entries(meta.outputs)) {
        if (output.endsWith('.js')) {
            first = data.inputs;
            break;
        }
    }
    if (!first) return [];
    for (const [path, { bytesInOutput: bytes }] of Object.entries(first)) {
        result.push([path, bytes]);
    }
    return result.sort((a, b) => b[1] - a[1]);
}
