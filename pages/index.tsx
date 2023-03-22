import { motion } from "framer-motion";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useAsync } from "react-use";
import NoScrollLink from "~/components/NoScrollLink";
import Bio from "~/components/Header/Bio";
import { TITLE_GRADIENT } from "~/lib/constants";

const Index = () => {
  const { t } = useTranslation();
  useAsync(async () => {
    const confetti = (await import("canvas-confetti")).default;
    confetti({
      particleCount: 120,
      spread: 120,
      origin: { y: 0.6 },
    });
  }, []);
  return (
    <div className="bg-gradient-to-br from-primary to-secondary min-h-screen flex place-items-center dark:from-base-100 dark:to-base-200">
      <div className="box-border max-w-screen-xl md:px-8 mx-auto px-6 space-y-8">
        <motion.h1
          animate={{
            background: TITLE_GRADIENT,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            transition: {
              duration: 0.5,
              repeat: Infinity,
              repeatType: "reverse",
            },
          }}
          className="font-extrabold text-transparent bg-clip-text text-6xl xl:text-7xl  tracking-tighter leading-tight dark:text-base-content"
        >
          {`> ${t("title")}`}
        </motion.h1>
        <div>
          <motion.h2 className="font-extrabold leading-tight lg:my-10 text-3xl md:text-5xl my-5  text-primary-content dark:text-base-content">
            😎 {t("indexGreetings")}
          </motion.h2>
          <motion.p className="font-light text-xl lg:text-2xl text-primary-content py-4 dark:text-base-content ">
            <Bio />
          </motion.p>
        </div>
        <div className="flex items-center gap-4 mt-6">
          <span className="text-4xl xl:text-6xl md:text-5xl">👉</span>
          <NoScrollLink passHref href={"/blog"}>
            <motion.a
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{ scale: 0.95 }}
              className="btn  px-12"
            >
              {t("blog")}
            </motion.a>
          </NoScrollLink>
          <NoScrollLink passHref href={"/links"}>
            <motion.a
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{ scale: 0.95 }}
              className="btn px-12"
            >
              {t("links")}
            </motion.a>
          </NoScrollLink>
        </div>
      </div>
    </div>
  );
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      hideFooter: true,
      hideHeader: true,
    },
  };
}

export default Index;
