import { notion } from '../../notion.client';
const pagesDatabaseId = process.env.NOTION_PAGES_DATABASE_ID ?? '';

export const getAllPages = async () =>
  await notion.databases.query({
    database_id: pagesDatabaseId
  });
