import React from "react";
import GenericInput from "./GenericInput";
import { ErrorCodes, GenericInputProps } from "../types";

interface InputSettings {
	requiredNotVisible?: boolean;
	showErrorMessage?: boolean;
}

interface TextareaProps extends GenericInputProps<string> {
	required?: boolean;
	autoComplete?: string;
	rows?: number;
	minLength?: number;
	maxLength?: number;
	settings?: InputSettings;
}

class Textarea extends GenericInput<string, TextareaProps> {
	saveTimeout: undefined | number;
	waitingValue: undefined | any;
	isChanging = false;
	constructor(props: TextareaProps) {
		super(props);
		this.reference = React.createRef<HTMLInputElement>();
	}

	protected _validate = () => {
		let valid = true;
		let errorCode: ErrorCodes = ErrorCodes.Default;
		const value = this.state.value;

		if (this.props.required === true && (value === undefined || String(value)?.length === 0)) {
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
		return { valid, errorCode };
	};

	private formatValue = (value?: any) => {
		if (value) {
			return value;
		} else {
			return undefined;
		}
	};

	private inputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		this.resetted = false;
		const value: string | number = e.target.value;
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

	componentDidUpdate(_lastProps: TextareaProps) {
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
		const { icon, errorIcon, settings, required } = this.props;
		const { valid, errorMessage } = this.state;

		return (
			<div className={this.buildClassList("onedash-textarea")}>
				{this.props.label && (
					<label className="onedash-label" htmlFor={this.id}>
						{this.props.label}
						{this.props.required === true && !this.props.settings?.requiredNotVisible && <span className="required">*</span>}
					</label>
				)}
				<div className="input-wrapper">
					{icon && <div className="input-icon">{icon}</div>}
					{errorIcon}
					{valid === false && errorMessage && settings?.showErrorMessage !== true && (
						<div className="error-message">{errorMessage}</div>
					)}
					{required === true && !settings?.requiredNotVisible && <span className="required placeholder-required">*</span>}

					<textarea
						disabled={this.props.disabled}
						className="component"
						placeholder={this.props.placeholder}
						onFocus={this.onFocus}
						ref={this.reference}
						id={this.id}
						onChange={this.inputChange}
						value={this.state.value ? this.state.value : ""}
						onBlur={this.onBlur}
						autoComplete={this.props.autoComplete}
						rows={this.props.rows}
						maxLength={this.props.maxLength}
					/>
				</div>
			</div>
		);
	}
}

export default Textarea;
