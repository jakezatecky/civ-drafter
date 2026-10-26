import get from 'lodash/get.js';

// Look up a language string by its dot-notation path, substituting values for its `{name}`
// placeholders
export type LanguageResolver = (
    key: string,
    variables?: Record<string, string | number>,
) => string;

export default function getLanguageResolver(language: object): LanguageResolver {
    return (key, variables = {}) => {
        // Fetch text from dot notation string
        const text: unknown = get(language, key);

        if (typeof text !== 'string') {
            throw new Error(`Cannot find language for key ${key}!`);
        }

        // Substitute any variables
        return Object.entries(variables).reduce(
            (result, [variableKey, value]) => result.split(`{${variableKey}}`).join(String(value)),
            text,
        );
    };
}
