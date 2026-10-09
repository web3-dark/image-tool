import { ViteReactSSG } from 'vite-react-ssg'
import { createBrowserRouter } from 'react-router-dom'
import './design-system/tokens.css'
import './design-system/fonts.css'
import './index.css'
import './styles/blog.css'
import { routes } from './routes.jsx'
import { createClientRouterFactory } from './utils/clientRouter.js'

export const createRoot = ViteReactSSG(
  { routes, customCreateRouter: createClientRouterFactory(routes, createBrowserRouter) },
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
