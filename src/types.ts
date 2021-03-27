import GenericInput from "./components/GenericInput";
import { ErrorCodes } from "./localeTypes";

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

// eslint-disable-next-line @typescript-eslint/naming-convention
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
