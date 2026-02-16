import { AppRouter } from './app/AppRouter';
import { AuthProvider } from './core/auth/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="bg-mesh" />
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
