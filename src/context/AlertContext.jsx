import React, { createContext, useState, useCallback } from 'react';
import AlertModal from '../components/AlertModal';

export const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
    const [alertState, setAlertState] = useState({
        isOpen: false,
        message: '',
    });

    const showAlert = useCallback((message) => {
        setAlertState({ isOpen: true, message });
    }, []);

    const hideAlert = () => {
        setAlertState({ isOpen: false, message: '' });
    };

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}
            <AlertModal
                isOpen={alertState.isOpen}
                message={alertState.message}
                onClose={hideAlert}
            />
        </AlertContext.Provider>
    );
};
