import { UIExtensionPosition, UIExtensionType } from '../../src/types';

export default {
  list: [
    {
      uuid: 'd414135b-ff4d-44e1-8cb6-fce64cbe29c0',
      name: 'my_awesome_button_extension',
      type: 'iframe' as UIExtensionType,
      position: 'pim.product.tab' as UIExtensionPosition,
      configuration: {
        url: 'https://www.example.com',
        labels: {
          en_US: 'My awesome link extension',
          fr_FR: 'Ma super link extension',
        },
        default_label: 'My awesome link extension',
      },
      status: 'active',
      version: 'V1.02.3',
      description: 'A short human readable description.',
    },
  ],
  create: {
    uuid: 'd414135b-ff4d-44e1-8cb6-fce64cbe29c0',
    name: 'my_awesome_button_extension',
    type: 'iframe' as UIExtensionType,
    position: 'pim.product.tab' as UIExtensionPosition,
    configuration: {
      url: 'https://www.example.com',
      labels: {
        en_US: 'My awesome link extension',
        fr_FR: 'Ma super link extension',
      },
      default_label: 'My awesome link extension',
    },
    status: 'active',
    version: 'V1.02.3',
    description: 'A short human readable description.',
  },
  update: {
    uuid: 'd414135b-ff4d-44e1-8cb6-fce64cbe29c0',
    name: 'my_awesome_button_extension',
    type: 'link' as UIExtensionType,
    position: 'pim.product.header' as UIExtensionType,
    configuration: {
      url: 'https://www.example.com',
      labels: {
        en_US: 'My awesome link extension',
        fr_FR: 'Ma super link extension',
      },
      default_label: 'My awesome link extension',
    },
    status: 'active',
    version: 'V1.02.4',
    description: 'A short human readable description.',
  },
};
