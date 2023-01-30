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
 * @param {Number} numPlayers
 * @param {Number} numChoices
 * @param {String[]} bans
 */
function draftLeaders(leaders, numPlayers, numChoices, bans) {
    // Remove banned leaders from the selection pool
    const availablePool = leaders.filter(({ longName }) => !bans.includes(longName));

    // Shuffle the available leaders for randomization
    const shuffledPool = shuffle(availablePool);

    // Reduce pool to one leader per civilization and leader ID
    const finalPool = deduplicateByAttribute(
        deduplicateByAttribute(shuffledPool, 'civilization'),
        'id',
    );

    // Ensure we have enough leaders to satisfy the total choices
    const totalChoices = numPlayers * numChoices;
    const notEnoughLeaders = totalChoices > finalPool.length;

    if (notEnoughLeaders) {
        throw new NotEnoughLeadersError(totalChoices, finalPool.length);
    }

    // Constructing the available player choices
    const playerChoices = [...Array(numPlayers)];
    playerChoices.forEach((player, index) => {
        // Extract  the next `numChoices` leaders from the pool
        playerChoices[index] = {
            index,
            choices: finalPool.slice(index * numChoices, (index + 1) * numChoices),
        };
    });

    return playerChoices;
}

export { NotEnoughLeadersError };
export default draftLeaders;
