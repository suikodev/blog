import React from "react";
import { Trans } from "react-i18next";
import {
  GITHUB_SOCIAL_URL,
  TWITTER_SOCIAL_URL,
  TELEGRAM_SOCIAL_URL,
} from "~/lib/constants";
import SocialLink from "./SocialLink";

const Bio = () => {
  return (
    <Trans ns="common" i18nKey={"bio"}>
      Just a regular software engineer. Find me on
      <SocialLink href={GITHUB_SOCIAL_URL} key={1}>
        Github
      </SocialLink>
      ,
      <SocialLink href={TWITTER_SOCIAL_URL} key={2}>
        Twitter
      </SocialLink>
      or
      <SocialLink href={TELEGRAM_SOCIAL_URL} key={3}>
        Telegram
      </SocialLink>
      .
    </Trans>
  );
};

export default React.memo(Bio);
