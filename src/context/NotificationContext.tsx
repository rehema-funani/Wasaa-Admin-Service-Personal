import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type NotificationType = 'info' | 'success' | 'warning' | 'error';

interface Notification {
    id: string;
    type: NotificationType;
    message: string;
    title?: string;
    autoClose?: boolean;
    duration?: number;
}

interface NotificationContextType {
    notifications: Notification[];
    addNotification: (notification: Omit<Notification, 'id'>) => string;
    removeNotification: (id: string) => void;
    clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
    children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = useCallback((notification: Omit<Notification, 'id'>): string => {
        const id = Date.now().toString();
        const newNotification: Notification = {
            ...notification,
            id,
            autoClose: notification.autoClose !== false,
            duration: notification.duration || 5000,
        };

        setNotifications(prev => [...prev, newNotification]);

        if (newNotification.autoClose) {
            setTimeout(() => {
                removeNotification(id);
            }, newNotification.duration);
        }

        return id;
    }, []);

    const removeNotification = useCallback((id: string) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, []);

    const clearAllNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    const value: NotificationContextType = {
        notifications,
        addNotification,
        removeNotification,
        clearAllNotifications
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
            {/* <NotificationContainer notifications={notifications} onClose={removeNotification} /> */}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

export const useNotificationActions = () => {
    const { addNotification } = useNotifications();

    return {
        info: (message: string, options = {}) =>
            addNotification({ type: 'info', message, ...options }),

        success: (message: string, options = {}) =>
            addNotification({ type: 'success', message, ...options }),

        warning: (message: string, options = {}) =>
            addNotification({ type: 'warning', message, ...options }),

        error: (message: string, options = {}) =>
            addNotification({ type: 'error', message, ...options }),
    };
};

export default NotificationContext;
