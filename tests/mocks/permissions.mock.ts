export default {
  getUserLocalePermissions: {
    userUuid: '123e4567-e89b-12d3-a456-426614174000',
    locales: {
      en_US: { canView: true, canEdit: false },
      fr_FR: { canView: true, canEdit: true },
    },
  },
  getUserChannelPermissions: {
    userUuid: '123e4567-e89b-12d3-a456-426614174000',
    channels: {
      ecommerce: { canView: true, canEdit: false },
      mobile: { canView: false, canEdit: false },
    },
  },
};
