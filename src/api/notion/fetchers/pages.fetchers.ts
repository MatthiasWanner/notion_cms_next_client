import { isFullBlock } from '@notionhq/client';
import {
  BlockObjectResponse,
  ImageBlockObjectResponse
} from '@notionhq/client/build/src/api-endpoints';
import { pagesProperties, pagesTypes } from '../constants';
import { notion } from '../client';
import {
  extractPagePropertyValue,
  getBlockContent,
  getImageBlockUrl
} from '../utils';

const pagesDatabaseId = process.env.NOTION_PAGES_DATABASE_ID ?? '';

export const getAllPages = async () =>
  await notion.databases.query({
    database_id: pagesDatabaseId
  });

const getHomepageId = async () => {
  try {
    const [homepageInfos] = (
      await notion.databases.query({
        database_id: pagesDatabaseId,
        filter: {
          property: pagesProperties.TYPE,
          multi_select: {
            contains: pagesTypes.HOME
          }
        }
      })
    ).results;

    return homepageInfos ? homepageInfos.id : null;
  } catch {
    return null;
  }
};

export const getHomepageContent = async () => {
  try {
    const homepageId = (await getHomepageId()) ?? '';

    const homepageTitle = extractPagePropertyValue(
      await notion.pages.properties.retrieve({
        page_id: homepageId,
        property_id: 'title'
      })
    );

    const { results: homepageBlocks } = await notion.blocks.children.list({
      block_id: homepageId
    });

    const carouselPictures = await getCarouselPictures(
      homepageBlocks as BlockObjectResponse[]
    );

    const homepageContent = homepageBlocks
      .filter((b) => isFullBlock(b) && b.type !== 'callout')
      .map((block) => getBlockContent(block));

    return {
      pageTitle: homepageTitle,
      carouselPictures,
      content: homepageContent
    };
  } catch {
    return null;
  }
};

const getCarouselPictures = async (blocksChildrens: BlockObjectResponse[]) => {
  const carouselCalloutBlockId = blocksChildrens.find(
    (block) => block.type === 'callout'
  )?.id;

  if (carouselCalloutBlockId) {
    return (
      // list of homePage callout blocks childrens
      (
        await notion.blocks.children.list({
          block_id: carouselCalloutBlockId
        })
      ).results
        .filter((block) => (block as BlockObjectResponse).type === 'image')
        .map((carouselItem) => ({
          blockId: carouselItem.id,
          pictureUrl: getImageBlockUrl(carouselItem as ImageBlockObjectResponse)
        }))
    );
  } else {
    return [];
  }
};
