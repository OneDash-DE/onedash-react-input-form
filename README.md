[![Codacy Badge](https://api.codacy.com/project/badge/Grade/1607212d45ce4d239c4f3dfa68b94709)](https://app.codacy.com/gh/OneDash-DE/onedash-react-input-form?utm_source=github.com&utm_medium=referral&utm_content=OneDash-DE/onedash-react-input-form&utm_campaign=Badge_Grade)
![npm](https://img.shields.io/npm/dw/onedash-react-input-form)

# React.js input form and components

This guide will help you render form and input components with React.js.
If you're not familiar with setting up a new React web project, please refer to the React documentation.

## Install

In order to install the components run the following:

```bash
npm install onedash-react-input-form
```

## Usage

All the described components can be imported from "onedash-react-input-form".

_Example:_

```javascript
import React, Component from "react";
import {Form, Input} from "onedash-react-input-form";

class ComponentWithForm extends Component {
	render() {
		return (
			<Form>
				<Input
				name="first-name"
				placeholder="Here comes your first name"
				label="First name (Label)"
				required />
			</Form>
		)
	}
}
```

## Styling

Most components come without any style. You can adjust it yourself by CSS. If you like the style in this documentation, you can use our stylesheet from [here](https://github.com/OneDash-DE/onedash-react-input-form/blob/master/src/components/stories/input.sass).

## Name

Each component get's a name which will is necessary for the form component. The name defines a property name / path where to store the input value.

_Example:_

```javascript
<Form onChange={this.niceFunction}>
	<Input name="firstName" placeholder="Here comes your first name" label="First name (Label)" required />
	<Input name="lastName" placeholder="Here comes your last name" label="Last name (Label)" required />
	<Input name="arr[0].test" placeholder="Testinput" label="Testinput (Label)" required />
</Form>
```

When you now type in some values in firstname or lastname the onChange event is fired. It contains all the current values of the form in the following style:

```json
{
	"firstName": "John",
	"lastName": "Doe",
	"arr": [
		{
			"test": "Special testing input"
		}
	]
}
```
