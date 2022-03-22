import type { NextPageContext } from 'next'
import Head from 'next/head'
import EditorPage from '../components/EditorPage/EditorPage'
import { validate as uuidValidate, version as uuidVersion } from 'uuid'
import { wrapper } from '../app/store'
import {
  defaultTitle,
  getDataAsync,
  selectId,
  selectTitle,
} from '../app/AppSlice'
import { useAppSelector } from '../app/hooks'

const IdPage = () => {
  const id = useAppSelector(selectId)
  const title = useAppSelector(selectTitle)
  return (
    <>
      <Head>
        <title> {title} </title>
        <meta
          name="description"
          content={
            (id ? `${defaultTitle} | ` : '') +
            'Editor for saving and sharing notes'
          }
        />
      </Head>
      <EditorPage />
    </>
  )
}

IdPage.getInitialProps = wrapper.getInitialPageProps(
  (store) => async (ctx: NextPageContext) => {
    if (ctx.query.id && store.getState().editor.id !== ctx.query.id) {
      const uuid = Array.isArray(ctx.query.id) ? ctx.query.id[0] : ctx.query.id
      if (uuidValidate(uuid) && uuidVersion(uuid) === 4) {
        await store.dispatch(getDataAsync(uuid))
      }
    }
  }
)

export default IdPage
