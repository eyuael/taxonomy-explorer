// src/components/ui/Alert.tsx

import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  onClose,
  className = '',
}) => {
  // Style configurations for different variants
  const variantStyles = {
    info: {
      container: 'bg-blue-50 border-blue-200',
      icon: <Info className="w-5 h-5 text-blue-500" />,
      title: 'text-blue-800',
      content: 'text-blue-700',
    },
    success: {
      container: 'bg-green-50 border-green-200',
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      title: 'text-green-800',
      content: 'text-green-700',
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200',
      icon: <AlertCircle className="w-5 h-5 text-yellow-500" />,
      title: 'text-yellow-800',
      content: 'text-yellow-700',
    },
    error: {
      container: 'bg-red-50 border-red-200',
      icon: <XCircle className="w-5 h-5 text-red-500" />,
      title: 'text-red-800',
      content: 'text-red-700',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div
      className={`
        relative p-4 border rounded-lg
        ${styles.container}
        ${className}
      `}
      role="alert"
    >
      <div className="flex">
        <div className="flex-shrink-0">
          {styles.icon}
        </div>
        
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={`text-sm font-medium ${styles.title}`}>
              {title}
            </h3>
          )}
          
          <div className={`text-sm ${styles.content}`}>
            {children}
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            aria-label="Close alert"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};