import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import LanguageText from 'js/components/Utils/LanguageText';

const prefixMap = {
    info: <span key="info" className="fa fa-info-circle" />,
    success: <span key="success" className="fa fa-check-circle" />,
    warning: <span key="warning" className="fa fa-exclamation-triangle" />,
    danger: <span key="danger" className="fa fa-exclamation-triangle" />,
};

class Alert extends PureComponent {
    static propTypes = {
        type: PropTypes.oneOf(['info', 'warning', 'success', 'danger']).isRequired,

        children: PropTypes.node,
        language: PropTypes.shape({
            key: PropTypes.string.isRequired,
            variables: PropTypes.objectOf(PropTypes.string),
        }),
        showPrefix: PropTypes.bool,
    };

    static defaultProps = {
        children: null,
        language: null,
        showPrefix: true,
    };

    renderPrefix(type) {
        const { showPrefix } = this.props;

        if (!showPrefix) {
            return null;
        }

        // Return type prefix with enough space for the main message
        return [
            prefixMap[type],
            ' ',
        ];
    }

    renderMessage() {
        const { children, language } = this.props;

        if (children !== null) {
            return children;
        }

        if (language !== null) {
            const { key, variables } = language;

            return <LanguageText keyName={key} variables={variables} />;
        }

        return null;
    }

    render() {
        const { type } = this.props;

        return (
            <div className={`alert alert-${type}`} role="alert">
                {this.renderPrefix(type)}
                {this.renderMessage()}
            </div>
        );
    }
}

export default Alert;
