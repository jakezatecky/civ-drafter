import { Buffer } from 'node:buffer';
import fs from 'node:fs/promises';
import sharp from 'sharp';

const { dirname } = import.meta;
const publicPath = `${dirname}/../public`;
const sourceFile = `${publicPath}/favicon.svg`;

// The source is drawn on a 512-unit grid
const sourceSize = 512;
const transparent = {
    r: 0, g: 0, b: 0, alpha: 0,
};
const white = {
    r: 255, g: 255, b: 255, alpha: 1,
};

// Each icon draws the logo centered at `size` within a `width` by `height` canvas. Logo sizes that
// divide evenly into the source grid (such as 144 or 384) keep the hexagon's flat edges on whole
// pixels.
const icons = [
    {
        file: 'android-chrome-192x192.png',
        width: 192,
        height: 192,
        size: 192,
    },
    {
        file: 'android-chrome-512x512.png',
        width: 512,
        height: 512,
        size: 512,
    },

    // Keep maskable icons within the central safe zone, which launchers may crop to a circle
    {
        file: 'android-maskable-192x192.png',
        width: 192,
        height: 192,
        size: 144,
        background: white,
    },
    {
        file: 'android-maskable-512x512.png',
        width: 512,
        height: 512,
        size: 384,
        background: white,
    },

    // iOS fills any transparency with black, so give the icon a background
    {
        file: 'apple-touch-icon.png',
        width: 180,
        height: 180,
        size: 144,
        background: white,
    },
];

// Sizes embedded in `favicon.ico`, for browsers that do not support the SVG icon
const icoSizes = [16, 32, 48];

/**
 * Render the source SVG at exactly the given size, rather than resampling a larger render.
 *
 * @param {Buffer} svg
 * @param {number} size
 *
 * @returns {Promise<Buffer>}
 */
function renderLogo(svg, size) {
    return sharp(svg, { density: (72 * size) / sourceSize }).png().toBuffer();
}

/**
 * Bundle PNG images into an ICO file, which may store PNG data directly.
 *
 * @param {{size: number, data: Buffer}[]} images
 *
 * @returns {Buffer}
 */
function createIco(images) {
    const headerSize = 6;
    const entrySize = 16;
    const header = Buffer.alloc(headerSize);
    header.writeUInt16LE(0, 0); // Reserved
    header.writeUInt16LE(1, 2); // Image type (icon)
    header.writeUInt16LE(images.length, 4);

    let offset = headerSize + (entrySize * images.length);
    const entries = images.map(({ size, data }) => {
        const entry = Buffer.alloc(entrySize);
        entry.writeUInt8(size % 256, 0); // Width (0 means 256)
        entry.writeUInt8(size % 256, 1); // Height (0 means 256)
        entry.writeUInt8(0, 2); // Palette size
        entry.writeUInt8(0, 3); // Reserved
        entry.writeUInt16LE(1, 4); // Color planes
        entry.writeUInt16LE(32, 6); // Bits per pixel
        entry.writeUInt32LE(data.length, 8);
        entry.writeUInt32LE(offset, 12);
        offset += data.length;

        return entry;
    });

    return Buffer.concat([header, ...entries, ...images.map(({ data }) => data)]);
}

async function generateIcons() {
    const svg = await fs.readFile(sourceFile);

    await Promise.all(icons.map(async ({
        file,
        width,
        height,
        size,
        background = transparent,
    }) => {
        const logo = await renderLogo(svg, size);

        await sharp({
            create: {
                width,
                height,
                channels: 4,
                background,
            },
        })
            .composite([{
                input: logo,
                left: (width - size) / 2,
                top: (height - size) / 2,
            }])
            .png()
            .toFile(`${publicPath}/${file}`);
    }));

    const icoImages = await Promise.all(
        icoSizes.map(async (size) => ({
            size,
            data: await renderLogo(svg, size),
        })),
    );
    await fs.writeFile(`${publicPath}/favicon.ico`, createIco(icoImages));
}

generateIcons()
    .then(() => {
        console.log('Finished.');
    })
    .catch((error) => {
        console.error(error);
    });
