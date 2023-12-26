/* eslint-disable no-console */
import React, { ReactNode } from "react";
import Input from "./Input";
import Select from "./NativeSelect";
import Button from "./Button";
import DatePicker from "./DatePicker";
import DateRangePicker from "./DateRangePicker";
import Toggle from "./Toggle";
import GenericInput from "./GenericInput";
import Textarea from "./Textarea";
import Numeric from "./Numeric";
import CustomSelect from "./CustomSelect";
import { set } from "../Utils";
import VerificationCode from "./VerificationCode";
import RangeSlider from "./RangeSlider";
import SingleFileUploader from "./SingleFileUploader";
import { ErrorCodes } from "../localeTypes";

export interface FormProps {
	onSubmit?: (values: any, control: Form) => void;
	onChange?: (values: any, control: Form, valid: boolean) => void;
	onValidationUpdate?: (valid: boolean) => void;
	className?: string;
	componentClassName?: string;

	submitText?: string;
	submitClassName?: string;
	resetText?: string;
	resetClassName?: string;

	validateOnSubmit?: boolean;
	validateOnChange?: boolean;
	debug?: boolean;

	children?: ReactNode;

	style?: React.CSSProperties;

	/**
	 * Input save delay for input or textarea props. Use this to prevent to much onChange calls
	 */
	inputSaveDelay?: number;

	onValidate?: (values: any, control: Form) => boolean;
	onError?: (errorCode: ErrorCodes, component: GenericInput<any, any>, value: any) => string;
	errorIcon?: React.ReactNode;
}

class Form extends React.Component<FormProps> {
	references: { ref: GenericInput<any, any>; name: string }[] = [];
	state = {
		valid: true
	};

	constructor(props: FormProps) {
		super(props);
		this.references = [];
		this.onSubmit.bind(this);
	}
	componentDidMount() {
		if (this.props.validateOnChange || this.props.validateOnSubmit) {
			this.validateSubmitBtn();
		}
	}

	cloneChildren = (children: any, elements: any[]) => {
		React.Children.forEach(children, (child, i) => {
			if (!child) return;
			let childElements = [] as any[];
			if (child.props && child.props.children && typeof child.props.children === "object") {
				childElements = this.cloneChildren(child.props.children, []);
			}

			if (
				child.type === Input ||
				child.type === Numeric ||
				child.type === Textarea ||
				child.type === DatePicker ||
				child.type === DateRangePicker ||
				child.type === RangeSlider ||
				child.type === Select ||
				child.type === CustomSelect ||
				child.type === VerificationCode ||
				child.type === Toggle ||
				child.type === SingleFileUploader
			) {
				let className = "";
				if (child.props.className) {
					className += `${child.props.className} `;
				}
				if (this.props.componentClassName) {
					className += `${this.props.componentClassName} `;
				}

				const newEl = React.cloneElement(
					child,
					{
						ref: (ref: any) => {
							this.references.push({
								name: child.props.name,
								ref
							});
						},
						className,
						key: i as any,
						_change: child.props.disableFormTrigger ? undefined : this.onChange,
						saveDelay: this.props.inputSaveDelay ?? undefined,
						onError: child.props.onError ?? this.props.onError,
						errorIcon: child.props.errorIcon ?? this.props.errorIcon
					},
					childElements
				);
				elements.push(newEl);
			} else if (child.type !== Form && childElements.length > 0) {
				const newEl = React.cloneElement(child, { key: i as any }, childElements);
				elements.push(newEl);
			} else {
				elements.push(child);
			}
		});

		return elements;
	};

	public getRef = (name: string) => {
		return this.references.find((x) => x.name === name && x.ref !== null);
	};

	public getData = () => {
		return this.mapData();
	};

