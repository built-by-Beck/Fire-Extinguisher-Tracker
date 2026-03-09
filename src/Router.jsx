import { Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import Login from './Login';

const Router = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/app/*" element={<App />} />
      {/* All routes redirect to the app */}
      <Route path="*" element={<Navigate to="/app" replace />} />
    </Routes>
  );
};

export default Router;
