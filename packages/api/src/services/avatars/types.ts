export type AvatarStorage = {
  isOwnUrl: (url: string, userId: string) => boolean;
  removeAllForUser: (userId: string) => Promise<void>;
};
