import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';

const propTypes = {
    html: PropTypes.string.isRequired,

    className: PropTypes.string,
};
const defaultProps = {
    className: 'html-wrapper',
};

function RawHtml({ html, className }) {
    const element = useRef(null);

    useEffect(() => {
        element.current.innerHTML = html;
    });

    return <div className={className} ref={element} />;
}

RawHtml.propTypes = propTypes;
RawHtml.defaultProps = defaultProps;

export default RawHtml;
