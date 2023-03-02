import PropTypes from 'prop-types';
import leaderShape from './leaderShape';

const draftResultsShape = PropTypes.shape({
    players: PropTypes.arrayOf(PropTypes.shape({
        index: PropTypes.number.isRequired,
        choices: PropTypes.arrayOf(leaderShape).isRequired,
    })),
    error: PropTypes.string,
});

export default draftResultsShape;
