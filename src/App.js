import React, { Suspense } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import Loading from './components/Loading';
import useMediaQuery from '@mui/material/useMediaQuery';
import themeFactory from './theme/index';

const HomePage = React.lazy(() => import('./pages/HomePage'));
const CivIdlePage = React.lazy(() => import('./pages/CivIdle'));
const CivIdleScienceCalculator = React.lazy(() => import('./pages/cividle/ScienceTimeCalc'));
const CivIdleGPEfficient = React.lazy(() => import('./pages/cividle/GPEfficient'));
const CivIdleIdleEraCalc = React.lazy(() => import('./pages/cividle/IdleEraTime'));
const CivIdleEVValues = React.lazy(() => import('./pages/cividle/EVValues'));
const CivIdleProductionChainCalc = React.lazy(() => import('./pages/cividle/ProductChainCalc'));
const CivIdleScienceVsWorker = React.lazy(() => import('./pages/cividle/ScienceBuildVsWorker'));


function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () => themeFactory(prefersDarkMode ? 'dark' : 'light'),
    [prefersDarkMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <Router>
          <Layout>
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/cividle" element={<CivIdlePage />} />
                <Route path="/cividle/science" element={<CivIdleScienceCalculator />} />
                <Route path="/cividle/gp-efficient" element={<CivIdleGPEfficient />} />
                <Route path="/cividle/eratime" element={<CivIdleIdleEraCalc />} />
                <Route path="/cividle/ev" element={<CivIdleEVValues />} />
                <Route path="/cividle/chaincalc" element={<CivIdleProductionChainCalc />} />
                <Route path="/cividle/scivsworker" element={<CivIdleScienceVsWorker />} />
              </Routes>
            </Suspense>
          </Layout>
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;