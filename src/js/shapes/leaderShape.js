import PropTypes from 'prop-types';

const leaderShape = PropTypes.shape({
    image: PropTypes.string.isRequired,
    longName: PropTypes.string.isRequired,
    shortName: PropTypes.string.isRequired,
});

export default leaderShape;
