import React from "react";
import InputRange, { Range } from "react-input-range";
import { GenericInputProps, ErrorCodes } from "../types";
import GenericInput from "./GenericInput";

type SliderStateType = number | Range;
interface RangeSliderProps extends GenericInputProps<SliderStateType> {
	maxValue: number;
	minValue: number;
	defaultValue: number | Range;
	formatLabel?: (val: number | Range) => string;
	step?: number;
	allowSameValues?: boolean;
}

export default class RangeSlider extends GenericInput<SliderStateType, RangeSliderProps> {
	state = {
		value: this.props.defaultValue,
		valid: true,
		focus: false,
		errorMessage: undefined
	};

	protected _validate = () => {
		const valid = true;
		const errorCode: ErrorCodes = ErrorCodes.Default;

		return { valid, errorCode };
	};

	constructor(props: RangeSliderProps) {
		super(props);
		this.reference = React.createRef<any>();
	}

	componentDidMount() {
		this.setState({ value: this.props.defaultValue });
	}

	componentDidUpdate(lastProps: RangeSliderProps) {
		const value = this.props.value ? this.props.value : null;
		if (this.props.value !== lastProps.value) {
			this.setState({ value });
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

	private onChange = (value: number | Range) => {
		this.resetted = false;
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
		const { minValue, maxValue, formatLabel, step, allowSameValues } = this.props;
		const { value } = this.state;
		return (
			<div style={this.props.style} className={this.buildClassList("onedash-range-slider")}>
				{this.props.label && (
					<label className="onedash-label" htmlFor={this.id}>
						{this.props.label}
					</label>
				)}
				<div className="input-wrapper">
					<InputRange
						step={step}
						formatLabel={formatLabel}
						onChange={this.onChange}
						value={value}
						minValue={minValue}
						maxValue={maxValue}
						allowSameValues={allowSameValues}
					/>
				</div>
			</div>
		);
	}
}
