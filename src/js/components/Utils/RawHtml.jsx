import PropTypes from 'prop-types';

const propTypes = {
    html: PropTypes.string.isRequired,

    className: PropTypes.string,
};

function RawHtml({ html, className = 'html-wrapper' }) {
    // eslint-disable-next-line react/no-danger
    return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

RawHtml.propTypes = propTypes;

export default RawHtml;
