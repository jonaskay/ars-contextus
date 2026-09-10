import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  if (!context.site) {
    throw new Error("Site URL is required to generate the RSS feed.");
  }

  const posts = (await getCollection("blog")).sort(
    (a, b) => b.data.publishedDate.valueOf() - a.data.publishedDate.valueOf(),
  );
  const lastBuildDate =
    posts.reduce((latestDate, post) => {
      const postDate = post.data.updatedDate ?? post.data.publishedDate;

      return postDate > latestDate ? postDate : latestDate;
    }, posts[0]?.data.updatedDate ?? posts[0]?.data.publishedDate) ?? new Date();
  const channelMetadata = [
    `<atom:link href="${new URL("/rss.xml", context.site).href}" rel="self" type="application/rss+xml" />`,
    "<language>en-us</language>",
    `<lastBuildDate>${lastBuildDate.toUTCString()}</lastBuildDate>`,
  ].join("");

  return rss({
    title: "Ars Contextus",
    description: "Blog about software engineering with LLMs",
    site: context.site,
    xmlns: {
      atom: "http://www.w3.org/2005/Atom",
    },
    customData: channelMetadata,
    items: posts
      .map((post) => ({
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.publishedDate,
        link: `/blog/${post.id}/`,
      })),
  });
}
