import RootLayout from './RootLayout.jsx';
import App from './App.jsx';
import BlogIndex from './pages/blog/BlogIndex.jsx';
import JpgCompressToTargetSize from './pages/blog/JpgCompressToTargetSize.jsx';
import PngWebpJpgComparison from './pages/blog/PngWebpJpgComparison.jsx';
import CompressImageToSize from './pages/CompressImageToSize.jsx';
import FormatToolPage from './pages/FormatToolPage.jsx';
import ToolsIndex from './pages/ToolsIndex.jsx';
import About from './pages/About.jsx';
import { FORMAT_TOOL_CONFIGS } from './config/tools.js';

export const routes = [
  {
    path: '/',
    element: <RootLayout />,
    entry: 'src/RootLayout.jsx',
    children: [
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
        path: 'blog',
        element: <BlogIndex />,
        entry: 'src/pages/blog/BlogIndex.jsx',
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
