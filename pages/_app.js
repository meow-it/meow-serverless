import Head from 'next/head'
import Image from 'next/image'
import kitty from "../images/kitty.png"

function MyApp() {
  return (
    <>
      <Head>
        <title>Meow It Serverless</title>
      </Head>

      <div className='wrapper'>
        <Image
          src={kitty}
          width={200}
          height={200}
          alt='Meow It'
        />
        <h1>Meow It ServerLess</h1>
        <h2>All APIs reside at <code>/api</code> </h2>
      </div>

      <style jsx global>{`
        * {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
          font-weight: 400;
        }

        html, body {
          min-height: 100vh;
          margin: 0;
          padding: 0;
        }

        code {
          padding: 0.125em 0.25em;
          background: #faf9fa;
          border: 1px solid #d2d3d7;
          font-size: .9em;
          hyphens: none;
          tab-size: 2;
          text-align: left;
          word-spacing: normal;
          word-break: normal;
          word-wrap: normal;
          box-decoration-break: clone;
          -webkit-box-decoration-break: clone;
          font-family: SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;
        }

        .wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }


      `}</style>
    </>
  )
}

export default MyApp
