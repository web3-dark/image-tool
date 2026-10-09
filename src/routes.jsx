import RootLayout from './RootLayout.jsx';
import RouteErrorPage from './components/RouteErrorPage.jsx';
import App from './App.jsx';
import BlogIndex from './pages/blog/BlogIndex.jsx';
import JpgCompressToTargetSize from './pages/blog/JpgCompressToTargetSize.jsx';
import PngWebpJpgComparison from './pages/blog/PngWebpJpgComparison.jsx';
import RegistrationPhotoUnder200kb from './pages/blog/RegistrationPhotoUnder200kb.jsx';
import CompressPngKeepTransparency from './pages/blog/CompressPngKeepTransparency.jsx';
import WebpUploadConvertJpg from './pages/blog/WebpUploadConvertJpg.jsx';
import CompressImageToSize from './pages/CompressImageToSize.jsx';
import FormatToolPage from './pages/FormatToolPage.jsx';
import ToolsIndex from './pages/ToolsIndex.jsx';
import About from './pages/About.jsx';
import RemoveImageMetadata from './pages/RemoveImageMetadata.jsx';
import FeedbackAdmin from './pages/FeedbackAdmin.jsx';
import { FORMAT_TOOL_CONFIGS } from './config/tools.js';
import { TARGET_SIZE_PAGE_CONFIGS } from './config/targetSizes.js';

const baseRoutes = [
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <RouteErrorPage />,
    entry: 'src/RootLayout.jsx',
    children: [
      {
        path: 'admin/feedback',
        element: <FeedbackAdmin />,
        entry: 'src/pages/FeedbackAdmin.jsx',
      },
      {
        index: true,
        element: <App />,
        entry: 'src/App.jsx',
      },
      {
        path: 'compress-image-to-size',
        element: <CompressImageToSize />,
        entry: 'src/pages/CompressImageToSize.jsx',
      },
      ...TARGET_SIZE_PAGE_CONFIGS.map((page) => ({
        path: page.path.slice(1),
        element: <CompressImageToSize key={page.path} pageConfig={page} />,
        entry: 'src/pages/CompressImageToSize.jsx',
      })),
      {
        path: 'tools',
        element: <ToolsIndex />,
        entry: 'src/pages/ToolsIndex.jsx',
      },
      ...FORMAT_TOOL_CONFIGS.map((tool) => ({
        path: tool.path.slice(1),
        element: <FormatToolPage tool={tool} />,
        entry: 'src/pages/FormatToolPage.jsx',
      })),
      {
        path: 'about',
        element: <About />,
        entry: 'src/pages/About.jsx',
      },
      {
        path: 'remove-image-metadata',
        element: <RemoveImageMetadata />,
        entry: 'src/pages/RemoveImageMetadata.jsx',
      },
      {
        path: 'blog',
        element: <BlogIndex />,
        entry: 'src/pages/blog/BlogIndex.jsx',
      },
      {
        path: 'blog/registration-photo-under-200kb',
        element: <RegistrationPhotoUnder200kb />,
        entry: 'src/pages/blog/RegistrationPhotoUnder200kb.jsx',
      },
      {
        path: 'blog/compress-png-keep-transparency',
        element: <CompressPngKeepTransparency />,
        entry: 'src/pages/blog/CompressPngKeepTransparency.jsx',
      },
      {
        path: 'blog/webp-upload-convert-jpg',
        element: <WebpUploadConvertJpg />,
        entry: 'src/pages/blog/WebpUploadConvertJpg.jsx',
      },
      {
        path: 'blog/jpg-compress-to-target-size',
        element: <JpgCompressToTargetSize />,
        entry: 'src/pages/blog/JpgCompressToTargetSize.jsx',
      },
      {
        path: 'blog/png-webp-jpg-comparison',
        element: <PngWebpJpgComparison />,
        entry: 'src/pages/blog/PngWebpJpgComparison.jsx',
      },
    ],
  },
];

// Reuse page elements so switching language preserves in-memory image work.
const publicRoutes = baseRoutes[0].children.filter((route) => route.path !== 'admin/feedback');
export const routes = [{
  ...baseRoutes[0],
  children: [
    ...baseRoutes[0].children,
    ...publicRoutes.map(({ index, path, ...route }) => ({ ...route, path: index ? 'en' : `en/${path}` })),
  ],
}];
