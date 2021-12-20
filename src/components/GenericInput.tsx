/* eslint-disable react/no-unused-state */
import React from "react";
import { v4 as uuidv4 } from "uuid";
import errorMessages from "../ErrorMessages";
import { ErrorCodes } from "../localeTypes";

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
	value?: ValueType | null;

	/**
	 * Default value of the input
	 */
	defaultValue?: ValueType | null;

	/**
	 * @private onChange listener for form component
	 */
	_change?: (obj: { value?: ValueType | null; name: string }) => any;

	/**
	 * OnChange listener which returns the value of the component
	 */
	onChange?: (value?: ValueType | null) => any;

	/**
	 * A flag which has to be set to true if you want to trigger onChange when the input get's resetted
	 */
	changeTriggerReset?: boolean;

	/**
	 * OnBlur Event
	 */
	onBlur?: (value?: ValueType | null) => any;

	/**
	 * OnFocus Event
	 */
	onFocus?: () => any;

	/**
	 * OnValidate additional validation step for this component
	 */
	onValidate?: (value?: ValueType | null) => boolean | { valid: boolean; errorMessage?: string };

	/**
	 * A save delay in ms. If you don't provide a delay, 200ms will be used.
	 */
	saveDelay?: number;

	/**
	 * React styles for this component
	 */
	style?: React.CSSProperties;

	icon?: React.ReactNode;
	errorIcon?: React.ReactNode;

	onError?: (errorCode: ErrorCodes, component: GenericInput<any, any>, value?: ValueType) => string;

	disableFormTrigger?: boolean;

	tabIndex?: number;
}

export interface GenericInputState {
	value?: any;
	valid: boolean;
	focus: boolean;
}

interface GenericInput<ValueType, T extends GenericInputProps<ValueType>>
	extends React.Component<T, any, GenericInputState> {
	formatValue(value: any): any;
}
abstract class GenericInput<ValueType, T extends GenericInputProps<ValueType>> extends React.Component<
	T,
	any,
	GenericInputState
> {
	protected id = uuidv4();
	protected reference: any;
	protected resetted = false;

	state = {
		value: undefined as undefined | any,
		valid: true,
		focus: false,
		errorMessage: undefined as undefined | string
	};

	public resetValid = () => {
		this.setState({
			valid: true
		});
	};

	public setInvalid = () => {
		this.setState({
			valid: false
		});
	};

	public validate = (updateComponent = true) => {
		if (this.props.disabled === true) {
			if (updateComponent === true) this.setState({ valid: true, errorMessage: undefined });
			return true;
		}
		const customValid = this.props.onValidate?.(this.state.value) ?? true;
		let valid;
		let errorMessage;
		if (typeof customValid === "object") {
			errorMessage = customValid.valid === false ? customValid.errorMessage : undefined;
			valid = customValid.valid;
		} else {
			errorMessage = customValid === false ? errorMessages()[ErrorCodes.Default] : undefined;
			valid = customValid;
		}
		if (valid) {
			const v = this._validate();
			valid = v.valid;
			errorMessage = valid === false ? errorMessages()[v.errorCode ?? ErrorCodes.Default] : undefined;
		}

		if (updateComponent === true) this.setState({ valid, errorMessage });
		return valid;
	};

	public focus = () => {
		if (this.reference?.current?.focus) {
			this.reference.current.focus();
			this.onFocus();
		}
	};

	public reset = () => {
		return new Promise<void>((resolve) => {
			this.resetted = false;
			if (this.props.onChange && this.props.changeTriggerReset) this.props.onChange(undefined);
			if (this.props._change) this.props._change({ name: this.props.name, value: undefined });
			this.setState(
				{
					value: this.formatValue ? this.formatValue(undefined) : undefined,
					errorMessage: undefined,
					valid: true
				},
				resolve
			);
		});
	};

	public getValue = (validate?: boolean) => {
		if ((validate && this.validate()) || !validate) {
			return { name: this.props.name, value: this.state.value };
		}
		return undefined;
	};

	protected onFocus = () => {
		if (this.props.onFocus) this.props.onFocus();
		this.setState({
			focus: true,
			valid: true,
			errorMessage: undefined
		});
	};

	protected onBlur = () => {
		this.validate();
		this.setState({
			focus: false
		});
		const v = this.getValue();
		if (this.props.onBlur) this.props.onBlur(v?.value);
	};

	protected buildClassList = (componentName: string) => {
		let classList = `onedash-form-v2-component ${componentName}`;
		if (this.state.value && this.state.value.length > 0) {
			classList += " filled";
		}

		if (this.state.focus) {
			classList += " focused";
		}
		if (this.props.label && this.props.label.length > 0) {
			classList += " has-label";
		}

		if (!this.state.valid) {
			classList += " input-invalid";
		}
		if (React.Children.toArray(this.props.children).length > 0) {
			classList += " has-children";
		}
		if (this.props.disabled) {
			classList += " disabled";
		}

		if (this.props.icon) {
			classList += " with-icon";
		}
		if (this.props.className) {
			classList += ` ${this.props.className}`;
		}

		return classList;
	};
	public abstract loadDefaultValue(): void;

	protected abstract _validate(): { valid: boolean; errorCode?: ErrorCodes };
}

export default GenericInput;
