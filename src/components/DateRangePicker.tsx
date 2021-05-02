import React from "react";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import DRangePicker from "react-dates/lib/components/DateRangePicker";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import "moment/locale/de";
import "moment/locale/en-gb";

import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { timestamp } from "../types";
import { ErrorCodes } from "../localeTypes";
import GenericInput, { GenericInputProps } from "./GenericInput";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

type DateRangeValueType = { startDate: number; endDate: number };
interface BooleanSettings {
	requiredNotVisible?: boolean;
}
interface DateRangePickerProps extends GenericInputProps<DateRangeValueType> {
	required?: boolean;
	settings?: BooleanSettings;
	numberOfMonths?: number;
	minDate?: timestamp;
	maxDate?: timestamp;
	isDayBlocked?: (date: timestamp) => boolean;
	langKey?: string;
	startPlaceholder?: string;
	endPlaceholder?: string;

	startDateId?: string;
	endDateId?: string;

	withPortal?: boolean;
}

const DEFAULT_VALUE = {
	startDate: null,
	endDate: null
};

export default class DateRangePicker extends GenericInput<DateRangeValueType, DateRangePickerProps> {
	locale = "de";
	state = {
		value: DEFAULT_VALUE as {
			startDate: number | null;
			endDate: number | null;
		},
		valid: true,
		focus: false,
		focusedInput: null as null | "startDate" | "endDate",
		errorMessage: undefined
	};

	protected _validate = () => {
		let valid = true;
		let errorCode: ErrorCodes = ErrorCodes.Default;
		const { value } = this.state;
		if (this.props.required && (!value.startDate || !value.endDate)) {
			valid = false;
			errorCode = ErrorCodes.IsEmpty;
		}
		return { valid, errorCode };
	};

	constructor(props: DateRangePickerProps) {
		super(props);
		this.reference = React.createRef<any>();
	}

	checkRange = (date: dayjs.Dayjs) => {
		if (this.props.minDate) {
			if (this.props.maxDate) {
				return !(date.isSameOrAfter(this.props.minDate) && date.isSameOrBefore(this.props.maxDate));
			}
			return !date.isSameOrAfter(this.props.minDate);
		}
		if (this.props.maxDate) {
			return !date.isSameOrBefore(this.props.maxDate);
		}
		return false;
	};

	componentDidMount() {
		this.loadDefaultValue();
		this.setDateInternalization();
	}

	public loadDefaultValue = () => {
		this.setState({ value: this.props.defaultValue ?? this.props.value ?? DEFAULT_VALUE });
	};

	setDateInternalization = () => {
		this.locale = this.props.langKey ?? "en-gb";
		moment.locale(this.locale);
	};

	componentDidUpdate(lastProps: DateRangePickerProps) {
		const value = this.props.value && typeof this.props.value === "object" ? this.props.value : DEFAULT_VALUE;

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
					value: DEFAULT_VALUE,
					errorMessage: undefined,
					valid: true
				},
				resolve
			);
		});
	};

	private dateChanged = (dateRange: { startDate?: any; endDate?: any }) => {
		this.resetted = false;
		const value = {
			startDate: dateRange.startDate?.toDate()?.getTime() ?? null,
			endDate: dateRange.endDate?.toDate()?.getTime() ?? null
		};
		this.setState(
			{
				value
			},
			() => {
				this.onBlur();
				if (this.props.onChange) this.props.onChange(value);

				if (this.props._change)
					this.props._change({
						name: this.props.name,
						value
					});
			}
		);
	};

	render() {
		const { startDateId, endDateId } = this.props;
		return (
			<div className={this.buildClassList("onedash-date-range-picker")}>
				{this.props.label && (
					<label className="onedash-label" htmlFor={this.id}>
						{this.props.label}
						{this.props.required === true && !this.props.settings?.requiredNotVisible && <span className="required">*</span>}
					</label>
				)}
				{this.props.placeholder && this.props.required === true && !this.props.settings?.requiredNotVisible && (
					<span className="required placeholder-required">*</span>
				)}

				<DRangePicker
					startDate={this.state.value?.startDate === null ? null : moment(this.state.value?.startDate)}
					endDate={this.state.value?.endDate === null ? null : moment(this.state.value?.endDate)}
					onDatesChange={this.dateChanged}
					disabled={this.props.disabled}
					startDatePlaceholderText={this.props.startPlaceholder ?? "Choose a start date"}
					endDatePlaceholderText={this.props.endPlaceholder ?? "Choose a end date"}
					// eslint-disable-next-line no-nested-ternary
					numberOfMonths={this.props.numberOfMonths ? this.props.numberOfMonths : window.innerWidth > 1200 ? 2 : 1}
					isOutsideRange={this.checkRange}
					isDayBlocked={this.props.isDayBlocked}
					onFocusChange={(focusedInput: any) => this.setState({ focusedInput })}
					focusedInput={this.state.focusedInput}
					startDateId={startDateId ?? uuidv4()}
					endDateId={endDateId ?? uuidv4()}
					withPortal={this.props.withPortal}
				/>
			</div>
		);
	}
}
