import { RouterProvider } from 'react-router';
import { router } from './routes';
import { CurrencyProvider } from './context/CurrencyContext';

export default function App() {
  return (
    <CurrencyProvider>
      <RouterProvider router={router} />
    </CurrencyProvider>
  );
}
