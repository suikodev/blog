import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { NextSeo } from "next-seo";
import AnimateContainer from "~/components/AnimateContainer";
import { AUTHOR_NAME, FRIEND_LINKS } from "~/lib/constants";
import { motion } from "framer-motion";
import React from "react";
import RotateEmoji from "./RotateEmoji";

const Links = () => {
  const { t } = useTranslation();
  const title = t("linksPageTitle", { author: AUTHOR_NAME });
  return (
    <>
      <NextSeo title={title} />
      <AnimateContainer>
        <div className="hero py-16">
          <div className="hero-content text-center">
            <div className="max-w-4xl ">
              <div className="py-6  pb-12">
                <h1 className="text-4xl font-bold text-primary">
                  {title}
                  <RotateEmoji
                    initialEmoji={0}
                    className={"inline-block w-12 h-12 align-middle"}
                  />
                </h1>
              </div>
              <ul className="flex flex-col gap-6">
                {FRIEND_LINKS.map((i) => (
                  <motion.li whileHover={{ scale: 1.1 }} key={i.link}>
                    <a href={i.link} target="_blank" rel="noreferrer">
                      <h2 className="text-3xl font-bold text-primary underline underline-offset-4 mb-2">
                        {i.name}
                      </h2>
                      <p className="font-light text-xl">{i.description}</p>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </AnimateContainer>
    </>
  );
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default Links;
