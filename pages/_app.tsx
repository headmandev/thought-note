import '../styles/globals.css'
import type { AppInitialProps } from 'next/app'
import { wrapper } from '../app/store'
import App from 'next/app'

class WrappedApp extends App<AppInitialProps> {
  public static getInitialProps = wrapper.getInitialAppProps(
    () => async (context) => {
      return {
        pageProps: {
          ...(await App.getInitialProps(context)).pageProps,
        },
      }
    }
  )

  public render() {
    const { Component, pageProps } = this.props
    return <Component {...pageProps} />
  }
}

export default wrapper.withRedux(WrappedApp)
