import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  if (!context.site) {
    throw new Error("Site URL is required to generate the RSS feed.");
  }

  const posts = await getCollection("blog");

  return rss({
    title: "Ars Contextus",
    description: "Blog about software engineering with LLMs",
    site: context.site,
    items: posts
      .sort((a, b) => b.data.publishedDate.valueOf() - a.data.publishedDate.valueOf())
      .map((post) => ({
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.publishedDate,
        link: `/blog/${post.id}/`,
      })),
  });
}
