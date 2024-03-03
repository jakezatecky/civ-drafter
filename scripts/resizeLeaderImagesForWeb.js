import fs from 'node:fs';
import sharp  from 'sharp';

const source = './data/leader-images';
const destination = './public/assets/img/leader-icons';

/**
 * Resize the raw images to 32 pixels to reduce the bandwidth requirements.
 *
 * @returns {Promise<void>}
 */
async function resizeLeaderImagesForWeb() {
    const files = await fs.promises.readdir(source);

    await Promise.all((files).map(async (filename) => {
        await sharp(`${source}/${filename}`)
            .resize(32)
            .png()
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
