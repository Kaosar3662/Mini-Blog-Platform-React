import { RouterProvider } from 'react-router-dom';
import { ThemeModeScript, ThemeProvider } from 'flowbite-react';
import customTheme from './utils/theme/custom-theme';
import router from './routes/Router';
import { UIProvider } from './Api/Axios';

function App() {
  return (
    <>
      <UIProvider>
        <ThemeModeScript />
        <ThemeProvider theme={customTheme}>
          <RouterProvider router={router} />
        </ThemeProvider>
      </UIProvider>
    </>
  );
}

export default App;
