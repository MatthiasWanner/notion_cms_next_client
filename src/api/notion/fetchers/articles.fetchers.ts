import { notion } from '../client';

export const articlesDatabase = async () =>
  await notion.databases.query({
    database_id: process.env.NOTION_ARTICLES_DATABASE_ID ?? ''
  });
