import dayjs from "dayjs";
import Button from "./components/Button";
import NativeSelect from "./components/NativeSelect";
import CustomSelect from "./components/CustomSelect";
import DatePicker from "./components/DatePicker";
import DateRangePicker from "./components/DateRangePicker";
import Form from "./components/Form";
import Input from "./components/Input";
import Numeric from "./components/Numeric";
import Textarea from "./components/Textarea";
import Toggle from "./components/Toggle";
import RangeSlider from "./components/RangeSlider";
import VerificationCode from "./components/VerificationCode";
import { ValueLabelPair } from "./types";
import { DE, EN } from "./locales";
import { setLocaleMessages } from "./ErrorMessages";
import { ErrorMessages } from "./localeTypes";
import { get, set } from "./Utils";
import SingleFileUploader from "./components/SingleFileUploader";

const FormLocales = {
	DE,
	EN
};

export {
	Form,
	NativeSelect,
	CustomSelect,
	Button,
	DatePicker,
	DateRangePicker,
	Input,
	Numeric,
	Toggle,
	Textarea,
	ValueLabelPair,
	ErrorMessages,
	setLocaleMessages,
	FormLocales,
	VerificationCode,
	RangeSlider,
	set,
	get,
	SingleFileUploader
};

declare module "dayjs" {
	export interface Dayjs {
		timestamp(): number;
	}
}
const timestampExtension = (_option: any, dayjsClass: any) => {
	// extend dayjs()
	// e.g. add dayjs().isSameOrBefore()
	// eslint-disable-next-line func-names
	dayjsClass.prototype.timestamp = function () {
		return this.toDate().getTime();
	};
};

dayjs.extend(timestampExtension);
