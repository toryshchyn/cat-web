
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthGuard from './components/AuthGuard';
import Dashboard from './pages/Dashboard/Dashboard';
import MasterLayout from './components/MasterLayout';
import ApiTests from './pages/ApiTests/ApiTests';
import NewItem from './pages/NewItemPage';
import ContainerPage from './pages/ContainerPage';

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route element={<MasterLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<AuthGuard component={<Dashboard />} />} />
        <Route path="/api-tests" element={<AuthGuard component={<ApiTests />} />} />
        <Route path="/new-item" element={<AuthGuard component={<NewItem />} />} />
        <Route path="/container/:containerId" element={<AuthGuard component={<ContainerPage />} />} />
      </Route>
    </Routes>
  </Router>
);

export default AppRoutes;