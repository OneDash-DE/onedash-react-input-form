/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-autofocus */
import React from "react";
import GenericInput, { GenericInputProps } from "./GenericInput";
import { AutoCompleteTypes } from "../types";
import { ErrorCodes } from "../localeTypes";

interface InputSettings {
	requiredNotVisible?: boolean;
	showErrorMessage?: boolean;
}

export interface VerificationCodeProps extends GenericInputProps<string[]> {
	required?: boolean;
	codeLength: number;
	autoComplete?: AutoCompleteTypes;
	settings?: InputSettings;
	autoFocus?: boolean;
	loadingSpinner?: JSX.Element;
}

class VerificationCode extends GenericInput<string[], VerificationCodeProps> {
	saveTimeout: undefined | number;
	waitingValue: undefined | any;
	isChanging = false;
	state = {
		value: [] as string[],
		selectedIndex: 0,
		valid: true,
		focus: false,
		errorMessage: undefined
	};

	constructor(props: VerificationCodeProps) {
		super(props);
		this.reference = React.createRef<HTMLInputElement>();
	}

	protected _validate = () => {
		let valid = true;
		let errorCode: ErrorCodes = ErrorCodes.Default;
		const { value } = this.state;

		if (this.props.required === true && (value === undefined || value === null || String(value)?.length === 0)) {
			valid = false;
			errorCode = ErrorCodes.IsEmpty;
		}

		return { valid, errorCode };
	};

	formatValue = (value?: any) => {
		if (value) {
			return value;
		}
		return [];
	};

	private inputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		if (this.state.selectedIndex >= this.props.codeLength) return;
		this.resetted = false;
		const { value } = this.state;
		let { selectedIndex } = this.state;
		let inputValue = String(e.target.value);
		if (value[selectedIndex]?.length > 0 && inputValue.length > 1) {
			inputValue = inputValue.slice(1);
		}

		if (/^$|^[0-9]+$/.test(inputValue) === false) return; // Check pattern

		// Empty
		if (inputValue.length === 0) {
			value[selectedIndex] = "";
			selectedIndex--;
		}

		for (let i = 0; i < Math.min(inputValue.length, this.props.codeLength); i++) {
			value[selectedIndex] = inputValue[i];
			selectedIndex++;
		}

		this.setState(
			{
				value,
				selectedIndex
			},
			() => this.saveInput(value)
		);
	};

	private saveInput = (value?: string[] | null) => {
		if (this.saveTimeout !== undefined) {
			clearTimeout(this.saveTimeout);
			this.saveTimeout = undefined;
		}
		this.saveTimeout = setTimeout(() => {
			if (this.props.onChange) this.props.onChange(value);
			if (this.props._change) this.props._change({ name: this.props.name, value });
			this.saveTimeout = undefined;
		}, this.props.saveDelay ?? 400) as any;
	};

	handleKeyUp = (e: any) => {
		if (e.key === "ArrowLeft" && this.state.selectedIndex > 0) {
			this.setState({ selectedIndex: this.state.selectedIndex - 1 });
		}
		if (e.key === "ArrowRight" && this.state.selectedIndex < this.props.codeLength - 1) {
			this.setState({ selectedIndex: this.state.selectedIndex + 1 });
		}
	};

	componentDidMount() {
		this.loadDefaultValue();
	}

	public loadDefaultValue = () => {
		this.setState({ value: this.formatValue(this.props.defaultValue ?? this.props.value) });
	};

	componentDidUpdate(_lastProps: VerificationCodeProps) {
		const t = JSON.stringify;
		if (
			(t(this.formatValue(this.props.value)) !== t(this.state.value) && this.resetted === true) ||
			_lastProps.value !== this.props.value
		) {
			// eslint-disable-next-line react/no-did-update-set-state
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
			autoComplete,
			icon,
			errorIcon,
			codeLength,
			autoFocus,
			loadingSpinner
		} = this.props;
		const { valid, errorMessage, value, focus, selectedIndex } = this.state;

		const hideInput = !(value.length < codeLength);

		return (
			<div className={this.buildClassList("onedash-verification-input")}>
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

					{loadingSpinner && disabled && <div className="spinner">{loadingSpinner}</div>}

					<input
						disabled={disabled}
						className="component"
						placeholder={placeholder}
						onFocus={this.onFocus}
						ref={this.reference}
						id={this.id}
						onKeyUp={this.handleKeyUp}
						onChange={this.inputChange}
						value={value[selectedIndex] ?? ""}
						onBlur={this.onBlur}
						autoComplete={autoComplete}
						pattern="^$|^[0-9]+$"
						type="tel"
						tabIndex={this.props.tabIndex}
						autoFocus={autoFocus}
						style={{
							...this.props.style,
							left: `${(selectedIndex / codeLength) * 100}%`,
							opacity: hideInput ? 0 : 1
						}}
					/>
					<div className="display-list">
						{new Array(codeLength).fill(0).map((_, index) => {
							const selected = selectedIndex === index;

							return (
								<div
									key={index as any}
									className="display"
									onClick={() => {
										if (disabled) return;
										this.setState({ selectedIndex: index });
										this.onFocus();
										this.reference.current?.focus();
									}}>
									{value[index]}
									{selected && focus && !disabled && <div className="shadows" />}
								</div>
							);
						})}
					</div>
				</div>
			</div>
		);
	}
}

export default VerificationCode;
