import '../styles/globals.css'
import Head from 'next/head'
import { Globe } from 'react-feather'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>P.BnB</title>
        <meta
          name='description'
          content='Find holiday rentals, cabins, beach houses, unique homes and experiences around the world – all made possible by Hosts on Blue Dream Technologies.'
        />
        <link rel={Globe} href={Globe} />
      </Head>

      <Component {...pageProps} />
    </>
  )
}

export default MyApp
