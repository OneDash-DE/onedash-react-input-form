import React from "react";
import GenericInput from "./GenericInput";
import { AutoCompleteTypes, ErrorCodes, GenericInputProps } from "../types";

interface InputSettings {
	requiredNotVisible?: boolean;
	allowNumberNull?: boolean;
	allowNumberNegative?: boolean;
	validateEmail?: boolean;
	validateTel?: boolean;
	textAreaRows?: number;
	showErrorMessage?: boolean;
	placeholderErrorMessage?: boolean;
}

export interface InputProps extends GenericInputProps<string> {
	required?: boolean;
	autoComplete?: AutoCompleteTypes;
	pattern?: string;
	minLength?: number;
	maxLength?: number;
	settings?: InputSettings;
	type?: "text" | "password" | "number" | "email" | "tel" | "time";
	autoFocus?: boolean;
}

class Input extends GenericInput<string, InputProps> {
	saveTimeout: undefined | number;
	waitingValue: undefined | any;
	isChanging = false;
	constructor(props: InputProps) {
		super(props);
		this.reference = React.createRef<HTMLInputElement>();
	}

	protected _validate = () => {
		let valid = true;
		let errorCode: ErrorCodes = ErrorCodes.Default;
		const value = this.state.value;

		if (this.props.type === "number") {
			const num = Number(this.state.value);
			if (this.props.settings?.allowNumberNull === false && num === 0) {
				valid = false;
				errorCode = ErrorCodes.NullNotAllowed;
			}
			if (this.props.settings?.allowNumberNegative === false && num < 0) {
				valid = false;
				errorCode = ErrorCodes.NegativeNotAllowed;
			}
		}
		if (this.props.required === true && (value === undefined || value === null || String(value)?.length === 0)) {
			valid = false;
			errorCode = ErrorCodes.IsEmpty;
		}
		if (this.props.minLength && value && String(value)?.length < this.props.minLength) {
			valid = false;
			errorCode = ErrorCodes.IsTooShort;
		}
		if (this.props.maxLength && this.props.maxLength > 0 && value && String(value)?.length > this.props.maxLength) {
			valid = false;
			errorCode = ErrorCodes.IsTooLong;
		}
		if (
			value &&
			this.props.type === "email" &&
			this.props.settings?.validateEmail !== false &&
			this.emailValidation(String(value)) === false
		) {
			valid = false;
			errorCode = ErrorCodes.EmailWrong;
		}
		if (
			value &&
			this.props.type === "tel" &&
			this.props.settings?.validateTel !== false &&
			this.phoneValidation(String(value)) === false
		) {
			valid = false;
			errorCode = ErrorCodes.TelWrong;
		}

		return { valid, errorCode };
	};

	private emailValidation = (email: string) => {
		// eslint-disable-next-line no-useless-escape
		const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email.toLowerCase());
	};

	private phoneValidation = (phoneNum: string) => {
		const re = /^(\+{0,})(\d{0,})([(]{1}\d{1,3}[)]{0,}){0,}(\s?\d+|\+\d{2,3}\s{1}\d+|\d+){1}[\s|-]?\d+([\s|-]?\d+){1,2}(\s){0,}$/;
		return re.test(phoneNum.toLowerCase());
	};

	formatValue = (value?: any) => {
		if (value) {
			return value;
		} else {
			if (this.props.type === "number") {
				return 0;
			}
			return undefined;
		}
	};

	private inputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		this.resetted = false;
		const value: string = String(e.target.value);

		if (this.props.pattern) {
			// First check pattern
			const regexr = new RegExp(this.props.pattern);
			if (regexr.test(value) === false) return;
		}

		this.setState(
			{
				value
			},
			() => this.saveInput(value)
		);
	};

	private saveInput = (value?: string) => {
		if (!this.isChanging) {
			this.isChanging = true;
			this.saveTimeout = undefined;
			if (!value) value = this.waitingValue;

			if (value !== undefined) {
				if (this.props.onChange) this.props.onChange(value);
				if (this.props._change) this.props._change({ name: this.props.name, value });
			}
		} else {
			if (!this.saveTimeout) {
				this.saveTimeout = setTimeout(() => {
					this.isChanging = false;
					this.saveInput();
				}, 200) as any;
			}
			this.waitingValue = value;
		}
	};

	componentDidMount() {
		this.setState({ value: this.formatValue(this.props.value) });
	}

	componentDidUpdate(_lastProps: InputProps) {
		const t = JSON.stringify;
		if (
			(t(this.formatValue(this.props.value)) !== t(this.state.value) && this.resetted === true) ||
			_lastProps.value !== this.props.value
		) {
			this.setState({
				value: this.formatValue(this.props.value),
				valid: true
			});
		}
	}

	render() {
		const {
			label,
			settings,
			placeholder,
			required,
			disabled,
			type,
			autoComplete,
			maxLength,
			icon,
			errorIcon,
			pattern,
			autoFocus
		} = this.props;
		const { valid, errorMessage } = this.state;

		let inputPlaceholder = placeholder;
		if (settings?.placeholderErrorMessage === true && valid === false && errorMessage) {
			inputPlaceholder = errorMessage;
		}
		return (
			<div className={this.buildClassList("onedash-input")}>
				{label && (
					<label className="onedash-label" htmlFor={this.id}>
						{label}
						{required === true && !settings?.requiredNotVisible && <span className="required">*</span>}
					</label>
				)}
				<div className="input-wrapper">
					{icon && <div className="input-icon">{icon}</div>}
					{errorIcon}
					{valid === false && errorMessage && settings?.showErrorMessage !== false && (
						<label className="error-message" htmlFor={this.id}>
							{errorMessage}
						</label>
					)}
					{required === true && !settings?.requiredNotVisible && <span className="required placeholder-required">*</span>}

					<input
						disabled={disabled}
						className="component"
						placeholder={inputPlaceholder}
						onFocus={this.onFocus}
						ref={this.reference}
						type={type ?? "text"}
						id={this.id}
						onChange={this.inputChange}
						value={this.state.value ? this.state.value : ""}
						onBlur={this.onBlur}
						autoComplete={autoComplete}
						pattern={pattern}
						maxLength={maxLength}
						style={this.props.style}
						autoFocus={autoFocus}
					/>
				</div>
			</div>
		);
	}
}

export default Input;
