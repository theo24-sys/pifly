import { BrowserRouter } from 'react-router-dom';
import { RoutesConfig } from './app/routes';
import { SocketProvider } from '@/shared/lib/socket';

export function App() {
  return (
    <BrowserRouter>
      <SocketProvider>
        <RoutesConfig />
      </SocketProvider>
    </BrowserRouter>
  );
}