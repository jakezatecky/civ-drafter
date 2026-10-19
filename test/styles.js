import path from 'node:path';
import { assert } from 'chai';
import { compile } from 'sass';

import sassOptions, { activeDeprecations } from '../sass.config.js';

// This test runs directly in Node (not through the webpack test bundle), as it needs to compile the
// Sass source

const { dirname } = import.meta;
const entryPath = path.join(dirname, '../src/scss/app.scss');

function formatWarning(message, { deprecation, span, stack }) {
    const type = deprecation ? 'Deprecation' : 'Warning';
    const location = span ? `${span.url}:${span.start.line + 1}:${span.start.column + 1}` : stack;

    return `${type}: ${message}\n    at ${location}`;
}

describe('Styles', () => {
    it('should compile without any deprecations or warnings', () => {
        const warnings = [];

        // Active deprecations throw immediately, while future deprecations and `@warn` messages are
        // collected
        compile(entryPath, {
            ...sassOptions,
            fatalDeprecations: activeDeprecations,
            logger: {
                warn(message, options) {
                    warnings.push(formatWarning(message, options));
                },
            },
        });

        assert.deepEqual(warnings, []);
    }).timeout(10000);
});
