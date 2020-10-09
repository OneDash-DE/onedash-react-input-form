import React, { Component } from "react";
import { Form, Input, NativeSelect, DateRangePicker, DatePicker, Toggle, Textarea, CustomSelect, Numeric } from "onedash-react-form";
import ErrorIcon from "./ErrorIcon";
import "onedash-react-form/dist/index.css";
import { FAVORITE_COLORS, GENDER_OPTIONS } from "./FORM_OPTIONS";

interface AppProps {}

class App extends Component<AppProps> {
	/*onChange = (values: any, form: Form, valid: boolean) => {
		console.log(values);
		console.log(form);
		console.log(valid);
	};*/

	onSubmit = (values: any, form: Form) => {
		console.log(values);
		console.log(form);
	};

	render() {
		const validateLastName = (value?: string) => {
			if (!value || value.length === 0) return true;
			// Check if first letter is uppercase
			if (/[A-Z]/.test(value[0]) === false) {
				return { valid: false, errorMessage: "The first letter must be uppercase!" };
			}
			return true;
		};
		return (
			<div className="app">
				<Form
					componentClassName="tf"
					className="testing-form"
					onSubmit={this.onSubmit}
					submitText="Submit form"
					resetText="Cancel form"
					errorIcon={<ErrorIcon />}
					validateOnSubmit>
					<h2>General information</h2>
					<div className="fieldset">
						<NativeSelect
							icon={<i className="lni lni-home" />}
							name="gender"
							label="Your gender"
							placeholder="Choose your gender"
							options={GENDER_OPTIONS}
						/>
						<Input name="disabled" label="Disabled" className="disabled" disabled required />

						<Input
							name="first-name"
							maxLength={5}
							label="First name"
							placeholder="Enter your first name"
							className="first-name"
							required
						/>
						<Input
							name="last-name"
							label="Last name"
							onValidate={validateLastName}
							placeholder="Enter your last name"
							className="last-name"
							required
						/>
					</div>
					<h2>More information</h2>
					<div className="fieldset">
						<DateRangePicker langKey={"de"} required label="Daterange" name="date-range" />
						<DatePicker langKey={"de"} required name="date" label="Date" icon={<i className="lni lni-calendar"></i>} />
						<Input required name="email" type="email" placeholder="E-Mail" icon={<i className="lni lni-envelope"></i>} />
						<Input required name="tel" type="tel" placeholder="Phone number" icon={<i className="lni lni-phone"></i>} />

						<div className="fieldset">
							<Input icon={<i className="lni lni-direction-alt" />} name="street" type="text" placeholder="Street" required />
							<Input
								icon={<i className="lni lni-home" />}
								name="housenumber"
								type="text"
								placeholder="Housenumber"
								required
							/>
							<Input
								icon={<i className="lni lni-direction" />}
								name="zip-code"
								type="text"
								placeholder="Zip - Code"
								required
							/>
							<Input icon={<i className="lni lni-apartment" />} name="city" type="text" placeholder="City" required />
						</div>

						<Textarea
							icon={<i className="lni lni-text-align-justify"></i>}
							name="text"
							placeholder="Ihr Text ..."
							value="Lorem ipsum dolorem sit ... "
							minLength={50}
							required
						/>

						<Toggle required name="boolean-input">
							Hiermit bestätigen Sie, dass sie unsere <a href="#privacy">Datenschutzerklärung</a> und unser{" "}
							<a href="#impress">Impressum</a> gelesen und verstanden haben
						</Toggle>

						<CustomSelect
							icon={<i className="lni lni-bulb" />}
							name="favorite-colors"
							label="Your favorite colors"
							placeholder="Choose your favorite colors"
							options={FAVORITE_COLORS}
							isMulti
						/>
						<CustomSelect
							icon={<i className="lni lni-home" />}
							name="gender"
							label="Your gender"
							placeholder="Choose your gender"
							options={GENDER_OPTIONS}
						/>

						<Numeric
							required
							label="Price"
							placeholder="Enter a price"
							name="price"
							icon={<i className="lni lni-dollar"></i>}
							numeralDecimalMark=","
							delimiter="."
							value={113252.45}
							onChange={(val) => console.log(val)}
						/>
					</div>
				</Form>
			</div>
		);
	}
}

export default App;