	public validateInputs = (updateComponent = true) => {
		if (this.props.debug) {
			console.log("---------VALIDATE-----------");
			console.log(this.references);
		}
		let valid = true;

		this.references.forEach((entry) => {
			if (entry.ref) {
				if (!entry.ref.validate(updateComponent)) {
					valid = false;
					if (this.props.debug) console.log(entry.name);
				}
			}
		});

		if (this.props.debug) {
			console.log(`VALIDATION: ${valid}`);
		}

		return valid;
	};

	public resetForm = () => {
		const p: Promise<void>[] = [];
		this.references.forEach((entry) => {
			if (entry.ref) p.push(entry.ref.reset());
		});

		if (this.references.length > 0) {
			const entry = this.references[0];
			if (entry.ref) entry.ref.focus();
		}
		return Promise.all(p);
	};

	public loadDefaultValues = () => {
		this.references.forEach((entry) => {
			if (entry.ref) entry.ref.loadDefaultValue();
		});
	};

	/**
	 * Sets the valid property on all references to valid
	 */
	public resetValidation = () => {
		this.references.forEach((entry) => {
			if (entry.ref) entry.ref.resetValid();
		});
	};

	public validateSubmitBtn = () => {
		let valid = true;
		if (this.props.onValidate) {
			valid = this.props.onValidate(this.mapData(), this);
		}
		valid = valid && this.validateInputs(false);

		if (this.props.onValidationUpdate) this.props.onValidationUpdate(valid);
		this.setState({
			valid
		});
	};

	onChange = () => {
		if (this.props.debug) console.log("---------ON CHANGE-----------");
		if (this.props.debug) console.log(this.mapData());

		const values = this.mapData();
		this.validateSubmitBtn();
		if (this.props.onValidate && this.props.onValidate(values, this) === false) {
			return;
		}
		if (this.props.onChange) {
			if (this.props.validateOnChange === true) {
				if (this.validateInputs() === true) {
					this.props.onChange(values, this, this.validateInputs(false));
				}
			} else {
				this.props.onChange(values, this, this.validateInputs(false));
			}
		}
	};

	private mapData = () => {
		const values = {} as any;
		this.references.forEach((entry) => {
			if (entry.ref) {
				const valuePair = entry.ref.getValue();
				if (valuePair && valuePair.name && valuePair.name !== "_") {
					set(valuePair.name, values, valuePair.value);
				}
			}
		});
		return values;
	};

	onSubmit = (e?: any) => {
		const values = this.mapData();
		if (this.props.onValidate && this.props.onValidate(values, this) === false) {
			if (e) e.preventDefault();
			return;
		}
		if (this.props.validateOnSubmit === true) {
			if (this.validateInputs() === true) {
				if (this.props.onSubmit) this.props.onSubmit(values, this);
				if (e) e.preventDefault();
				return;
			}
			if (e) e.preventDefault();
			return;
		}
		if (this.props.onSubmit) this.props.onSubmit(values, this);

		if (e) e.preventDefault();
	};

	buildClassName = () => {
		let classes = "onedash-form";
		if (this.props.className) {
			classes += ` ${this.props.className}`;
		}
		return classes;
	};

	render() {
		const { submitClassName } = this.props;
		this.references = [];

		return (
			<form className={this.buildClassName()} onSubmit={this.onSubmit} style={this.props.style}>
				<div>{this.cloneChildren(this.props.children, [])}</div>
				<div className="form-buttons">
					{this.props.resetText && (
						<Button
							className={
								submitClassName ? `form-reset-btn ${this.props.submitClassName}` : "form-reset-btn"
							}
							onClick={() => this.resetForm()}
							type="reset">
							{this.props.resetText}
						</Button>
					)}
					{this.props.submitText && (
						<Button
							className={
								submitClassName ? `form-submit-btn ${this.props.submitClassName}` : "form-submit-btn"
							}
							disabled={(this.props.validateOnSubmit || this.props.validateOnChange) && !this.state.valid}
							type="submit">
							{this.props.submitText}
						</Button>
					)}
				</div>
			</form>
		);
	}
}

export default Form;
