import { NextPage } from "next";
import { getAllPostTagsByOccurTimes } from "~/lib/api";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { TagCloud } from "react-tagcloud";
import "dayjs/locale/zh";
import { useTranslation } from "next-i18next";
import React from "react";
import NoScrollLink from "~/components/NoScrollLink";
import { motion } from "framer-motion";
import { NextSeo } from "next-seo";
import AnimateContainer from "~/components/AnimateContainer";

const TagRenderer = (
  tag: {
    value: string;
  },
  size: number,
  color: string
) => {
  return (
    <NoScrollLink
      key={tag.value}
      href={`/tag/${tag.value}`}
      prefetch={false}
      passHref
    >
      <motion.a
        whileHover={{ scale: 1.1 }}
        style={{ fontSize: size, color }}
        className={"link link-hover inline-block tag-cloud-tag text-primary"}
      >
        #{tag.value}
      </motion.a>
    </NoScrollLink>
  );
};

type TagIndexProps = Awaited<ReturnType<typeof getStaticProps>>["props"];

const TagIndex: NextPage<TagIndexProps> = ({ tags }) => {
  const { t } = useTranslation();
  return (
    <>
      <NextSeo title={`${t("allPostTags")}`} />
      <AnimateContainer>
        <div className="hero py-16">
          <div className="hero-content text-center">
            <div className="max-w-4xl">
              <h1 className="py-6 text-4xl font-bold pb-12 text-primary">
                👇{t("allPostTags")}
              </h1>
              <TagCloud
                className="space-x-4 font-bold"
                disableRandomColor
                minSize={24}
                maxSize={40}
                tags={tags}
                renderer={TagRenderer}
              />
            </div>
          </div>
        </div>
      </AnimateContainer>
    </>
  );
};

export async function getStaticProps({ locale }) {
  const tags = await getAllPostTagsByOccurTimes(locale);
  return {
    props: {
      tags,
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default TagIndex;
