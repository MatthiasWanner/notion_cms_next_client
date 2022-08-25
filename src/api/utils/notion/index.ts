import {
  GetPagePropertyResponse,
  ImageBlockObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

export const getImageBlockUrl = (imageBlock: ImageBlockObjectResponse) => {
  const imageType = imageBlock.image.type;
  return imageType === 'external'
    ? imageBlock.image.external.url
    : imageBlock.image.file.url;
};


// Have to manage all cases
export const extractPagePropertyValue = (property: GetPagePropertyResponse) => {
  if (property.type !== 'property_item') return '';

  const [propertyItem] = property.results;

  switch (propertyItem.type) {
    case 'title':
      return propertyItem.title.plain_text;
    default:
      return '';
  }
};
