import { API_BASE } from "./config.js";

export class ApiError extends Error {
  constructor(status, body) {
    super(body?.message ?? `Request failed (${status})`);
    this.status = status;
    this.body = body;
  }
}

async function request(path, params = {}) {
  if (!API_BASE || API_BASE === "SET_ME_TO_THE_LAMBDA_FUNCTION_URL") {
    console.error(
      "js/config.js: API_BASE is still the placeholder — set it to the deployed Lambda Function URL."
    );
    throw new ApiError(0, {
      message: "This site isn't configured yet (missing API_BASE).",
    });
  }

  const url = new URL(API_BASE.replace(/\/$/, "") + path);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  }

  let res;
  try {
    res = await fetch(url, { method: "GET" });
  } catch {
    throw new ApiError(0, { message: "Couldn't reach the server — check your connection." });
  }

  const body = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(res.status, body);
  return body;
}

export const getRandomStory = (categories) =>
  request("/story", { categories: categories?.length ? categories.join(",") : undefined });

export const getStoryById = (id) => request("/story", { id });

export const getStories = (categories) =>
  request("/stories", { categories: categories?.length ? categories.join(",") : undefined });

export const getCategories = () => request("/categories");
