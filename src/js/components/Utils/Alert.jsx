import PropTypes from 'prop-types';
import React from 'react';

import LanguageText from 'js/components/Utils/LanguageText';

const prefixMap = {
    info: <span key="info" className="fa fa-info-circle" />,
    success: <span key="success" className="fa fa-check-circle" />,
    warning: <span key="warning" className="fa fa-exclamation-triangle" />,
    danger: <span key="danger" className="fa fa-exclamation-triangle" />,
};

const propTypes = {
    type: PropTypes.oneOf(['info', 'warning', 'success', 'danger']).isRequired,

    children: PropTypes.node,
    language: PropTypes.shape({
        key: PropTypes.string.isRequired,
        variables: PropTypes.objectOf(PropTypes.string),
    }),
    showPrefix: PropTypes.bool,
};

function Alert({
    type,
    children = null,
    language = null,
    showPrefix = true,
}) {
    function renderPrefix() {
        if (!showPrefix) {
            return null;
        }

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
        <div className={`alert alert-${type}`} role="alert">
            {renderPrefix()}
            {renderMessage()}
        </div>
    );
}

Alert.propTypes = propTypes;

export default Alert;
