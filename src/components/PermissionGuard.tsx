
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { hasAnyPermission } from '../utils/permissions';

interface PermissionRouteGuardProps {
    permissions: string[];
    children: React.ReactNode;
    redirectTo?: string;
}

const PermissionRouteGuard: React.FC<PermissionRouteGuardProps> = ({
    permissions,
    children,
    redirectTo = '/unauthorized'
}) => {
    const location = useLocation();
    const hasAccess = hasAnyPermission(permissions);

    if (!hasAccess) {
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