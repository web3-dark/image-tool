import { ViteReactSSG } from 'vite-react-ssg'
import { createBrowserRouter } from 'react-router-dom'
import './design-system/tokens.css'
import './design-system/fonts.css'
import './index.css'
import './styles/blog.css'
import { routes } from './routes.jsx'
import { createClientRouterFactory } from './utils/clientRouter.js'
import { getBasePath } from './i18n/paths.js'

export const createRoot = ViteReactSSG(
  { routes, customCreateRouter: createClientRouterFactory(routes, createBrowserRouter) },
  ({ router, isClient }) => {
    if (isClient && router) {
      let previousPath = getBasePath(router.state.location.pathname);
      router.subscribe(({ location }) => {
        const nextPath = getBasePath(location.pathname);
        if (typeof window !== 'undefined' && nextPath !== previousPath) {
          window.scrollTo(0, 0);
        }
        previousPath = nextPath;
      });
    }
  }
)
