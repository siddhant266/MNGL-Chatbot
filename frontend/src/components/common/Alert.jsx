import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const Alert = ({ type, message, onClose }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                if (onClose) onClose();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message, onClose]);

    if (!message) return null;

    const alertStyles = {
        success: 'bg-green-50 border-green-400 text-green-800',
        error: 'bg-red-50 border-red-400 text-red-800',
        warning: 'bg-yellow-50 border-yellow-400 text-yellow-800',
        info: 'bg-blue-50 border-blue-400 text-blue-800',
    };

    const iconStyles = {
        success: 'text-green-400',
        error: 'text-red-400',
        warning: 'text-yellow-400',
        info: 'text-blue-400',
    };

    const icon = {
        success: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
        ),
        error: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
        ),
    };

    return (
        <div className={`fixed top-4 right-4 z-50 border rounded-md p-4 ${alertStyles[type]}`}>
            <div className="flex items-center">
                <div className={`flex-shrink-0 ${iconStyles[type]}`}>
                    {icon[type] || icon.info}
                </div>
                <div className="ml-3">
                    <p className="text-sm font-medium">{message}</p>
                </div>
                <div className="ml-auto pl-3">
                    <button
                        onClick={onClose}
                        className="inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2"
                    >
                        <span className="sr-only">Dismiss</span>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Alert;