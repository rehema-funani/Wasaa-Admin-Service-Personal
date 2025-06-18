import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { hasAnyPermission, getUserPermissions } from '../utils/permissions';

const PermissionRouteGuard = ({
  permissions,
  children,
  redirectTo = '/unauthorized'
}) => {
  const location = useLocation();

  const userData = localStorage.getItem('userData');
  const parsedUserData = userData ? JSON.parse(userData) : null;

  const userPermissions = getUserPermissions();

  const hasAccess = hasAnyPermission(permissions);

  useEffect(() => {
    if (!hasAccess) {

    }
  }, [hasAccess, permissions, userPermissions, userData, parsedUserData]);

  if (!hasAccess) {
    setTimeout(() => {
      console.log('Redirecting to unauthorized page');
    }, 100);

    return (
      <Navigate
        to={redirectTo}
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return <>{children}</>;
};

export default PermissionRouteGuard;
