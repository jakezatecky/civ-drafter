import get from 'lodash/get.js';

/**
 * @callback LanguageResolver
 * @param {string} key Dot-notation path to the language string.
 * @param {Object<string, string|number>} [variables] Values for `{name}` placeholders.
 * @returns {string}
 */

/**
 * @param {Object} language
 * @returns {LanguageResolver}
 */
export default function getLanguageResolver(language) {
    return (key, variables = {}) => {
        // Fetch text from dot notation string
        let text = get(language, key);

        if (text === undefined) {
            throw new Error(`Cannot find language for key ${key}!`);
        }

        // Substitute any variables
        Object.keys(variables).forEach((variableKey) => {
            text = text.split(`{${variableKey}}`).join(variables[variableKey]);
        });

        return text;
    };
}
