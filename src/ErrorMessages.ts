import { EN } from "./locales";
import { ErrorMessages } from "./localeTypes";

let ERROR_MESSAGES: ErrorMessages = EN;

export const setLocaleMessages = (messages: ErrorMessages) => {
	ERROR_MESSAGES = messages;
};
const errorMessages = () => ERROR_MESSAGES;
export default errorMessages;
