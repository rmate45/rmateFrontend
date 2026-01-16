
import React from "react";
import { Helmet } from "react-helmet-async";

const SeoHelmet = ({
  title = "RetireMate",
  description = "",
  image = "",
  url = "",
  noIndex = false,
  structuredData = null,
}) => {
  console.log(image,"image")
  return (
    <Helmet>
      {/* Basic SEO */}
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Canonical */}
      {url && <link rel="canonical" href={url} />}

      {/* Open Graph / Social */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}
      <meta property="og:type" content="article" />

      {/* No index option */}
      {noIndex && <meta name="robots" content="index,follow" />}

      {/* JSON-LD (Structured Data) */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SeoHelmet;
