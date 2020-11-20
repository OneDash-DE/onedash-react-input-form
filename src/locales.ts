import { ErrorCodes, ErrorMessages } from "./types";

export const DE: ErrorMessages = {
	[ErrorCodes.Default]: "Der eingegebene Wert ist fehlerhaft",
	[ErrorCodes.IsEmpty]: "Diese Angabe ist verpflichtend",
	[ErrorCodes.IsTooShort]: "Der eingegebene Wert ist zu kurz",
	[ErrorCodes.IsTooLong]: "Der eingegebene Wert ist zu lang",
	[ErrorCodes.EmailWrong]: "Die angebene E-Mail ist inkorrekt",
	[ErrorCodes.TelWrong]: "Die angegebene Telefonnummer ist inkorrekt",
	[ErrorCodes.NullNotAllowed]: "Der Wert 0 ist nicht erlaubt",
	[ErrorCodes.NegativeNotAllowed]: "Negative Werte sind nicht erlaubt"
};

export const EN: ErrorMessages = {
	[ErrorCodes.Default]: "The entered value is invalid",
	[ErrorCodes.IsEmpty]: "This input is required",
	[ErrorCodes.IsTooShort]: "The entered value is too short",
	[ErrorCodes.IsTooLong]: "The entered value is too long",
	[ErrorCodes.EmailWrong]: "The entered email is invalid",
	[ErrorCodes.TelWrong]: "The entered phone number is invalid",
	[ErrorCodes.NullNotAllowed]: "Value 0 is not allowed",
	[ErrorCodes.NegativeNotAllowed]: "Negative values are not allowed"
};
