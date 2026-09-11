export const isRemoteLocation = (location: string) =>
  location.toLowerCase() === "remote";

/** "Remote" is a pseudo-location, so it cannot be slotted into "in {location}". */
export const locationPageTitle = (location: string) =>
  isRemoteLocation(location)
    ? "Remote Tech Companies in Portugal"
    : `Tech Companies in ${location}, Portugal`;

export const locationPageDescription = (location: string) =>
  isRemoteLocation(location)
    ? "Explore startups, scaleups, and global tech teams that work remotely from Portugal."
    : `Explore startups, scaleups, and global tech teams with a presence in ${location}, Portugal.`;
