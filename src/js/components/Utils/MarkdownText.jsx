import classNames from 'classnames';
import { marked } from 'marked';
import PropTypes from 'prop-types';
import React from 'react';

import RawHtml from 'js/components/Utils/RawHtml';

const propTypes = {
    text: PropTypes.string.isRequired,

    className: PropTypes.string,
    parseInline: PropTypes.bool,
};
const defaultProps = {
    className: null,
    parseInline: true,
};

function MarkdownText({ className, parseInline, text }) {
    const classes = classNames({
        'markdown-wrapper': true,
        'markdown-wrapper-inline': parseInline,
        [className]: true,
    });

    const html = parseInline ? marked.parseInline(text) : marked(text);

    return <RawHtml className={classes} html={html} />;
}

MarkdownText.propTypes = propTypes;
MarkdownText.defaultProps = defaultProps;

export default MarkdownText;
