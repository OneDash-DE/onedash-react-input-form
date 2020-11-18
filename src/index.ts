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
import { ErrorMessages, ValueLabelPair } from "./types";
import { DE, EN } from "./locales";
import dayjs from "dayjs";
import { setLocaleMessages } from "./ErrorMessages";

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
	FormLocales
};

declare module "dayjs" {
	export interface Dayjs {
		timestamp(): number;
	}
}
const timestampExtension = (_option: any, dayjsClass: any) => {
	// extend dayjs()
	// e.g. add dayjs().isSameOrBefore()
	dayjsClass.prototype.timestamp = function () {
		return this.toDate().getTime();
	};
};

dayjs.extend(timestampExtension);
