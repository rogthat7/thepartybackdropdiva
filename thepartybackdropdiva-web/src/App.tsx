import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './components/Home';
import { AdminLeads } from './components/AdminLeads';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { YourEvents } from './components/YourEvents';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<ProtectedRoute />}>
             <Route path="/my-events" element={<YourEvents />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route path="/admin" element={<AdminLeads />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
