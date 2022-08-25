import { isFullBlock } from '@notionhq/client';
import {
  BlockObjectResponse,
  GetPagePropertyResponse,
  ImageBlockObjectResponse,
  PageObjectResponse,
  ParagraphBlockObjectResponse,
  PartialBlockObjectResponse,
  PropertyItemListResponse,
  PropertyItemObjectResponse
} from '@notionhq/client/build/src/api-endpoints';

export const getImageBlockUrl = (imageBlock: ImageBlockObjectResponse) => {
  const imageType = imageBlock.image.type;
  return imageType === 'external'
    ? imageBlock.image.external.url
    : imageBlock.image.file.url;
};

export const getBlockContent = (
  notionBlock: BlockObjectResponse | PartialBlockObjectResponse
) => {
  if (!isFullBlock(notionBlock)) return null;
  switch (notionBlock.type) {
    case 'paragraph':
      return getParagraphContent(notionBlock);
    default:
      return null;
  }
};

export const getParagraphContent = (
  paragraphBlock: ParagraphBlockObjectResponse
) => {
  const paragraphText = paragraphBlock.paragraph.rich_text;
  return paragraphText.length
    ? paragraphText.map(({ type, plain_text, href, annotations }) => ({
        type: type,
        content: plain_text,
        href,
        annotations
      }))
    : '';
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

// export const getPageContent = (blocksChildrens: (BlockObjectResponse | PartialBlockObjectResponse)[]) => {

// };
