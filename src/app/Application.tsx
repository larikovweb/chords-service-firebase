import { FC } from 'react';
import { GlobalStyles } from '../styled/GlobalStyles';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './Layout';
import { privateRoutes, publicRoutes } from './routes';
import { setupStore } from '../store/store';
import { Provider } from 'react-redux';
import { useAuth } from '../hooks/useAuth';

const Application: FC = () => {
  const store = setupStore();

  return (
    <>
      <GlobalStyles />
      <Provider store={store}>
        <BrowserRouter>
          <RouteSelect />
        </BrowserRouter>
      </Provider>
    </>
  );
};

const RouteSelect: FC = () => {
  const { isAuth } = useAuth();

  return (
    <Routes>
      <Route element={<Layout />}>
        {publicRoutes.map(({ path, component }) => (
          <Route key={path} path={path} element={component} />
        ))}
        {isAuth &&
          privateRoutes.map(
            ({ path, component }) => isAuth && <Route key={path} path={path} element={component} />,
          )}
      </Route>
    </Routes>
  );
};

export default Application;
