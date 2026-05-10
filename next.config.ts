import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    // String-form plugin names so Turbopack can serialize loader options
    // across worker threads. Function references break the build with
    // "loader does not have serializable options" in Next 16.
    //
    // remark-frontmatter parses the YAML block at the top of each .mdx
    // file as a YAML AST node. MDX's renderer drops unknown-type nodes
    // silently, so the frontmatter stops bleeding into the rendered body.
    // The metadata reader in src/lib/content/articles.ts uses gray-matter
    // against the raw file independently — both layers parse the same
    // frontmatter without conflict.
    remarkPlugins: [["remark-frontmatter", "yaml"], ["remark-gfm"]],
    rehypePlugins: [
      ["rehype-slug"],
      ["rehype-autolink-headings", { behavior: "wrap" }],
    ],
  },
});

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
};

export default withMDX(nextConfig);
