import { Provider } from 'react-redux';
import { BrowserRouter, Routes } from 'react-router-dom';
import store from '@store/store.js';
import { appRoutes } from '@routes/routes.jsx';

const App = () => (
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        {appRoutes().routes.map(({ component }) => component())}
      </Routes>
    </BrowserRouter>
  </Provider>
);

export default App;
