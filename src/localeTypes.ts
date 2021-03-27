export enum ErrorCodes {
	Default,
	IsEmpty,
	IsTooShort,
	IsTooLong,
	EmailWrong,
	TelWrong,
	NullNotAllowed,
	NegativeNotAllowed,
	PleaseChoose,
	ImageRequired
}
export type ErrorMessages = { [key in ErrorCodes]: string };
