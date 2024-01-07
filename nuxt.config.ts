import { z } from "zod";

// in dev mode, no custom prefix, in order to properly load
const baseUrl = z
  .string()
  .regex(/\/.*/, "A prefix base url should start with a slash /")
  .default("/")
  .parse(process.env.BASE_URL);

export default defineNuxtConfig({
  // https://github.com/nuxt-themes/docus
  extends: "@nuxt-themes/docus",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@nuxt/content"],
  app: {
    baseURL: baseUrl,
    head: {
      meta: [{ name: "referrer", content: "no-referrer-when-downgrade" }],
    },
  },
  runtimeConfig: {
    public: {
      baseURL: baseUrl,
    },
  },
  content: {
    highlight: {
      theme: {
        // Default theme (same as single string)
        default: "github-light",
        // Theme used if `html.dark`
        dark: "github-dark",
        // Theme used if `html.sepia`
        sepia: "monokai",
      },
      preload: [
        "c",
        "cpp",
        "java",
        "bash",
        "xml",
        "powershell",
        "csharp",
        "c#",
        "go",
        "kotlin",
        "proto",
        "sh",
        "shell",
        "zsh",
        "graphql",
        "groovy",
      ],
    },
  },
  typescript: {
    tsConfig: {
      compilerOptions: {
        verbatimModuleSyntax: false,
      },
    },
  },
});
