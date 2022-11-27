import * as React from 'react';

import { TextField, Icon, Text } from '@fluentui/react';

import * as strings from 'CollectFeedbackApplicationCustomizerStrings';
import styles from '../css/PanelFeedbackController.module.scss';


export interface ISettingsFormProps {}
export interface ISettingsFormState {}

export default function SettingsForm(props: ISettingsFormProps) {
    //
    // state and initialisation

    // component mount --------------------------------------------------------

    React.useEffect(() => {
        // mount component
        // ...
        // unmount component
        // ..
    }, []);

    // helper functions -------------------------------------------------------

    // component render -------------------------------------------------------

	return (
		<div className={styles.FormContainer}>
			{/* introduction */}
			<Text variant='medium'>Manage Extension Settings</Text>
		</div>
	);

}