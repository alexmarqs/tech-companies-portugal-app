import type { HeadingParts } from "./types";

export const isRemoteLocation = (location: string) =>
  location.toLowerCase() === "remote";

/**
 * "Remote" is a pseudo-location, so it leads the heading instead of being
 * slotted into "in {location}". Split so the location can be tinted.
 */
export const locationHeadingParts = (location: string): HeadingParts =>
  isRemoteLocation(location)
    ? { lead: "", name: "Remote", trail: "Tech Companies" }
    : { lead: "Tech Companies in", name: location, trail: "" };

/** The heading sits under a breadcrumb, so it leaves "Portugal" to the title. */
export const locationPageHeading = (location: string) => {
  const { lead, name, trail } = locationHeadingParts(location);

  return [lead, name, trail].filter(Boolean).join(" ");
};

export const locationPageTitle = (location: string) =>
  isRemoteLocation(location)
    ? `${locationPageHeading(location)} in Portugal`
    : `${locationPageHeading(location)}, Portugal`;

const remoteBlurb =
  "Explore startups, scaleups, and global tech teams that work remotely from Portugal.";

const presenceBlurb = (where: string) =>
  `Explore startups, scaleups, and global tech teams with a presence in ${where}.`;

export const locationPageDescription = (location: string) =>
  isRemoteLocation(location)
    ? remoteBlurb
    : presenceBlurb(`${location}, Portugal`);

/** The page names the country around it already, so the intro leaves it out. */
export const locationPageIntro = (location: string) =>
  isRemoteLocation(location) ? remoteBlurb : presenceBlurb(location);
