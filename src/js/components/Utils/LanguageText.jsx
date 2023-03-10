import PropTypes from 'prop-types';
import React, { useContext } from 'react';

import MarkdownText from 'js/components/Utils/MarkdownText';
import { LanguageContext } from 'js/contexts';

const propTypes = {
    keyName: PropTypes.string.isRequired,

    parseInline: PropTypes.bool,
    variables: PropTypes.objectOf(PropTypes.string),
};
const defaultProps = {
    parseInline: true,
    variables: {},
};

function LanguageText({ keyName, parseInline, variables }) {
    const language = useContext(LanguageContext);

    return <MarkdownText parseInline={parseInline} text={language(keyName, variables)} />;
}

LanguageText.propTypes = propTypes;
LanguageText.defaultProps = defaultProps;

export default LanguageText;
