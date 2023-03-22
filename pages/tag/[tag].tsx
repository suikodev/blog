import { NextPage } from "next";
import { getAllTagsWithLocale, getSortedPostsByTags } from "~/lib/api";
import AnimateContainer from "~/components/AnimateContainer";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import "dayjs/locale/zh";
import PostList from "~/components/PostList";
import { NextSeo } from "next-seo";

type PostsByTagProps = Awaited<ReturnType<typeof getStaticProps>>["props"];

const PostsByTag: NextPage<PostsByTagProps> = ({ posts, tag }) => {
  return (
    <>
      <NextSeo title={`#${tag}`} />
      <AnimateContainer>
        <div className="w-full md:h-44 py-8 flex justify-center items-center">
          <span className="text-5xl text-base-content font-extrabold">
            #{tag}
          </span>
        </div>
        <div className="pb-16">
          <PostList posts={posts} />
        </div>
      </AnimateContainer>
    </>
  );
};

export async function getStaticProps({ locale, params }) {
  const posts = await getSortedPostsByTags(params.tag, locale);
  return {
    props: {
      tag: params.tag,
      posts: posts,
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export async function getStaticPaths() {
  const tagsWithLocale = await getAllTagsWithLocale();

  return {
    paths: tagsWithLocale.map((tagsWithLocale) => {
      return {
        params: {
          tag: tagsWithLocale.tag,
        },
        locale: tagsWithLocale.locale,
      };
    }),
    fallback: false,
  };
}

export default PostsByTag;
