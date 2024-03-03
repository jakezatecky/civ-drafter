import fs from 'node:fs';

const imagePath = './data/leader-images';
const jsonPath = './src/json/leaders.json';

/**
 * Generate a JSON array of image paths and labels from the PNGs pulled from the Civ wiki.
 *
 * Note that this does not include nation data.
 *
 * @returns {Promise<void>}
 */
async function generateLeaderJson() {
    const files = await fs.promises.readdir(imagePath);

    const formatted = files.map((filename) => ({
        image: filename,
        name: filename.split('_(Civ6).png').join('').split('_').join(' '),
    }));

    await fs.promises.writeFile(jsonPath, JSON.stringify(formatted, null, 2));
}

generateLeaderJson()
    .then(() => {
        console.log('Finished.');
    })
    .catch((error) => {
        console.error(error);
    });
