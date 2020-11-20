import GenericInput from "./components/GenericInput";

export enum ErrorCodes {
	Default,
	IsEmpty,
	IsTooShort,
	IsTooLong,
	EmailWrong,
	TelWrong,
	NullNotAllowed,
	NegativeNotAllowed
}
export type ErrorMessages = { [key in ErrorCodes]: string };

export interface GenericInputProps<ValueType> {
	/**
	 * Name of the component.
	 */
	name: string;

	/**
	 * Optional label of the input
	 */
	label?: string;

	/**
	 * Optional placeholder
	 */
	placeholder?: string;

	/**
	 * Classname which should be assigned to component
	 */
	className?: string | string[];

	/**
	 * Disabled flag
	 */
	disabled?: boolean;

	/**
	 * Value of the component
	 */
	value?: ValueType;

	/**
	 * @private onChange listener for form component
	 */
	_change?: (obj: { value?: ValueType; name: string }) => any;

	/**
	 * OnChange listener which returns the value of the component
	 */
	onChange?: (value?: ValueType) => any;

	/**
	 * OnBlur Event
	 */
	onBlur?: (value?: ValueType) => any;

	/**
	 * OnValidate additional validation step for this component
	 */
	onValidate?: (value?: ValueType) => boolean | { valid: boolean; errorMessage?: string };

	/**
	 * React styles for this component
	 */
	style?: React.CSSProperties;

	icon?: React.ReactNode;
	errorIcon?: React.ReactNode;

	onError?: (errorCode: ErrorCodes, component: GenericInput<any, any>, value?: ValueType) => string;
}

export interface GenericInputState {
	value?: any;
	valid: boolean;
	focus: boolean;
}

export interface ValueLabelPair {
	/**
	 * Option value
	 */
	value: any;
	/**
	 * Option Label
	 */
	label: string;
}

export interface ButtonProps {
	/**
	 * Button type. Default is button
	 */
	type?: "button" | "submit" | "reset";

	/**
	 * Classname of the button
	 */
	className?: string;

	/**
	 * OnClick event listener
	 */
	onClick?: () => void;

	/**
	 * Disabled flag
	 */
	disabled?: boolean;

	/**
	 * React css propertiess
	 */
	style?: React.CSSProperties;
}

export type timestamp = number;

export type AutoCompleteTypes =
	| "off"
	| "on"
	| "name"
	| "honorific-prefix"
	| "given-name"
	| "additional-name"
	| "family-name"
	| "honorific-suffix"
	| "nickname"
	| "email"
	| "username"
	| "new-password"
	| "current-password"
	| "one-time-code"
	| "organization-title"
	| "organization"
	| "street-address"
	| "address-line1"
	| "address-line2"
	| "address-line3"
	| "address-level4"
	| "address-level3"
	| "address-level2"
	| "address-level1"
	| "country"
	| "country-name"
	| "postal-code"
	| "cc-name"
	| "cc-given-name"
	| "cc-additional-name"
	| "cc-family-name"
	| "cc-number"
	| "cc-exp"
	| "cc-exp-month"
	| "cc-exp-year"
	| "cc-csc"
	| "cc-type"
	| "transaction-currency"
	| "transaction-amount"
	| "language"
	| "bday"
	| "bday-day"
	| "bday-month"
	| "bday-year"
	| "sex"
	| "tel"
	| "tel-country-code"
	| "tel-national"
	| "tel-area-code"
	| "tel-local"
	| "tel-extension"
	| "impp"
	| "url"
	| "photo";
