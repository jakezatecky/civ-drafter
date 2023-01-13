import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

class RawHtml extends PureComponent {
    static propTypes = {
        html: PropTypes.string.isRequired,

        className: PropTypes.string,
    };

    static defaultProps = {
        className: 'html-wrapper',
    };

    componentDidMount() {
        this.setInnerHtml();
    }

    componentDidUpdate() {
        this.setInnerHtml();
    }

    setInnerHtml() {
        const { html } = this.props;

        this.c.innerHTML = html;
    }

    render() {
        const { className } = this.props;

        return <div className={className} ref={(c) => { this.c = c; }} />;
    }
}

export default RawHtml;
