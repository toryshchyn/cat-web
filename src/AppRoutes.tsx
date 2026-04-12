import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthGuard from './components/AuthGuard';
import Dashboard from './pages/Dashboard';
import MasterLayout from './components/MasterLayout';
import ApiTests from './pages/ApiTests/ApiTests';
import EditItemPage from './pages/EditItemPage';
import NewItemPage from './pages/NewItemPage';
import TagPage from './pages/TagPage';
import ContainerPage from './pages/ContainerPage';
import ItemDetailsPage from './pages/ItemDetailsPage';

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route element={<MasterLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<AuthGuard component={<Dashboard />} />} />
        <Route path="/api-tests" element={<AuthGuard component={<ApiTests />} />} />
        <Route path="/new-item" element={<AuthGuard component={<NewItemPage />} />} />
        <Route path="/edit-item/:itemId" element={<AuthGuard component={<EditItemPage />} />} />
        <Route path="/tag/:tagId" element={<AuthGuard component={<TagPage />} />} />
        <Route path="/item/:id" element={<AuthGuard component={<ItemDetailsPage />} />} />
        <Route path="/container/:containerId" element={<AuthGuard component={<ContainerPage />} />} />
      </Route>
    </Routes>
  </Router>
);

export default AppRoutes;