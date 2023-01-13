import language from 'js/constants/language';

export default function getLanguage(key, variables = {}) {
    let message = language[key];

    if (message === undefined) {
        throw new Error(`Cannot find language for key ${key}!`);
    }

    // Substitute any variables
    Object.keys(variables).forEach((variableKey) => {
        message = message.split(`{${variableKey}}`).join(variables[variableKey]);
    });

    return message;
}
