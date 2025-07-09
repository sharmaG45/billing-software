// renderer/pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html>
            <Head>
                {/* Optional: Fonts, meta, etc */}
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
