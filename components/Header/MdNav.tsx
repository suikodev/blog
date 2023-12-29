import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React from "react";
import { NAV } from "~/lib/constants";
import NoScrollLink from "../NoScrollLink";

const MdNav: React.FC = () => {
  const router = useRouter();

  const isActiveTab = (href: string) => router.pathname.startsWith(href);
  const { t } = useTranslation();

  return (
    <motion.nav className="hidden py-4 gap-8 text-2xl md:flex md:justify-center">
      {NAV.map((item, i) => (
        <NoScrollLink href={item.href} key={i} passHref>
          <motion.a
            whileTap={{ scale: 0.95 }}
            whileHover={{
              scale: 1.05,
            }}
            className={`font-bold relative text-secondary dark:text-primary-content`}
          >
            {t(item.label)}
            {isActiveTab(item.href) && (
              <motion.div
                layoutId="underline"
                className={`w-full absolute border-b-4 border-secondary dark:border-primary-content`}
              />
            )}
          </motion.a>
        </NoScrollLink>
      ))}
    </motion.nav>
  );
};

export default React.memo(MdNav);
