import * as React from 'react';

import { sp } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';

import IFeedbackValuesRef from '../../PanelFeedback/IFeedbackValuesRef';
import { FEEDBACKLIST, getValuesInformation, saveFeedback } from '../fnPanelFeedback';
import { DefaultButton, PrimaryButton, Text, TextField } from 'office-ui-fabric-react';

import styles from '../css/PanelFeedbackController.module.scss';

export interface IFeedbackFormProps {
	context: any;
	onDismissPanel: () => void;
}
export interface IFeedbackFormState {}

export default function FeedbackForm(props: IFeedbackFormProps) {
	//
	// state and initialisation

	const [isLoading, setIsLoading] = React.useState<boolean>(true);
	const [hasErrors, setHasErrors] = React.useState<boolean>(false);

	const initialValues: IFeedbackValuesRef = {
		siteTitle: '',
		siteUrl: '',
		pageTitle: '',
		pageUrl: '',
		Status: 'New',
		feedbackBody: '',
	};

	const feedbackValueRef = React.useRef<IFeedbackValuesRef>(initialValues);
	const feedbackFieldRef = React.useRef(null);

	//
	// component mount --------------------------------------------------------

	React.useEffect(() => {
		// get initial values for dialog
		getValuesInformation().then((stateInfo: Partial<IFeedbackValuesRef>) => {
			// update panel feedback ref information
			feedbackValueRef.current = {
				siteTitle: props.context.pageContext.web.title,
				siteUrl: props.context.pageContext.web.absoluteUrl,
				pageTitle: stateInfo.pageTitle,
				pageUrl: stateInfo.pageUrl,
				Status: 'New',
				feedbackBody: '',
			};
			// show the panel
			setIsLoading(false);
			// focus on form field
			feedbackFieldRef.current.focus();
		});
	}, []);

	//
	// helper functions -------------------------------------------------------

	function _updateField(field: string, event: any) {
		// update value
		feedbackValueRef.current[field] = event.target.value;
	}

	async function _saveFeedback(): Promise<void> {
		// validate input
		if (feedbackValueRef.current.feedbackBody === '') {
			// no feedback > focus field
			feedbackFieldRef.current.focus();
		} else {
			saveFeedback(feedbackValueRef.current).then((result: boolean) => {
				if (result) {
					// dismiss the panel
					props.onDismissPanel();
				} else {
					// error during save > handle error here
					setHasErrors(true);
				}
			});
		}
	}

	//
	// component render -------------------------------------------------------

	if (isLoading) {
		// loading state > return nothing...
		return null;
	}

	return (
		<div className={styles.FormContainer}>
			{/* introduction */}
			<Text variant='medium'>
				Thank you for providing us with feedback. Your feedback is highly
				appreciated. Please enter your feedback below and click 'Save Feedback'.
			</Text>

			{/* feedback form */}

			<div>
				<TextField
					label='Site'
					defaultValue={feedbackValueRef.current.siteTitle}
					disabled
				/>
			</div>
			<div>
				<TextField
					label='Page'
					defaultValue={feedbackValueRef.current.pageTitle}
					disabled
				/>
			</div>
			<div>
				<TextField
					componentRef={feedbackFieldRef}
					label='Your feedback'
					required={true}
					multiline={true}
					rows={15}
					spellCheck={false}
					resizable={false}
					onChange={event => _updateField('feedbackBody', event)}
					onGetErrorMessage={(value: string): string => {
						return value.length === 0
							? 'Feedback is a required field. Please enter your feedback in this field.'
							: '';
					}}
					validateOnLoad={true}
				/>
			</div>

			{/* error display */}

			{hasErrors && (
				<div>
					<Text variant='medium' style={{color: 'red'}}>
						Oops, something went wrong while saving your feedback. Please
						contact support for more information. We cannot save the feedback
						now.
					</Text>
				</div>
			)}

			{/* panel footer */}

			<div className={styles.ButtonContainer}>
				<PrimaryButton
					text='Save Feedback'
					disabled={hasErrors}
					onClick={_saveFeedback}
				/>
				<DefaultButton text={'Cancel'} onClick={props.onDismissPanel} />
			</div>
		</div>
	);
}
