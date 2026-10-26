import type { ReactNode } from 'react';

import LanguageText from '#js/components/Utils/LanguageText.tsx';

type AlertType = 'info' | 'warning' | 'success' | 'danger';

interface AlertProps {
    type: AlertType;
    children?: ReactNode;
    // Language text to show when there are no children
    language?: {
        key: string;
        variables?: Record<string, string>;
    } | null;
}

const prefixMap: Record<AlertType, ReactNode> = {
    info: <span key="info" className="fa fa-info-circle" />,
    success: <span key="success" className="fa fa-check-circle" />,
    warning: <span key="warning" className="fa fa-exclamation-triangle" />,
    danger: <span key="danger" className="fa fa-exclamation-triangle" />,
};

function Alert({
    type,
    children = null,
    language = null,
}: AlertProps) {
    function renderPrefix() {
        // Return type's prefix with enough space for the main message
        return [
            prefixMap[type],
            ' ',
        ];
    }

    function renderMessage() {
        if (children !== null) {
            return children;
        }

        if (language !== null) {
            const { key, variables } = language;

            return <LanguageText keyName={key} variables={variables} />;
        }

        return null;
    }

    return (
        <div className={`alert theme-${type}`} role="alert">
            {renderPrefix()}
            {renderMessage()}
        </div>
    );
}

export default Alert;
