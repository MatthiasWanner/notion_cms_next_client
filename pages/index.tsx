import type {
  GetStaticProps,
  GetStaticPropsResult,
  InferGetStaticPropsType,
  NextPage
} from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { getHomepageContent } from '../src/api/fetchers/notion';
import styles from '../styles/Home.module.css';

interface IProps {
  carouselPictures: {
    blockId: string;
    pictureUrl: string;
  }[];
  pageTitle: string;
}

const Home: NextPage<IProps> = ({
  pageTitle,
  carouselPictures
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Notion CMS Client</title>
        <meta name="description" content="A website managed by Notion" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>{pageTitle}</h1>
        <header>
          {carouselPictures.map((image) => (
            <Image
              key={image.blockId}
              src={image.pictureUrl}
              alt=""
              width={300}
              height={200}
            />
          ))}
        </header>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
};

export const getStaticProps: GetStaticProps<IProps> = async (): Promise<
  GetStaticPropsResult<IProps>
> => {
  const props = await getHomepageContent();

  if (!props) return { notFound: true };

  return {
    props
  };
};

export default Home;
