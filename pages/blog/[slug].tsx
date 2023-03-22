import { MDXRemote } from "next-mdx-remote";
import {
  getPostByPath,
  Post as PostType,
  getAllSortedPosts,
  postsDirectory,
} from "~/lib/api";
import { NextPage } from "next";
import AnimateContainer from "~/components/AnimateContainer";
import {
  AUTHOR_NAME,
  SITE_URL,
  TWIKOO_URL,
  TWITTER_USERNAME,
} from "~/lib/constants";
import dayjs from "dayjs";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ArrowUpIcon } from "@heroicons/react/solid";
import Prism from "prismjs";
import { useEffect, useRef, useState } from "react";
import { useCopyToClipboard } from "react-use";
import { motion } from "framer-motion";
import {
  ClipboardCopyIcon,
  ClipboardCheckIcon,
  BookOpenIcon,
  ClockIcon,
} from "@heroicons/react/outline";
import "dayjs/locale/zh";
import { useTranslation } from "next-i18next";
import TocButton from "~/components/TocButton";
import React from "react";
import { ArticleJsonLd, NextSeo } from "next-seo";
import Script from "next/script";
import NoScrollLink from "~/components/NoScrollLink";
import { join } from "path";

const Pre = (props) => {
  const { t } = useTranslation();
  const [, copyToClipboard] = useCopyToClipboard();
  const [copied, setCopied] = useState(false);
  const timeOutIdRef = useRef(0);
  useEffect(() => {
    if (copied === true) {
      timeOutIdRef.current = window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  }, [copied]);
  return (
    <div className="relative">
      <button
        aria-label={t("copyButtonAccessibleName")}
        onClick={() => {
          clearTimeout(timeOutIdRef.current);
          copyToClipboard(props.children.props.children);
          setCopied(true);
        }}
        className="absolute right-1 top-1"
      >
        {!copied && (
          <ClipboardCopyIcon className="w-5 h-5 opacity-80 text-white" />
        )}
        {copied && (
          <ClipboardCheckIcon className="w-5 h-5 opacity-80 text-success" />
        )}
      </button>
      <pre {...props}>{props?.children}</pre>
    </div>
  );
};

const Post: NextPage<{ post: PostType }> = ({ post }) => {
  useEffect(() => {
    Prism.highlightAll();
  }, []);
  const { i18n, t } = useTranslation();
  return (
    <>
      <Script
        id="twikoo"
        strategy="afterInteractive"
        src="https://rorsch-1256426089.file.myqcloud.com/public/libs/twikoo/1.6.7/twikoo.all.min.js"
        onReady={() => {
          twikoo.init({
            envId: TWIKOO_URL,
            el: "#comment",
            lang: i18n.language,
          });
        }}
      ></Script>
      <NextSeo
        title={post.frontmatter.title}
        description={post.frontmatter.excerpt}
        openGraph={{
          title: post.frontmatter.title,
          siteName: t("title"),
          url: post.url,
          type: "article",
          article: {
            publishedTime: post.frontmatter.title,
            authors: [AUTHOR_NAME],
            tags: post.frontmatter.tags,
          },
          images: [
            { url: post.frontmatter.ogImage || post.frontmatter.coverImage },
          ],
        }}
        twitter={{
          cardType: "summary_large_image",
          handle: `@${TWITTER_USERNAME}`,
        }}
      />
      <ArticleJsonLd
        url={post.url}
        title={post.frontmatter.title}
        images={[post.frontmatter.ogImage || post.frontmatter.coverImage]}
        datePublished={post.frontmatter.date}
        authorName={[
          {
            name: AUTHOR_NAME,
            url: SITE_URL,
          },
        ]}
        publisherName={AUTHOR_NAME}
        description={post.frontmatter.excerpt}
        isAccessibleForFree={true}
      />
      <AnimateContainer>
        <article>
          <header className="max-w-4xl mx-auto flex flex-col py-8 gap-6 justify-center items-center">
            <div className="flex gap-2 py-6 flex-col items-center">
              <h1 className="text-5xl text-center mt-6 mb-8 lg:[font-size:3rem] font-bold">
                {post.frontmatter.title}
              </h1>
              <div className="space-x-3 flex items-center">
                <span className="space-x-1 flex items-center">
                  <span className="w-4 h-4 inline-block">
                    <ClockIcon />
                  </span>
                  <time dateTime="post.frontmatter.date">
                    {dayjs(post.frontmatter.date)
                      .locale(i18n.language)
                      .format("MMM DD, YYYY")}
                  </time>
                </span>
                <span className="space-x-1 flex items-center">
                  <span className="w-4 h-4 inline-block">
                    <BookOpenIcon />
                  </span>
                  <span>
                    {t("minToRead", { min: post.timeToRead.minutes })}
                  </span>
                </span>
              </div>

              <div className="space-x-2">
                {post.frontmatter.tags.map((tag) => (
                  <NoScrollLink
                    key={tag}
                    href={`/tag/${tag}`}
                    prefetch={false}
                    passHref
                  >
                    <motion.a
                      whileHover={{ scale: 1.1 }}
                      className="link link-hover link-primary inline-block text-lg font-medium text-gradient-to-b from-primary to-secondary"
                    >
                      #{tag}
                    </motion.a>
                  </NoScrollLink>
                ))}
              </div>
            </div>
            {post.frontmatter.coverImage && (
              <picture className="md:max-h-[40rem] w-full mb-6 items-center overflow-hidden rounded-lg">
                <img
                  className="object-cover w-full h-full"
                  src={post.frontmatter.coverImage}
                  alt={t("postCoverImage")}
                />
              </picture>
            )}
          </header>
          <section className="prose prose-base max-w-4xl md:prose-lg  mx-auto prose-img:w-full">
            <MDXRemote {...post} components={{ pre: Pre }} />
          </section>
        </article>

        <div className="flex flex-col items-center w-full max-w-4xl py-10 mx-auto">
          <div className="divider" />
          <h2 className="text-2xl md:text-3xl font-bold w-full py-6">
            {t("comments")}
          </h2>
          <div className="w-full">
            <div id="comment" />
          </div>
        </div>
      </AnimateContainer>
      <TocButton headings={post.headings} />
      <motion.button
        onClick={() => window.scroll(0, 0)}
        initial={{
          x: 0,
        }}
        animate={{
          x: 30,
          transition: {
            delay: 3,
          },
        }}
        whileHover={{
          x: 0,
          transition: {
            duration: 0.1,
          },
        }}
        className="btn btn-circle btn-xl fixed bottom-2 right-2"
        aria-label={t("goToTopButtonAccessibleName")}
      >
        <ArrowUpIcon className="w-6 h-6" />
      </motion.button>
    </>
  );
};

export async function getStaticProps({
  params,
  locale,
}: {
  params: { slug: string };
  locale: string;
}) {
  const post = await getPostByPath(join(postsDirectory, locale, params.slug));
  return {
    props: {
      post: post,
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export async function getStaticPaths() {
  const posts = await getAllSortedPosts();

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.route,
        },
        locale: post.locale,
      };
    }),
    fallback: false,
  };
}

export default Post;
