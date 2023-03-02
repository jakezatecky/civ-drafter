import PropTypes from 'prop-types';
import React from 'react';

import getLanguage from 'js/utils/getLanguage';
import MarkdownText from 'js/components/Utils/MarkdownText';

const propTypes = {
    keyName: PropTypes.string.isRequired,

    parseInline: PropTypes.bool,
    variables: PropTypes.objectOf(PropTypes.string),
};
const defaultProps = {
    parseInline: true,
    variables: {},
};

function LanguageText(props) {
    const { keyName, parseInline, variables } = props;
    const text = getLanguage(keyName, variables);

    return <MarkdownText parseInline={parseInline} text={text} />;
}

LanguageText.propTypes = propTypes;
LanguageText.defaultProps = defaultProps;

export default LanguageText;
