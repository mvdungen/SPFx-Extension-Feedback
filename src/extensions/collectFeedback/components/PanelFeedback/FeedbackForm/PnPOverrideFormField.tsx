import { TextField } from '@fluentui/react';
import * as React from 'react';

export interface IPnPOverrideFormFieldProps {
	value: any;
	label: string;
}
export interface IPnPOverrideFormFieldState {}

export default function PnPOverrideFormField(props: IPnPOverrideFormFieldProps) {
	//
	// component return a standard UI disabled text field, used in the PnPDynamicForm

	// component render -------------------------------------------------------

	return (
		<TextField
			label={props.label}
			defaultValue={props.value}
			disabled
			readOnly
		/>
	);
}
