import language from 'js/constants/language';

export default function getLanguage(key, variables = {}) {
    let message = language[key];

    if (message === undefined) {
        throw new Error(`Cannot find language for key ${key}!`);
    }

    Object.keys(variables).forEach((key) => {
        message = message.split(`{${key}}`).join(variables[key]);
    });

    return message;
}
