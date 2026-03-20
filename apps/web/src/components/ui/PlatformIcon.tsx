import { SocialIcon } from "react-social-icons";
import { getPlatformColor, getPlatformBgColor } from "@/lib/constants";

export type Platform =
  | "instagram"
  | "tiktok"
  | "twitter"
  | "youtube"
  | "facebook"
  | "linkedin"
  | "pinterest"
  | "threads"
  | "whatsapp"
  | "reddit"
  | "bluesky"
  | "google"
  | "telegram"
  | "snapchat";

// Mapping for platforms not directly supported by react-social-icons
const networkMapping: Record<Platform, string> = {
  instagram: "instagram",
  tiktok: "tiktok",
  twitter: "x",
  youtube: "youtube",
  facebook: "facebook",
  linkedin: "linkedin",
  pinterest: "pinterest",
  threads: "threads",
  whatsapp: "whatsapp",
  reddit: "reddit",
  bluesky: "bsky.app",
  google: "google",
  telegram: "telegram",
  snapchat: "snapchat",
};

interface PlatformIconProps {
  platform: Platform | string;
  size?: number;
  className?: string;
}

export function PlatformIcon({
  platform,
  size = 20,
  className,
}: PlatformIconProps) {
  const network = networkMapping[platform as Platform] || platform;

  return (
    <SocialIcon
      network={network}
      as="span"
      style={{ height: size, width: size }}
      className={className}
    />
  );
}

export { getPlatformColor, getPlatformBgColor };

export const allPlatforms: Platform[] = [
  "instagram",
  "tiktok",
  "twitter",
  "youtube",
  "facebook",
  "linkedin",
  "pinterest",
  "threads",
  "whatsapp",
  "reddit",
  "bluesky",
  "google",
  "telegram",
  "snapchat",
];
