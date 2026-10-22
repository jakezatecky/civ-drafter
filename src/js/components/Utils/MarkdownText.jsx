import { marked } from 'marked';
import PropTypes from 'prop-types';

import RawHtml from '#js/components/Utils/RawHtml.jsx';

const propTypes = {
    text: PropTypes.string.isRequired,
};

function MarkdownText({ text }) {
    return (
        <RawHtml
            className="markdown-wrapper markdown-wrapper-inline"
            html={marked.parseInline(text)}
        />
    );
}

MarkdownText.propTypes = propTypes;

export default MarkdownText;
