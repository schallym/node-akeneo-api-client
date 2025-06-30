import { ProductMediaFileType } from '../../src/types';

const productMediaFileMock: ProductMediaFileType = {
  _links: {
    download: {
      href: 'https://akeneo.test/api/rest/v1/media-files/media_1/download',
    },
  },
  code: 'media_1',
  original_filename: 'img.jpg',
  mime_type: 'image/jpeg',
  size: 123,
  extension: 'jpg',
};

export default {
  get: productMediaFileMock,
  download: new ArrayBuffer(123),
};
