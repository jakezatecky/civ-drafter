import shuffle from 'lodash/shuffle';

class NotEnoughLeadersError extends Error {
    name = 'NotEnoughLeadersError';

    constructor(totalChoices, availableLeaders) {
        super('Not enough available leaders');

        this.totalChoices = totalChoices;
        this.availableLeaders = availableLeaders;
    }
}

/**
 * De-duplicate the randomized pool by allowing only one leader for a given duplicate attribute.
 *
 * For example, when `attributeKey === 'civilization'`, we reduce the pool to allow for only one
 * leader with `civilization === 'Chinese'`.
 *
 * @param {Array} leaderPool
 * @param {String} attributeKey
 *
 * @returns {Array}
 */
function deduplicateByAttribute(leaderPool, attributeKey) {
    const reducedPool = [...leaderPool];

    // Compile the indexes of all leaders by attribute
    const indexMap = {};
    leaderPool.forEach((leader, index) => {
        const value = leader[attributeKey];

        if (indexMap[value] === undefined) {
            indexMap[value] = [];
        }

        indexMap[value].push(index);
    });

    // Reduce each attribute to one leader
    Object.keys(indexMap).forEach((value) => {
        // Keep the first leader, as we have already shuffled the list
        // Use the remaining indexes to remove the other leaders
        delete indexMap[value][0];
        indexMap[value].forEach((leaderIndex) => {
            delete reducedPool[leaderIndex];
        });
    });

    // Now filter out all deleted entries
    return reducedPool.filter((leader) => leader !== undefined);
}

/**
 * Return a random list of `numChoices` for each player, after removing all bans and randomizing
 * personas.
 *
 * Some leaders have multiple personas, but the game will not permit more than one in a single game.
 * This function handles that deleting all other personas
 *
 * @param {Array} leaders
 * @param {Object[]} players
 * @param {Number} numChoices
 * @param {String[]} bans
 *
 * @returns {Object[]}
 */
function draftLeaders(leaders, { players, numChoices, bans }) {
    // Remove banned leaders from the selection pool
    const availablePool = leaders.filter(({ longName }) => !bans.includes(longName));

    // Shuffle the available leaders for randomization
    const shuffledPool = shuffle(availablePool);

    // Reduce pool to one leader per civilization and leader ID
    const finalPool = deduplicateByAttribute(
        deduplicateByAttribute(shuffledPool, 'civilization'),
        'id',
    );

    // Calculate the worst-case scenario of picking leaders, where the players with the most DLC
    // snatch all the non-DLC leaders and leave no leaders for the less DLC-endowed players
    const minimumPotential = finalPool.filter(({ dlc: requiredDlc }) => (
        players.every(({ enabledDlc: playerDlc }) => (
            requiredDlc.every((dlc) => playerDlc.includes(dlc))
        ))
    ));

    // Ensure we have enough leaders to satisfy the total choices
    const totalChoices = players.length * numChoices;
    const notEnoughLeaders = totalChoices > minimumPotential.length;

    if (notEnoughLeaders) {
        throw new NotEnoughLeadersError(totalChoices, minimumPotential.length);
    }

    // Constructing the available player choices
    return players.map(({ name, enabledDlc }) => {
        const choices = [];
        let numExtracted = 0;

        // Extract the next `numChoices` leaders from the pool
        finalPool.some((leader, index) => {
            // Quota satisfied; pull out
            if (numExtracted === numChoices) {
                return true;
            }

            const { dlc: requiredDlc } = leader;

            if (requiredDlc.every((dlc) => enabledDlc.includes(dlc))) {
                // Player has DLC; draft leader
                numExtracted += 1;
                choices.push(leader);
                delete finalPool[index];
            }

            return false;
        });

        return { name, choices };
    });
}

export { NotEnoughLeadersError };
export default draftLeaders;
