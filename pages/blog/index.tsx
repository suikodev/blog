import { NextPage } from "next";
import { generateRssFeed, getAllSortedPosts } from "~/lib/api";
import AnimateContainer from "~/components/AnimateContainer";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import "dayjs/locale/zh";
import PostList from "../../components/PostList";
import { useTranslation } from "next-i18next";
import { NextSeo } from "next-seo";

type BlogIndexProps = Awaited<ReturnType<typeof getStaticProps>>["props"];

const BlogIndex: NextPage<BlogIndexProps> = ({ posts }) => {
  const { t } = useTranslation();
  return (
    <>
      <NextSeo title={`${t("blogList")}`} description={t("blogIntro")} />
      <AnimateContainer>
        <div className="hero py-16">
          <div className="hero-content text-center">
            <div className="max-w-4xl">
              <h1 className="py-6 text-4xl font-bold">🖖{t("blogIntro")}</h1>
            </div>
          </div>
        </div>
        <div className="pb-16">
          <PostList posts={posts} />
        </div>
      </AnimateContainer>
    </>
  );
};

export async function getStaticProps({ locale }) {
  await generateRssFeed();
  const posts = await getAllSortedPosts(locale);
  return {
    props: {
      posts,
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default BlogIndex;
