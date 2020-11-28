import React from "react";
import { v4 as uuidv4 } from "uuid";
import errorMessages from "../ErrorMessages";
import { ErrorCodes, GenericInputProps, GenericInputState } from "../types";

interface GenericInput<ValueType, T extends GenericInputProps<ValueType>> extends React.Component<T, any, GenericInputState> {
	formatValue(value: any): any;
}
abstract class GenericInput<ValueType, T extends GenericInputProps<ValueType>> extends React.Component<T, any, GenericInputState> {
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
		this.resetted = false;
		if (this.props.onChange) this.props.onChange(undefined);
		if (this.props._change) this.props._change({ name: this.props.name, value: undefined });
		this.setState({
			value: this.formatValue ? this.formatValue(undefined) : undefined,
			errorMessage: undefined,
			valid: true
		});
	};

	public getValue = (validate?: boolean) => {
		if ((validate && this.validate()) || !validate) {
			return { name: this.props.name, value: this.state.value };
		} else {
			return undefined;
		}
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
			classList += " " + this.props.className;
		}

		return classList;
	};

	protected abstract _validate = (): { valid: boolean; errorCode?: ErrorCodes } => {
		throw new Error("Valdiate is not implemented yet");
	};
}

export default GenericInput;
