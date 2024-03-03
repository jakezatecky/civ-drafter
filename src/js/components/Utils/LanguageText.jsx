import PropTypes from 'prop-types';
import React, { useContext } from 'react';

import MarkdownText from '#js/components/Utils/MarkdownText.jsx';
import { LanguageContext } from '#js/contexts.js';

const propTypes = {
    keyName: PropTypes.string.isRequired,

    parseInline: PropTypes.bool,
    variables: PropTypes.objectOf(PropTypes.string),
};

function LanguageText({
    keyName,
    parseInline = true,
    variables = {},
}) {
    const language = useContext(LanguageContext);

    return <MarkdownText parseInline={parseInline} text={language(keyName, variables)} />;
}

LanguageText.propTypes = propTypes;

export default LanguageText;
