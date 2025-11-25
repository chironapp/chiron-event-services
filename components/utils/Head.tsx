import ExpoHead from "expo-router/head";
import React from "react";

/**
 * Props for the Head component
 */
export interface HeadProps {
  /** Page title */
  title?: string;
  /** Page description for SEO */
  description?: string;
  /** Keywords for SEO */
  keywords?: string;
  /** Author name */
  author?: string;
  /** Open Graph site name */
  ogSiteName?: string;
  /** Open Graph title */
  ogTitle?: string;
  /** Open Graph description */
  ogDescription?: string;
  /** Open Graph image URL */
  ogImage?: string;
  /** Open Graph image width */
  ogImageWidth?: string;
  /** Open Graph image height */
  ogImageHeight?: string;
  /** Open Graph image type */
  ogImageType?: string;
  /** Open Graph locale */
  ogLocale?: string;
  /** Twitter card type */
  twitterCard?: string;
  /** Twitter title */
  twitterTitle?: string;
  /** Twitter description */
  twitterDescription?: string;
  /** Twitter image URL */
  twitterImage?: string;
  /** Theme color */
  themeColor?: string;
}

/**
 * Default values for the Head component
 */
const defaults: Required<HeadProps> = {
  title: "Chiron Event Services – Professional Race Timing",
  description:
    "Chiron Event Services provides professional race timing, start lists, athlete registrations, and real-time race results for sports events of all sizes.",
  keywords:
    "race timing, sport event timing, running, athletics, race start lists, race results",
  author: "Typhon Solutions",
  ogSiteName: "Chiron Event Services",
  ogTitle: "Chiron Event Services – Professional Race Timing",
  ogDescription:
    "Professional sports timing system. Accurate race timing, athlete registrations, start lists and instant race results.",
  ogImage: "/images/og-image-bg.png",
  ogImageWidth: "1200",
  ogImageHeight: "630",
  ogImageType: "image/png",
  ogLocale: "en_US",
  twitterCard: "summary_large_image",
  twitterTitle: "Chiron Event Services – Professional Race Timing",
  twitterDescription:
    "Accurate race timing, start lists, athlete registrations and real-time race results.",
  twitterImage: "/images/og-image-bg.png",
  themeColor: "#6A1B9A",
};

/**
 * Head component for managing document head meta tags
 *
 * Provides SEO, Open Graph, and Twitter Card meta tags with customizable values.
 * All props have default values suitable for the main site.
 *
 * @param props - HeadProps with optional overrides for default values
 * @returns Head element with meta tags
 */
export function Head(props: HeadProps) {
  const {
    title = defaults.title,
    description = defaults.description,
    keywords = defaults.keywords,
    author = defaults.author,
    ogSiteName = defaults.ogSiteName,
    ogTitle = defaults.ogTitle,
    ogDescription = defaults.ogDescription,
    ogImage = defaults.ogImage,
    ogImageWidth = defaults.ogImageWidth,
    ogImageHeight = defaults.ogImageHeight,
    ogImageType = defaults.ogImageType,
    ogLocale = defaults.ogLocale,
    twitterCard = defaults.twitterCard,
    twitterTitle = defaults.twitterTitle,
    twitterDescription = defaults.twitterDescription,
    twitterImage = defaults.twitterImage,
    themeColor = defaults.themeColor,
  } = props;

  return (
    <ExpoHead>
      <title>{title}</title>

      {/* Basic SEO */}
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={ogSiteName} />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content={ogImageWidth} />
      <meta property="og:image:height" content={ogImageHeight} />
      <meta property="og:image:type" content={ogImageType} />
      <meta property="og:locale" content={ogLocale} />

      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={twitterTitle} />
      <meta name="twitter:description" content={twitterDescription} />
      <meta name="twitter:image" content={twitterImage} />

      {/* Theme */}
      <meta name="theme-color" content={themeColor} />
    </ExpoHead>
  );
}

export default Head;
