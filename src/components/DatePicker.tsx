import React from "react";
import GenericInput from "./GenericInput";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import SingleDatePicker from "react-dates/lib/components/SingleDatePicker";
import { ErrorCodes, GenericInputProps } from "../types";
import moment from "moment";
import "moment/locale/de";
import "moment/locale/en-gb";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

interface DatePickerSettings {
	requiredNotVisible?: boolean;
	showErrorMessage?: boolean;
}
interface DatePickerProps extends GenericInputProps<number> {
	required?: boolean;
	settings?: DatePickerSettings;
	numberOfMonths?: number;
	minDate?: dayjs.Dayjs;
	maxDate?: dayjs.Dayjs;
	isDayBlocked?: (date: dayjs.Dayjs) => boolean;
	langKey?: string;
	withPortal?: boolean;
}

export default class DatePicker extends GenericInput<number, DatePickerProps> {
	locale = "de";
	state = {
		value: null as number | null,
		valid: true,
		focus: false,
		errorMessage: undefined
	};

	protected _validate = () => {
		let valid = true;
		let errorCode: ErrorCodes = ErrorCodes.Default;
		const value = this.state.value;
		if (this.props.required && !value) {
			valid = false;
			errorCode = ErrorCodes.IsEmpty;
		}
		return { valid, errorCode };
	};

	constructor(props: DatePickerProps) {
		super(props);
		this.reference = React.createRef<any>();
	}

	checkRange = (date: dayjs.Dayjs) => {
		if (this.props.minDate) {
			if (this.props.maxDate) {
				return !(date.isSameOrAfter(this.props.minDate) && date.isSameOrBefore(this.props.maxDate));
			} else {
				return !date.isSameOrAfter(this.props.minDate);
			}
		}
		if (this.props.maxDate) {
			return !date.isSameOrBefore(this.props.maxDate);
		}
		return false;
	};

	componentDidMount() {
		this.setState({ value: this.props.value ? this.props.value : null });
		this.setDateInternalization();
	}

	setDateInternalization = () => {
		this.locale = this.props.langKey ?? "en-gb";
		moment.locale(this.locale);
	};

	componentDidUpdate(lastProps: DatePickerProps) {
		const value = this.props.value ? this.props.value : null;
		if (this.props.value !== lastProps.value) {
			this.setState({ value });
		}
		if (this.props.langKey !== lastProps.langKey) {
			this.setDateInternalization();
		}
	}

	public reset = () => {
		return new Promise<void>((resolve) => {
			this.resetted = false;
			if (this.props.onChange && this.props.changeTriggerReset) this.props.onChange(undefined);
			if (this.props._change) this.props._change({ name: this.props.name, value: undefined });
			this.setState(
				{
					value: null,
					errorMessage: undefined,
					valid: true
				},
				resolve
			);
		});
	};

	private dateChanged = (date: any) => {
		this.resetted = false;
		const value = date?.toDate()?.getTime();
		if (!value) return;
		this.setState(
			{
				value
			},
			() => {
				this.onBlur();

				if (this.props.onChange) this.props.onChange(value);
				if (this.props._change) this.props._change({ name: this.props.name, value });
			}
		);
	};

	render() {
		const { icon, errorIcon, settings, required } = this.props;
		const { valid, errorMessage } = this.state;
		return (
			<div style={this.props.style} className={this.buildClassList("onedash-date-picker")}>
				{this.props.label && (
					<label className="onedash-label" htmlFor={this.id}>
						{this.props.label}
						{this.props.required === true && !this.props.settings?.requiredNotVisible && <span className="required">*</span>}
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

					<SingleDatePicker
						date={this.state.value === null ? null : moment(this.state.value)}
						onDateChange={this.dateChanged}
						focused={this.state.focus}
						disabled={this.props.disabled}
						placeholder={this.props.placeholder ?? "Choose a date"}
						numberOfMonths={this.props.numberOfMonths ? this.props.numberOfMonths : window.innerWidth > 1200 ? 2 : 1}
						isOutsideRange={this.checkRange}
						isDayBlocked={this.props.isDayBlocked}
						withPortal={this.props.withPortal}
						onFocusChange={(e: any) => {
							if (e.focused === true) {
								this.onFocus();
							} else {
								this.onBlur();
							}
						}}
						id={this.id}
					/>
				</div>
			</div>
		);
	}
}
