import fs from "fs";
import path from "path";
import readingTime, { ReadTimeResults } from "reading-time";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { i18n } from "../next-i18next.config";
import dayjs from "dayjs";
import { hasProperty } from "hast-util-has-property";
import { headingRank } from "hast-util-heading-rank";
import { toString } from "hast-util-to-string";
import { visit } from "unist-util-visit";
import { Root } from "hast";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { AUTHOR_NAME, SITE_URL } from "./constants";
import pMemoize from "p-memoize";
import { Feed } from "feed";

export type Frontmatter = {
  title: string;
  date: string;
  coverImage: string;
  excerpt: string;
  ogImage?: string;
  author: string;
  tags?: string[];
};

export type Post = MDXRemoteSerializeResult<
  Record<string, unknown>,
  Frontmatter
> & {
  headings: any[];
  route: string;
  url: string;
  timeToRead: ReadTimeResults;
  locale: string;
};

export const postsDirectory = path.join(process.cwd(), "posts");

function rehypeExtractHeadings({ rank = 2, headings }) {
  return (tree: Root) => {
    visit(tree, "element", (node) => {
      if (
        headingRank(node) >= rank &&
        node.properties &&
        hasProperty(node, "id")
      ) {
        headings.push({
          title: toString(node),
          id: node.properties.id.toString(),
          rank: headingRank(node),
        });
      }
    });
  };
}

function getPostPathsByLocale(locale: string) {
  try {
    return fs
      .readdirSync(path.join(postsDirectory, locale))
      .map((p) => path.join(postsDirectory, locale, p));
  } catch {
    return [];
  }
}

export const getPostByPath = pMemoize(
  async (blogPath: string): Promise<Post> => {
    let fileContents: string = "";
    try {
      if (path.extname(blogPath).startsWith(".md")) {
        fileContents = fs.readFileSync(blogPath, "utf8");
      } else {
        const filename = fs
          .readdirSync(path.dirname(blogPath))
          .find((p) => p.startsWith(path.basename(blogPath)));
        fileContents = fs.readFileSync(
          path.join(path.dirname(blogPath), filename),
          "utf8"
        );
      }
    } catch {}

    const timeToRead = readingTime(fileContents);

    const headings = [];
    const mdxSource = await serialize(fileContents, {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypeExtractHeadings, { rank: 2, headings }],
        ],
      },
    });

    const postRoute = path.parse(blogPath).name;
    const locale = path.basename(path.dirname(blogPath));

    return {
      ...mdxSource,
      headings,
      route: postRoute,
      url: [SITE_URL, locale, "blog", postRoute].join("/"),
      timeToRead: { ...timeToRead, minutes: Math.ceil(timeToRead.minutes) },
      locale,
    };
  }
);

export const getAllPosts = async (locale?: string) => {
  let allPosts: Post[] = [];
  if (locale) {
    allPosts = await Promise.all(
      getPostPathsByLocale(locale).map(async (p) => await getPostByPath(p))
    );
  } else {
    for (const l of i18n.locales) {
      const filePathsByLocale = getPostPathsByLocale(l);
      const postByLocale = await Promise.all(
        filePathsByLocale.map(async (p) => await getPostByPath(p))
      );
      allPosts = allPosts.concat(postByLocale);
    }
  }

  return locale
    ? allPosts.filter(
        (p) =>
          p.frontmatter &&
          Object.keys(p.frontmatter).length !== 0 &&
          (p.locale || i18n.defaultLocale) === locale
      )
    : allPosts;
};

export const getAllSortedPosts = async (locale?: string) => {
  const allPosts = await getAllPosts(locale);
  const sortedPosts = allPosts.sort(
    (a, b) => -dayjs(a.frontmatter.date).diff(dayjs(b.frontmatter.date))
  );
  return sortedPosts;
};

export const getAllPostTagsByOccurTimes = async (locale: string) => {
  const allPosts = await getAllPosts(locale);
  let result: { value: string; count: number }[] = [];
  const allTags = allPosts.flatMap((post) => post.frontmatter.tags || []);
  allTags.forEach((tag) => {
    const tagIndex = result.findIndex((i) => i.value === tag);
    if (tagIndex < 0) return result.push({ value: tag, count: 1 });
    result[tagIndex] = { value: tag, count: result[tagIndex].count + 1 };
  });
  return result;
};

export const getAllTagsWithLocale = async () => {
  const allPosts = await getAllPosts();
  let allTags: { locale: string; tag: string }[] = [];
  allPosts.forEach((post) => {
    const postTags = post.frontmatter.tags || [];
    const postLocale = post.locale || i18n.defaultLocale;
    allTags = allTags.concat(
      postTags.map((tag) => ({ locale: postLocale, tag }))
    );
  });
  return allTags;
};

export const getSortedPostsByTags = async (tag: string, locale: string) => {
  const posts = await getAllPosts(locale);
  return posts
    .sort((a, b) => -dayjs(a.frontmatter.date).diff(dayjs(b.frontmatter.date)))
    .filter((i) => (i.frontmatter.tags || []).includes(tag));
};

export const generateRssFeed = async () => {
  const feed = new Feed({
    title: `${AUTHOR_NAME}'s blog`,
    description: `${AUTHOR_NAME}'s blog`,
    id: SITE_URL,
    link: SITE_URL,
    favicon: `${SITE_URL}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, ${AUTHOR_NAME}`,
    updated: new Date(),
    feedLinks: {
      rss2: `${SITE_URL}/rss/feed.xml`,
      json: `${SITE_URL}/rss/feed.json`,
    },
  });

  const posts = await getAllPosts();

  for (const post of posts) {
    feed.addItem({
      title: post.frontmatter.title + ` (${post.locale.toUpperCase()})`,
      id: post.url,
      link: post.url,
      description: post.frontmatter.excerpt,
      content: post.compiledSource,
      author: [
        {
          name: AUTHOR_NAME,
        },
      ],
      date: new Date(post.frontmatter.date),
    });
  }
  fs.mkdirSync("./public/rss", { recursive: true });
  fs.writeFileSync("./public/rss/feed.xml", feed.rss2());
  fs.writeFileSync("./public/rss/feed.json", feed.json1());
};
