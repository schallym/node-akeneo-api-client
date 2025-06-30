export type ProductMediaFileType = {
  _links: {
    download: {
      href: string;
    };
  };
  code: string;
  original_filename: string;
  mime_type: string;
  size: number;
  extension: string;
};
