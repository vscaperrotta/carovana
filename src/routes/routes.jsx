import { Route } from 'react-router-dom';
import Home from './Home';
import Trip from './Trip';
// @generator routes:import

export const appRoutes = () => ({
  routes: [
    {
      component: () => (
        <Route
          path='/'
          key='Home'
          element={
            <Home />
          }
        />
      ),
    },
    {
      component: () => (
        <Route
          path='/viaggio/:tripId'
          key='Trip'
          element={
            <Trip />
          }
        />
      ),
    },
    // @generator routes:define:auth
  ],
});
