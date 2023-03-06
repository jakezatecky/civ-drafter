import PropTypes from 'prop-types';

import leaderShape from 'js/shapes/leaderShape';

const draftResultsShape = PropTypes.shape({
    players: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        choices: PropTypes.arrayOf(leaderShape).isRequired,
    })),
    error: PropTypes.string,
    trollLeader: leaderShape,
});

export default draftResultsShape;
