const fs = require('node:fs/promises');
const { XMLBuilder } = require('fast-xml-parser');

const outputPath = `${__dirname}/../public/sitemap.xml`;

async function generateSitemap() {
    const builder = new XMLBuilder({
        attributeNamePrefix: '@',
        format: true,
        ignoreAttributes: false,
    });

    // Build sitemap with current date as modify date
    let output = builder.build({
        urlset: {
            '@xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
            url: [{
                loc: 'https://civilizationdrafter.com',
                changefreq: 'weekly',
                priority: '1.0',
                lastmod: (new Date()).toISOString().split('T')[0],
            }],
        },
    });

    // Prepend the XML schema
    output = `<?xml version="1.0" encoding="UTF-8"?>\n${output}`;

    await fs.writeFile(outputPath, output);
}

generateSitemap().then(() => {
    // Finished
}).catch((error) => {
    throw error;
});
