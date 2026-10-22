import PropTypes from 'prop-types';
import { useContext } from 'react';

import MarkdownText from '#js/components/Utils/MarkdownText.jsx';
import { LanguageContext } from '#js/contexts.js';

const propTypes = {
    keyName: PropTypes.string.isRequired,

    variables: PropTypes.objectOf(PropTypes.string),
};

function LanguageText({ keyName, variables = {} }) {
    const language = useContext(LanguageContext);

    return <MarkdownText text={language(keyName, variables)} />;
}

LanguageText.propTypes = propTypes;

export default LanguageText;
