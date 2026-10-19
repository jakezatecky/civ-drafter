import { deprecations } from 'sass';

const sassDeprecations = Object.values(deprecations);

/**
 * Sass deprecations that are currently active.
 *
 * @type {import('sass').Deprecation[]}
 */
export const activeDeprecations = sassDeprecations.filter(({ status }) => status === 'active');

/**
 * Shared Sass options for both the webpack build and the style tests.
 *
 * @type {import('sass').Options<'sync'>}
 */
export default {
    loadPaths: ['node_modules'],
    // Report deprecations from dependencies, which we would otherwise not see
    quietDeps: false,
    // Opt into deprecations that are not yet active, so that we hear about them early
    futureDeprecations: sassDeprecations.filter(({ status }) => status === 'future'),
};
