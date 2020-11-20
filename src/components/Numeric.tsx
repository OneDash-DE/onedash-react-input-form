import React from "react";
import Cleave from "cleave.js/react";
import { GenericInputProps, ErrorCodes } from "../types";
import GenericInput from "./GenericInput";

interface NumericSettings {
	requiredNotVisible?: boolean;
	placeholderErrorMessage?: boolean;
	showErrorMessage?: boolean;
}

interface NumericProps extends GenericInputProps<number> {
	required?: boolean;
	minValue?: number;
	maxValue?: number;
	positiveOnly?: boolean;
	settings?: NumericSettings;
	type?: "text" | "password" | "number" | "email" | "tel" | "time";
	blocks?: number[];
	delimiter?: string;
	delimiters?: string[];
	numeralIntegerScale?: number;
	numeralDecimalScale?: number;
	numeralDecimalMark?: string;
}

export default class Numeric extends GenericInput<number, NumericProps> {
	saveTimeout: undefined | number;
	waitingValue: undefined | any;
	isChanging = false;
	constructor(props: NumericProps) {
		super(props);
		this.reference = React.createRef<HTMLInputElement>();
	}

	protected _validate = () => {
		let valid = true;
		let errorCode: ErrorCodes = ErrorCodes.Default;
		const value = Number(this.state.value);

		if (this.props.required === true && value === undefined) {
			valid = false;
			errorCode = ErrorCodes.IsEmpty;
		}
		if (this.props.minValue && value < this.props.minValue) {
			valid = false;
			errorCode = ErrorCodes.IsTooShort;
		}
		if (this.props.maxValue && value > this.props.maxValue) {
			valid = false;
			errorCode = ErrorCodes.IsTooLong;
		}

		return { valid, errorCode };
	};

	private formatValue = (value?: number) => {
		if (!value) return;

		let val = String(value);
		if (this.props.numeralDecimalMark) {
			val = val.replace(".", this.props.numeralDecimalMark);
		}

		return val;
	};

	public getValue = (validate?: boolean) => {
		if ((validate && this.validate()) || !validate) {
			return { name: this.props.name, value: this.getNumber(this.state.value) };
		} else {
			return undefined;
		}
	};

	private inputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		this.resetted = false;
		const value = e.target.value;

		this.setState(
			{
				value
			},
			() => this.saveInput(value)
		);
	};

	private getNumber = (val: string) => {
		if (!val) return;

		// Remove delimiter(s)
		if (this.props.delimiter) {
			val = val.replace(this.props.delimiter, "");
		}

		this.props.delimiters?.forEach((d) => {
			val = val.replace(d, "");
		});

		// Exchange decimal mark
		if (this.props.numeralDecimalMark) {
			val = val.replace(this.props.numeralDecimalMark, ".");
		}
		return Number(val);
	};

	private saveInput = (value?: string) => {
		if (!this.isChanging) {
			this.isChanging = true;
			this.saveTimeout = undefined;
			if (!value) value = this.waitingValue;

			if (value !== undefined) {
				if (this.props.onChange) this.props.onChange(this.getNumber(value));
				if (this.props._change) this.props._change({ name: this.props.name, value: this.getNumber(value) });
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

	componentDidUpdate(_lastProps: NumericProps) {
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
			icon,
			errorIcon,
			blocks,
			delimiter,
			delimiters,
			numeralDecimalMark,
			numeralDecimalScale,
			numeralIntegerScale,
			positiveOnly
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
					{valid === false && errorMessage && settings?.showErrorMessage !== true && (
						<div className="error-message">{errorMessage}</div>
					)}
					{required === true && !settings?.requiredNotVisible && <span className="required placeholder-required">*</span>}

					<Cleave
						disabled={disabled}
						className="component"
						placeholder={inputPlaceholder}
						onFocus={this.onFocus}
						style={this.props.style}
						ref={this.reference}
						id={this.id}
						onChange={this.inputChange}
						value={this.state.value ? this.state.value : ""}
						onBlur={this.onBlur}
						options={{
							numeral: true,
							numericOnly: true,
							numeralThousandsGroupStyle: "thousand",
							blocks,
							delimiter,
							delimiters,
							numeralPositiveOnly: positiveOnly,
							numeralDecimalMark,
							numeralDecimalScale,
							numeralIntegerScale
						}}
					/>
				</div>
			</div>
		);
	}
}
