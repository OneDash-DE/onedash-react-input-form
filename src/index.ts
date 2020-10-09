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
import { ValueLabelPair } from "./types";
import dayjs from "dayjs";

export { Form, NativeSelect, CustomSelect, Button, DatePicker, DateRangePicker, Input, Numeric, Toggle, Textarea, ValueLabelPair };

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
