import type { NextPage } from 'next'
import EditorPage from '../components/EditorPage/EditorPage'
import Head from 'next/head'
import { useAppSelector } from '../app/hooks'
import { selectTitle } from '../app/AppSlice'

const Home: NextPage = () => {
  const title = useAppSelector(selectTitle)
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          name="description"
          content="Editor for saving and sharing notes"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <EditorPage />
    </>
  )
}

export default Home
