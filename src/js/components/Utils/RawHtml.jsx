import PropTypes from 'prop-types';

const propTypes = {
    className: PropTypes.string.isRequired,
    html: PropTypes.string.isRequired,
};

function RawHtml({ className, html }) {
    // eslint-disable-next-line react/no-danger
    return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

RawHtml.propTypes = propTypes;

export default RawHtml;
