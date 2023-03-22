import Document, { Html, Head, Main, NextScript } from "next/document";
import Favicon from "~/components/Favicon";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en" data-theme={"light"}>
        <Head>
          <Favicon />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
