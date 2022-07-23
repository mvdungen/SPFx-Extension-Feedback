import * as React from 'react';

import { sp } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';

import IFeedbackValuesRef from '../../PanelFeedback/IFeedbackValuesRef';
import {
	FEEDBACKLIST,
	getValuesInformation,
	getCategoryChoices,
	saveFeedback,
} from '../fnPanelFeedback';
import {
	DefaultButton,
	Dropdown,
	IDropdownOption,
	PrimaryButton,
	Text,
	TextField,
} from 'office-ui-fabric-react';

import * as strings from 'CollectFeedbackApplicationCustomizerStrings';
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
		Category: 'Other',
		feedbackBody: '',
	};

	const feedbackValueRef = React.useRef<IFeedbackValuesRef>(initialValues);
	const feedbackFieldRef = React.useRef(null);
	const feedbackCategoryListRef = React.useRef<string[]>([]);

	//
	// component mount --------------------------------------------------------

	React.useEffect(() => {
		// get initial values for dialog

		async function retrieveFormInformation(): Promise<void> {
			// base information about site and page
			let _pageAndSiteInfo: Partial<IFeedbackValuesRef> = await getValuesInformation();
			let _categoryList: string[] = await getCategoryChoices();

			// update category references
			feedbackCategoryListRef.current = _categoryList;
			// update references used in form
			feedbackValueRef.current = {
				siteTitle: props.context.pageContext.web.title,
				siteUrl: props.context.pageContext.web.absoluteUrl,
				pageTitle: _pageAndSiteInfo.pageTitle,
				pageUrl: _pageAndSiteInfo.pageUrl,
				Status: 'New',
				Category: _categoryList.length > 0 ? _categoryList[0] : 'Other',
				feedbackBody: '',
			};
			// set flag
			setIsLoading(false);
			// focus on form field
			feedbackFieldRef.current.focus();
		}

		retrieveFormInformation();
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

	function _getCategoryOptionList(): IDropdownOption[] {
		let _options: IDropdownOption[] = [];
		feedbackCategoryListRef.current.forEach((_category: string) =>
			_options.push({ key: _category, text: _category })
		);
		return _options;
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
			<Text variant='medium'>{strings.PANEL_SUBTITLE}</Text>

			{/* feedback form */}

			<div>
				<TextField
					label={strings.COMMON_LABEL_SITE}
					defaultValue={feedbackValueRef.current.siteTitle}
					disabled
				/>
			</div>
			<div>
				<TextField
					label={strings.COMMON_LABEL_PAGE}
					defaultValue={feedbackValueRef.current.pageTitle}
					disabled
				/>
			</div>
			<div>
				<TextField
					componentRef={feedbackFieldRef}
					label={strings.COMMON_LABEL_FEEDBACK}
					required
					multiline
					rows={10}
					spellCheck={false}
					resizable={false}
					onChange={event => _updateField('feedbackBody', event)}
					onGetErrorMessage={(value: string): string => {
						return value.length === 0 ? strings.COMMON_LABEL_FEEDBACK_REQUIRED : '';
					}}
					validateOnLoad={true}
				/>
			</div>
			<div>
				<Dropdown
					label={strings.COMMON_LABEL_CHOOSE_CATEGORY}
					options={_getCategoryOptionList()}
					required
					defaultSelectedKey={feedbackCategoryListRef.current[0]}
					onChange={(event, option: IDropdownOption, index: number) =>
						_updateField('Category', { target: { value: option.text } })
					}
				/>
			</div>

			{/* error display */}

			{hasErrors && (
				<div>
					<Text variant='medium' style={{ color: 'red' }}>
						{strings.PANEL_ERROR_SAVE}
					</Text>
				</div>
			)}

			{/* panel footer */}
			
			<div className={styles.ButtonContainer}>
				<PrimaryButton
					text={strings.PANEL_BUTTON_SAVE}
					disabled={hasErrors}
					onClick={_saveFeedback}
				/>
				<DefaultButton text={strings.PANEL_BUTTON_CANCEL} onClick={props.onDismissPanel} />
			</div>
		</div>
	);
}
