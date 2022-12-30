import { shuffle } from 'lodash';

/**
 * @param {Array} leaders
 * @param {Number} numPlayers
 * @param {Number} numChoices
 * @param {Array} bans
 */
function draftLeaders(leaders, numPlayers, numChoices, bans) {
    // Flatten bans to leader names for simple comparison
    const flatBans = bans.map(({ name }) => name);

    // Remove banned leaders from the selection pool
    const availablePool = leaders.filter(({ name }) => !flatBans.includes(name));

    // Shuffle the available leaders for randomization
    const shuffledPool = shuffle(availablePool);

    // Start constructing the available player choices
    const playerChoices = [...Array(numPlayers)];

    playerChoices.forEach((player, index) => {
        // Extract  the next `numChoices` leaders from the pool
        playerChoices[index] = {
            index,
            choices: shuffledPool.slice(index * numChoices, (index + 1) * numChoices),
        };
    });

    return playerChoices;
}

export default draftLeaders;
