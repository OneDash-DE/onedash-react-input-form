import { ErrorMessages } from ".";
import { EN } from "./locales";

let ERROR_MESSAGES: ErrorMessages = EN;

export const setLocaleMessages = (messages: ErrorMessages) => {
	ERROR_MESSAGES = messages;
};
const errorMessages = () => ERROR_MESSAGES;
export default errorMessages;
