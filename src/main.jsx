import { ViteReactSSG } from 'vite-react-ssg'
import './design-system/tokens.css'
import './design-system/fonts.css'
import './index.css'
import './styles/blog.css'
import { routes } from './routes.jsx'

export const createRoot = ViteReactSSG(
  { routes },
  ({ router, isClient }) => {
    if (isClient && router) {
      router.subscribe(() => {
        if (typeof window !== 'undefined') {
          window.scrollTo(0, 0);
        }
      });
    }
  }
)
