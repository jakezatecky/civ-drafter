import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';

const propTypes = {
    html: PropTypes.string.isRequired,

    className: PropTypes.string,
};

function RawHtml({ html, className = 'html-wrapper' }) {
    const element = useRef(null);

    useEffect(() => {
        element.current.innerHTML = html;
    });

    return <div className={className} ref={element} />;
}

RawHtml.propTypes = propTypes;

export default RawHtml;
