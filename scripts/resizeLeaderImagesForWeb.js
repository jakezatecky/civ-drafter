import fs from 'node:fs';
import sharp  from 'sharp';

const source = './data/leader-images';
const destination = './public/assets/img/leader-icons';

// The icons are displayed at 32 pixels, so twice that keeps them crisp on high-density displays and
// in the double-resolution image of the draft results
const size = 64;

/**
 * Resize the raw images to reduce the bandwidth requirements.
 *
 * @returns {Promise<void>}
 */
async function resizeLeaderImagesForWeb() {
    const files = await fs.promises.readdir(source);

    await Promise.all(files.map(async (filename) => {
        await sharp(`${source}/${filename}`)
            // Crop the few images that are not quite square, so that all display at the same size
            .resize(size, size)
            .webp()
            .toFile(`${destination}/${filename}`);
    }));
}

resizeLeaderImagesForWeb()
    .then(() => {
        console.log('Finished.');
    })
    .catch((error) => {
        console.error(error);
    });
