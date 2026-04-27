import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './components/Home';
import { AdminLeads } from './components/AdminLeads';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { YourEvents } from './components/YourEvents';
import { Support } from './components/Support';
import { NotFound } from './components/NotFound';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Toaster position="top-center" reverseOrder={false} />
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<Home />} />
            <Route path="/catering" element={<Home />} />
            <Route path="/support-requests" element={<Home />} />
            <Route path="/assignments" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/support" element={<Support />} />
            
            <Route element={<ProtectedRoute />}>
               <Route path="/my-events" element={<YourEvents />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
              <Route path="/admin" element={<AdminLeads />} />
            </Route>

            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
