export type ViewEditPermission = {
  canView: boolean;
  canEdit: boolean;
};

export type LocalePermissions = {
  userUuid: string;
  locales: { [localeCode: string]: ViewEditPermission };
};

export type ChannelPermissions = {
  userUuid: string;
  channels: { [channelCode: string]: ViewEditPermission };
};
