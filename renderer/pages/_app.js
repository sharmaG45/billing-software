// pages/_app.js
import '../style/globals.css';
import "@fortawesome/fontawesome-free/css/all.min.css";


export default function MyApp({ Component, pageProps }) {
    return <Component {...pageProps} />;
}
