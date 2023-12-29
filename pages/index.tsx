import { motion } from "framer-motion";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useAsync } from "react-use";
import NoScrollLink from "~/components/NoScrollLink";

const Triangle = ({
  w = 400,
  h = 200,
  direction = "top",
  color = "#91F5AD",
}) => {
  const points = {
    top: [`${w / 2},0`, `0,${h}`, `${w},${h}`],
    right: [`0,0`, `0,${h}`, `${w},${h / 2}`],
    bottom: [`0,0`, `${w},0`, `${w / 2},${h}`],
    left: [`${w},0`, `${w},${h}`, `0,${h / 2}`],
  };

  return (
    <svg width={w} height={h}>
      <polygon points={points[direction].join(" ")} fill={color} />
      Sorry, your browser does not support inline SVG.
    </svg>
  );
};

const Index = () => {
  const { t } = useTranslation();
  useAsync(async () => {
    const confetti = (await import("canvas-confetti")).default;
    confetti({
      particleCount: 200,
      spread: 150,
      origin: { y: 0.5 },
      colors: ["#91F5AD", "#E072A4"],
    });
  }, []);
  return (
    <div className=" bg-primary min-h-screen flex place-items-center dark:bg-base-100">
      <div className="box-border max-w-screen-xl md:px-8 mx-auto px-6 space-y-8">
        <motion.h1 className="font-extrabold text-secondary dark:text-base-content text-6xl xl:text-9xl tracking-tighter leading-tight">
          {`> ${t("title")}`}
        </motion.h1>
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex justify-center dark:hidden">
        <Triangle color="#91F5AD" />
      </div>
      <div className="absolute bottom-0 left-0 right-0  justify-center hidden dark:flex">
        <Triangle color="#1E293B" />
      </div>
      <div className="flex items-center justify-center gap-4 absolute bottom-8 left-0 right-0">
        <NoScrollLink passHref href={"/blog"}>
          <motion.a
            whileHover={{
              scale: 1.05,
            }}
            whileTap={{ scale: 0.95 }}
            className="link link-primary dark:text-base-content font-bold text-xl"
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
            className="link link-primary dark:text-base-content font-bold text-xl"
          >
            {t("links")}
          </motion.a>
        </NoScrollLink>
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
