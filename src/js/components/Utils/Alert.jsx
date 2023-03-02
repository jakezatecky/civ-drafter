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
const defaultProps = {
    children: null,
    language: null,
    showPrefix: true,
};

function Alert(props) {
    function renderPrefix(type) {
        const { showPrefix } = props;

        if (!showPrefix) {
            return null;
        }

        // Return type prefix with enough space for the main message
        return [
            prefixMap[type],
            ' ',
        ];
    }

    function renderMessage() {
        const { children, language } = props;

        if (children !== null) {
            return children;
        }

        if (language !== null) {
            const { key, variables } = language;

            return <LanguageText keyName={key} variables={variables} />;
        }

        return null;
    }

    const { type } = props;

    return (
        <div className={`alert alert-${type}`} role="alert">
            {renderPrefix(type)}
            {renderMessage()}
        </div>
    );
}

Alert.propTypes = propTypes;
Alert.defaultProps = defaultProps;

export default Alert;
