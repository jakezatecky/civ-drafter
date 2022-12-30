import PropTypes from 'prop-types';

const leaderShape = PropTypes.shape({
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
});

export default leaderShape;
