import React from "react";
import GenericInput, { GenericInputProps } from "./GenericInput";
import { AutoCompleteTypes, ValueLabelPair } from "../types";
import errorMessages from "../ErrorMessages";
import { ErrorCodes } from "../localeTypes";

interface NativeSelectSettings {
	requiredNotVisible?: boolean;
	searchTimeout?: number;
	searchable?: boolean;
	showErrorMessage?: boolean;
	placeholderErrorMessage?: boolean;
}

interface NativeSelectProps extends GenericInputProps<any> {
	options?: ValueLabelPair[];
	settings?: NativeSelectSettings;
	autoComplete?: AutoCompleteTypes;
	required?: boolean;
	noSelectionText?: string;
}

export default class NativeSelect extends GenericInput<any, NativeSelectProps> {
	isLoading = false;
	searchWaiting = false;
	latestSearchString = "";
	timeout: number | null = null;

	constructor(props: NativeSelectProps) {
		super(props);
		this.reference = React.createRef<any>();
	}

	protected _validate = () => {
		let valid = true;
		let errorCode: ErrorCodes = ErrorCodes.Default;
		const { value } = this.state;
		if (this.props.required && (!value || value === "invalid-input")) {
			valid = false;
			errorCode = ErrorCodes.IsEmpty;
		}
		return { valid, errorCode };
	};

	private inputChange = (value: any) => {
		this.resetted = false;

		value = value !== undefined ? JSON.parse(value) : value;

		if (value !== "invalid-input") {
			this.setState(
				{
					value
				},
				() => {
					if (this.props.onChange) this.props.onChange(value);
					if (this.props._change) this.props._change({ name: this.props.name, value });
				}
			);
		}
	};

	private loadSelected = () => {
		const value = this.props.value ? this.props.value : undefined;
		this.setState({ value });
	};

	componentDidMount() {
		this.loadDefaultValue();
	}

	public loadDefaultValue = () => {
		this.setState({ value: this.props.defaultValue ?? this.props.value });
	};

	componentDidUpdate(lastProps: NativeSelectProps) {
		// Default Value is defined
		if (this.props.value !== lastProps.value) {
			this.loadSelected();
		}
	}

	render() {
		const { settings, required, icon, errorIcon, placeholder, autoComplete } = this.props;
		const { valid, errorMessage } = this.state;

		const options = this.props.options ? this.props.options : [];
		if (!this.props.required && !options.find((x) => x.value === "none")) {
			options.unshift({
				label: this.props.noSelectionText ?? "No selection",
				value: "none"
			});
		}

		let inputPlaceholder = placeholder ?? errorMessages()[ErrorCodes.PleaseChoose];
		if (settings?.placeholderErrorMessage === true && valid === false && errorMessage) {
			inputPlaceholder = errorMessage;
		}

		return (
			<div className={this.buildClassList("onedash-select")}>
				{this.props.label && (
					<label className="onedash-label" htmlFor={this.id}>
						{this.props.label}
						{this.props.required === true && !this.props.settings?.requiredNotVisible && (
							<span className="required">*</span>
						)}
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

					<select
						placeholder={inputPlaceholder}
						disabled={this.props.disabled}
						onBlur={this.onBlur}
						style={this.props.style}
						value={this.state.value !== undefined ? JSON.stringify(this.state.value) : "invalid-input"}
						onFocus={this.onFocus}
						autoComplete={autoComplete}
						onChange={(e) => this.inputChange(e.target.value)}
						tabIndex={this.props.tabIndex}
						className="component">
						<option value={'"invalid-input"'}>
							{this.props.placeholder ? this.props.placeholder : errorMessages()[ErrorCodes.PleaseChoose]}
						</option>
						{options.map((option, index) => (
							<option key={index as any} value={JSON.stringify(option.value)}>
								{option.label}
							</option>
						))}
					</select>
				</div>
			</div>
		);
	}
}
