import * as React from 'react';

import { DynamicForm } from '@pnp/spfx-controls-react/lib/DynamicForm';
import { TextField, Icon, Text } from '@fluentui/react';
import PnPOverrideFormField from './PnPOverrideFormField';

import IExtensionOptions from '../../FeedbackButton/IExtensionOptions';
import IFeedbackValuesRef, {
	IPnPFeedbackValuesRef,
	PnPFeedbackInitialValues,
} from '../../PanelFeedback/IFeedbackValuesRef';
import { getValuesInformation, savePnPFormFeedback } from '../fnPanelFeedback';

import * as strings from 'CollectFeedbackApplicationCustomizerStrings';
import styles from '../css/PanelFeedbackController.module.scss';

export interface IPnPFeedbackFormProps {
	context: any;
	options: IExtensionOptions;
	onDismissPanel: () => void;
}
export interface IPnPFeedbackFormState {}

export default function PnPFeedbackForm(props: IPnPFeedbackFormProps) {
	//
	// state and initialisation

	const [isLoading, setIsLoading] = React.useState<boolean>(true);
	const [hasErrors, setHasErrors] = React.useState<boolean>(false);

	const feedbackValueRef = React.useRef<IPnPFeedbackValuesRef>(PnPFeedbackInitialValues);
	const formFieldsOverrides = React.useRef({});

	// component mount --------------------------------------------------------

	React.useEffect(() => {
		// get initial form values
		async function retrieveDefaultFormInformation(): Promise<void> {
			// base information about site and page
			let _pageAndSiteInfo: Partial<IFeedbackValuesRef> = await getValuesInformation();
			// update references used in form
			feedbackValueRef.current = {
				Title: `Feedback for ${props.context.pageContext.web.title}`,
				Body: '',
				SiteUrl: {
					Url: props.context.pageContext.web.absoluteUrl,
					Description: props.context.pageContext.web.title,
				},
				PageUrl: {
					Url: _pageAndSiteInfo.pageUrl,
					Description: _pageAndSiteInfo.pageTitle,
				},
				Status: 'New',
			};
			// update field overrides (fields will be rendered different than in the list)
			formFieldsOverrides.current = {
				SiteUrl: (fieldProps: any) => {
					return (
						<PnPOverrideFormField
							label={strings.COMMON_LABEL_SITE}
							value={feedbackValueRef.current.SiteUrl.Description}
						/>
					);
				},
				PageUrl: (fieldProps: any) => {
					return (
						<PnPOverrideFormField
							label={strings.COMMON_LABEL_PAGE}
							value={feedbackValueRef.current.PageUrl.Description}
						/>
					);
				},
				Status: (fieldProps: any) => {
					return null;
				},
				Body: (fieldProps: any) => {
					return (
						<TextField
							defaultValue={feedbackValueRef.current.Body}
							required
							multiline
							rows={10}
							styles={{ root: { marginLeft: '3px' } }}
							onRenderLabel={() => {
								return (
									<div style={{ margin: '5px 0px' }}>
										<Icon
											iconName='TextField'
											styles={{
												root: { fontSize: '115%', paddingRight: '8px' },
											}}
										/>
										<Text
											variant='medium'
											style={{
												position: 'relative',
												top: '-4px',
												fontWeight: 600,
											}}>
											{strings.COMMON_LABEL_FEEDBACK} *
										</Text>
									</div>
								);
							}}
							onChange={(ev: any, newValue?: string) => {
								// update feedback body field
								if (newValue) {
									feedbackValueRef.current.Body = newValue;
								}
							}}
						/>
					);
				},
			};
			// set flag
			setIsLoading(false);
		}
		// get initial form values
		retrieveDefaultFormInformation();
	}, []);

	// helper functions -------------------------------------------------------

	async function _onBeforeSubmit(listItemData: any): Promise<boolean> {
		// return boolean > true = cancel submit, false = submit

		for (const key in listItemData) {
			// replace values in default feedback values
			feedbackValueRef.current[key] = listItemData[key];
		}
		// save the data to the feedback list
		const saveSuccess: boolean = await savePnPFormFeedback(feedbackValueRef.current);

		if (saveSuccess) {
			// dismiss the panel
			props.onDismissPanel();
		} else {
			// TODO - now what...
		}

		// return failure to prevent submitting the form (does not work in PnP Dynamic Form)
		return Promise.resolve(true);
	}

	// component render -------------------------------------------------------

	if (isLoading) {
		// loading state > return nothing...
		return null;
	}

	return (
		<div className={styles.FormContainer}>
			{/* introduction */}
			<Text variant='medium'>{strings.PANEL_SUBTITLE}</Text>
			{/* feedback form */}
			<DynamicForm
				context={props.context}
				listId={props.options.listId}
				onCancelled={props.onDismissPanel}
				onBeforeSubmit={_onBeforeSubmit}
				fieldOverrides={formFieldsOverrides.current}
			/>
		</div>
	);
}
