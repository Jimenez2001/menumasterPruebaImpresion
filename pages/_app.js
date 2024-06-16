import '@/styles/globals.css'
import { MenuMasterProvider } from '../context/MenuMasterProvider'
export default function App({ Component, pageProps }) {
  return (
    <MenuMasterProvider>

      <Component {...pageProps} />

    </MenuMasterProvider>
  );
}
