import RootLayout from './RootLayout.jsx';
import App from './App.jsx';
import BlogIndex from './pages/blog/BlogIndex.jsx';
import JpgCompressToTargetSize from './pages/blog/JpgCompressToTargetSize.jsx';
import PngWebpJpgComparison from './pages/blog/PngWebpJpgComparison.jsx';
import CompressImageToSize from './pages/CompressImageToSize.jsx';

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
