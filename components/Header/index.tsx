import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Container from "~/components/Container";
import { GlobeAltIcon } from "@heroicons/react/outline";
import MdNav from "./MdNav";
import Nav from "./Nav";
import ThemeToggle from "./ThemeToggle";
import { useTranslation } from "next-i18next";
import languages from "~/constants/languages.json";
import LocaleLink from "../LocaleLink";
import { useRouter } from "next/router";
import rotate from "~/animates/rotate";
import Bio from "./Bio";
import { TITLE_GRADIENT } from "~/lib/constants";

const Header = () => {
  const router = useRouter();
  const { pathname, asPath, query } = router;
  const { t, i18n } = useTranslation();
  const [isFixedNav, setIsFixedNav] = useState(false);

  useEffect(() => {
    const foo = () => {
      setIsFixedNav(window.scrollY > 0);
    };
    window.addEventListener("scroll", foo);
    return () => window.removeEventListener("scroll", foo);
  }, []);

  return (
    <header className="from-primary to-secondary text-primary-content bg-gradient-to-br pt-8 pb-12 md:pb-0">
      <Container>
        <div className="flex-col md:flex-row flex md:justify-between">
          <motion.div
            layout
            className={`flex w-full justify-between z-10 ${
              isFixedNav
                ? "p-4 top-0 left-0 fixed  shadow bg-gradient-to-br from-primary to-secondary text-primary-content"
                : "bg-transparent"
            } md:from-transparent md:to-transparent md:shadow-none md:p-0 md:static md:order-1 md:w-auto`}
          >
            <Nav />
            <div className="grid gap-4 grid-cols-2 items-center">
              <ThemeToggle />
              <motion.div className="w-7 h-7 dropdown dropdown-end">
                <motion.label tabIndex={0}>
                  <motion.span className="w-7 h-7" whileHover={rotate}>
                    <GlobeAltIcon />
                  </motion.span>
                </motion.label>
                <motion.ul
                  tabIndex={0}
                  className="dropdown-content menu shadow-sm p-2 bg-base-200 text-base-content rounded-box w-44"
                >
                  {languages.map((i) => (
                    <li key={i.code}>
                      <button
                        className={`${
                          i18n.language === i.code ? "active" : ""
                        }`}
                        onClick={() => {
                          i18n.changeLanguage(i.code);
                          router.push({ pathname, query }, asPath, {
                            locale: i.code,
                          });
                          if (document.activeElement instanceof HTMLElement) {
                            document.activeElement.blur();
                          }
                        }}
                      >
                        {i.name}
                      </button>
                    </li>
                  ))}
                </motion.ul>
              </motion.div>
            </div>
          </motion.div>
          <motion.div
            layout
            whileHover={{
              scale: 1.05,
              x: 6,
            }}
            className="flex items-center mt-6 md:mt-0"
          >
            <motion.span
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
              className="text-4xl text-center md:text-left md:text-6xl font-bold tracking-tighter leading-tight"
            >
              <LocaleLink href="/">{`> ${t("title")}`}</LocaleLink>
            </motion.span>
          </motion.div>
        </div>

        <p className="mt-3 text-xl md:mb-9">
          <Bio />
        </p>

        <MdNav />
      </Container>
    </header>
  );
};

export default Header;
