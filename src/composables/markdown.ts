import { Base64 } from "js-base64";
import { Octokit } from "octokit";
import { github } from "./core";

const cache = new Map<string, string>();

export async function render(path: string) {
    if (cache.has(path)) {
        return cache.get(path);
    }

    const api = github.value ?? new Octokit();

    const { data } = await api.rest.repos.getContent({
        owner: "NCAIC",
        repo: "docs",
        path,
    });

    if (Array.isArray(data) || data.type !== "file") {
        return "";
    }

    const result = await api.rest.markdown.render({
        // @ts-ignore
        text: data.content ? Base64.decode(data.content) : "",
        mode: "gfm",
        context: "NCAIC/docs",
    });

    if (result.status !== 200) {
        return "";
    }

    cache.set(path, result.data);

    return result.data;
}
