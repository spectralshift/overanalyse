import { createTheme } from '@mui/material/styles';


const themeFactory = (mode) => {
  return createTheme({
    palette: {
      mode: mode,
      ...(mode === 'light'
        ? {
          background: {
            main: '#f0f0f0',
            elevated: '#f5f5f5',
          },
        }
        : {
          background: {
            main: '#121212',
            elevated: '#1e1e1e',
          },
        }),
    },
  });
}

export default themeFactory;