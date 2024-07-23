// hooks/useSidebar.js
import { useLocation } from 'react-router-dom';
import { sidebarConfig } from '../config/sidebarConfig';

export const useSidebar = () => {
  const location = useLocation();
  const path = location.pathname;

  if (path.startsWith('/cividle')) {
    return { items: sidebarConfig.CivIdle, currentPath: path };
  }

  const firstSegment = path.split('/')[1] || 'home';
  return { items: sidebarConfig[firstSegment] || sidebarConfig.home, currentPath: path };
};