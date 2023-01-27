import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import getLanguage from 'js/utils/getLanguage';
import MarkdownText from 'js/components/Utils/MarkdownText';

class LanguageText extends PureComponent {
    static propTypes = {
        keyName: PropTypes.string.isRequired,

        parseInline: PropTypes.bool,
        variables: PropTypes.objectOf(PropTypes.string),
    };

    static defaultProps = {
        parseInline: true,
        variables: {},
    };

    render() {
        const { keyName, parseInline, variables } = this.props;
        const text = getLanguage(keyName, variables);

        return <MarkdownText parseInline={parseInline} text={text} />;
    }
}

export default LanguageText;
