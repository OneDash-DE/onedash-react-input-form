import React from "react";
import Cleave from "cleave.js/react";
import GenericInput, { GenericInputProps } from "./GenericInput";
import { ErrorCodes } from "../localeTypes";

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

		if (this.props.required === true && (value === undefined || value === null)) {
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

	formatValue = (value?: number | null) => {
		if (value === null || value === undefined) return undefined;

		let val = String(value);
		if (this.props.numeralDecimalMark) {
			val = val.replace(".", this.props.numeralDecimalMark);
		}

		return val;
	};

	public getValue = (validate?: boolean) => {
		if ((validate && this.validate()) || !validate) {
			return { name: this.props.name, value: this.getNumber(this.state.value) };
		}
		return undefined;
	};

	private inputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		this.resetted = false;
		const { value } = e.target;

		this.setState(
			{
				value
			},
			() => this.saveInput(value)
		);
	};

	private getNumber = (val?: string | null) => {
		if (val === undefined || val === null) return undefined;

		// Remove delimiter(s)
		if (this.props.delimiter) {
			val = val.replace(this.props.delimiter, "");
		}

		this.props.delimiters?.forEach((d) => {
			val = (val as any).replace(d, "");
		});

		// Exchange decimal mark
		if (this.props.numeralDecimalMark) {
			val = val.replace(this.props.numeralDecimalMark, ".");
		}
		return Number(val);
	};

	private saveInput = (value?: string | null) => {
		if (this.saveTimeout !== undefined) {
			clearTimeout(this.saveTimeout);
			this.saveTimeout = undefined;
		}
		this.saveTimeout = setTimeout(() => {
			if (this.props.onChange) this.props.onChange(this.getNumber(value));
			if (this.props._change) this.props._change({ name: this.props.name, value: this.getNumber(value) });
			this.saveTimeout = undefined;
		}, this.props.saveDelay ?? 400) as any;
	};

	componentDidMount() {
		this.loadDefaultValue();
	}

	public loadDefaultValue = () => {
		this.setState({ value: this.formatValue(this.props.defaultValue ?? this.props.value) });
	};

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
					{valid === false && errorMessage && settings?.showErrorMessage !== false && (
						<label className="error-message" htmlFor={this.id}>
							{errorMessage}
						</label>
					)}
					{required === true && !settings?.requiredNotVisible && (
						<span className="required placeholder-required">*</span>
					)}

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
						tabIndex={this.props.tabIndex}
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
