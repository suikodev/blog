import dayjs from "dayjs";
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import React from "react";
import NoScrollLink from "~/components/NoScrollLink";
import { BookOpenIcon } from "@heroicons/react/outline";
import { Post } from "~/lib/api";
import "dayjs/locale/zh";
import { useRouter } from "next/router";

type PostListProps = {
  posts: Post[];
};

const PostList: React.FC<PostListProps> = ({ posts }) => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  return (
    <>
      {posts?.map((post, index) => (
        <NoScrollLink key={post.route} href={`/blog/${post.route}`} passHref>
          <motion.a className="inline-block w-full bg-gradient-to-b from-primary to-secondary">
            <motion.article
              whileHover={{
                x: 10,
              }}
              className={`grid md:h-56 gap-3 py-8 px-4 bg-base-100 transparent md:gap-6 md:grid-cols-4 border-t ${
                index === posts.length - 1 ? "border-b" : ""
              } border-base-content`}
            >
              <div className="flex items-center gap-1 space-x-2 md:flex-col md:justify-center md:items-end md:order-1">
                <time className="text-lg" dateTime={post.frontmatter.date}>
                  {dayjs(post.frontmatter.date)
                    .locale(i18n.language)
                    .format("MMM DD, YYYY")}
                </time>
                <div className="space-x-1 font-light flex items-center">
                  <span className="w-4 h-4 inline-block">
                    <BookOpenIcon />
                  </span>
                  <span>
                    {t("minToRead", { min: post.timeToRead.minutes })}
                  </span>
                </div>
              </div>

              <header
                className={`flex flex-col justify-between space-y-2 ${
                  post.frontmatter.coverImage
                    ? "md:col-span-2"
                    : "md:col-span-3"
                } `}
              >
                <div className="space-y-1">
                  <h2 className="text-3xl md:line-clamp-1 leading-snug tracking-tighter font-bold col-span-2">
                    {post.frontmatter.title}
                  </h2>
                  <div className="space-x-2">
                    {post.frontmatter.tags.map((tag) => (
                      <motion.button
                        key={tag}
                        onClick={(e) => {
                          e.preventDefault();
                          router.push(`/tag/${tag}`, undefined, {
                            locale: i18n.language,
                            scroll: false,
                          });
                        }}
                        whileHover={{ scale: 1.1 }}
                        className="link link-hover link-primary inline-block text-lg font-medium text-gradient-to-b from-primary to-secondary"
                      >
                        #{tag}
                      </motion.button>
                    ))}
                  </div>
                </div>
                <p className="line-clamp-2 font-light text-lg">
                  {post.frontmatter.excerpt}
                </p>
              </header>

              {post.frontmatter.coverImage && (
                <picture className="max-h-52 overflow-hidden rounded-md md:-order-1">
                  <img
                    className="object-cover w-full h-full"
                    src={post.frontmatter.coverImage}
                    alt={t("postCoverImage")}
                  />
                </picture>
              )}
            </motion.article>
          </motion.a>
        </NoScrollLink>
      ))}
    </>
  );
};

export default PostList;
