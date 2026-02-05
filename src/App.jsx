import { AuthProvider } from '@context/AuthContext';
import AppRouter from '@routes/index.jsx';

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
