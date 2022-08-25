import {
  ImageBlockObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

export const getImageBlockUrl = (imageBlock: ImageBlockObjectResponse) => {
  const imageType = imageBlock.image.type;
  return imageType === 'external'
    ? imageBlock.image.external.url
    : imageBlock.image.file.url;
};

