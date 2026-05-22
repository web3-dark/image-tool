import RootLayout from './RootLayout.jsx';
import App from './App.jsx';
import PngWebpJpgComparison from './pages/blog/PngWebpJpgComparison.jsx';

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
        path: 'blog/png-webp-jpg-comparison',
        element: <PngWebpJpgComparison />,
        entry: 'src/pages/blog/PngWebpJpgComparison.jsx',
      },
    ],
  },
];
