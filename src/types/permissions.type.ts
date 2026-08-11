export type ViewEditPermission = {
  canView: 'true' | 'false';
  canEdit: 'true' | 'false';
};

export type LocalePermissions = {
  userUuid: string;
  locales: { [localeCode: string]: ViewEditPermission };
};

export type ChannelPermissions = {
  userUuid: string;
  channels: { [channelCode: string]: ViewEditPermission };
};
