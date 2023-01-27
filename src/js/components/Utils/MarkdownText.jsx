import classNames from 'classnames';
import { marked } from 'marked';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import RawHtml from 'js/components/Utils/RawHtml';

class MarkdownText extends PureComponent {
    static propTypes = {
        text: PropTypes.string.isRequired,

        className: PropTypes.string,
        parseInline: PropTypes.bool,
    };

    static defaultProps = {
        className: null,
        parseInline: true,
    };

    render() {
        const { className, parseInline, text } = this.props;
        const classes = classNames({
            'markdown-wrapper': true,
            'markdown-wrapper-inline': parseInline,
            [className]: true,
        });
        const html = parseInline ? marked.parseInline(text) : marked(text);

        return <RawHtml className={classes} html={html} />;
    }
}

export default MarkdownText;
