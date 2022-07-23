import * as React from 'react';

import { sp } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/security/list';
import '@pnp/sp/items';
import { PermissionKind } from '@pnp/sp/security';

import { FEEDBACKLIST } from '../fnPanelFeedback';
import { DefaultButton, Icon, PrimaryButton, Text } from 'office-ui-fabric-react';
import { ChoiceFieldFormatType, UrlFieldFormatType } from '@pnp/sp/fields';

import * as strings from 'CollectFeedbackApplicationCustomizerStrings';
import styles from '../css/PanelFeedbackController.module.scss';

export interface ICreateListFormProps {
	onDismissPanel: () => void;
}
export interface ICreateListFormState {}

export interface IProgression {
	counter: number;
}

export default function CreateListForm(props: ICreateListFormProps) {
	//
	// state and initialisation

	const [updateProgress, setUpdateProgress] = React.useState<IProgression>({
		counter: 0,
	});
	const [isLoading, setIsLoading] = React.useState<boolean>(true);
	const [userHasPermissions, setUserHasPermissions] = React.useState<boolean>(false);

	const createListTasks: string[] = [
		strings.TASK_CREATE_LIST,
		strings.TASK_ADD_FIELDS,
		strings.TASK_CREATE_LIST_VIEW,
		strings.TASK_UPDATE_SECURITY,
		strings.TASK_ALL_DONE,
	];

	//
	// component mount --------------------------------------------------------

	React.useEffect(() => {
		// mount component

		async function _getUserPermissions(): Promise<boolean> {
			// get user permission to manage (create) lists
			return await sp.web.currentUserHasPermissions(PermissionKind.ManageLists);
		}

		// set state
		_getUserPermissions().then((_hasPermission: boolean) => {
			// set permission
			setUserHasPermissions(_hasPermission);
			// set loading > trigger update panel contents
			setIsLoading(false);
		});
		// unmount component
		// ..
	}, []);

	//
	// helper functions -------------------------------------------------------

	async function _createList() {
		// create the list > see task list for strategy

		// create the list

		setUpdateProgress({
			counter: 1,
		});

		const listAddResult = await sp.web.lists.add(
			FEEDBACKLIST,
			strings.FEEDBACK_LIST_DESCRIPTION,
			100,
			false,
			{ OnQuickLaunch: false }
		);

		setUpdateProgress({
			counter: 2,
		});

		// add fields to the list

		if (listAddResult) {
			// get list
			const _list = listAddResult.list;

			// add fields
			await _list.fields.addMultilineText('Body', 15);
			await _list.fields.addUrl('SiteUrl', UrlFieldFormatType.Hyperlink);
			await _list.fields.addUrl('PageUrl', UrlFieldFormatType.Hyperlink);
			await _list.fields.addChoice('Category', ['Other'], ChoiceFieldFormatType.Dropdown);
			await _list.fields.addChoice(
				'Status',
				['New', 'In Progress', 'Closed'],
				ChoiceFieldFormatType.Dropdown
			);

			setUpdateProgress({
				counter: 3,
			});

			await _list.defaultView.fields.add('Body');
			await _list.defaultView.fields.add('SiteUrl');
			await _list.defaultView.fields.add('PageUrl');
			await _list.defaultView.fields.add('Category');
			await _list.defaultView.fields.add('Status');
			await _list.defaultView.fields.add('Created');
			await _list.defaultView.fields.add('Author');

			// add order by created date desc > newest on top
			_list.defaultView.fields.orderBy('Created', true);

			setUpdateProgress({
				counter: 99,
			});
		}
	}

	const _setTaskList = (): JSX.Element => {
		return (
			<>
				{createListTasks.map((_task: string, index: number) => {
					// check doing / done = spinner / checkmark
					if (index < updateProgress.counter) {
						// done
						return (
							<div style={{ margin: '5px 0px' }}>
								<Icon iconName='CheckMark' style={{ marginRight: '5px' }} />
								{_task}
							</div>
						);
					} else {
						// doing
						return (
							<div style={{ margin: '5px 0px' }}>
								<Icon iconName='CheckBox' style={{ marginRight: '5px' }} />
								{_task}
							</div>
						);
					}
				})}
			</>
		);
	};

	//
	// component render -------------------------------------------------------

	if (isLoading) {
		// loading state > return nothing, checking permissions
		return null;
	}

	if (!userHasPermissions) {
		// current user has no permissions to create the list
		return (
			<div className={styles.FormContainer}>
				<Text variant='medium'>
					{strings.CREATE_LIST_ERROR_NOPERMISSIONS}
				</Text>
				<DefaultButton
					text={strings.COMMON_LABEL_CLOSE}
					styles={{ root: { width: '150px' } }}
					onClick={props.onDismissPanel}
				/>
			</div>
		);
	}

	return (
		<div className={styles.FormContainer}>
			<Text variant='medium'>
				{strings.CREATE_LIST_SUBTITLE}
			</Text>
			{updateProgress.counter === 0 && (
				<DefaultButton
					text={strings.COMMON_LABEL_CREATE_LIST}
					styles={{ root: { width: '150px' } }}
					disabled={updateProgress.counter > 0}
					onClick={_createList}
				/>
			)}
			{updateProgress.counter > 0 && _setTaskList()}
			{updateProgress.counter === 99 && (
				<>
					<Text variant='medium'>
						{strings.CREATE_LIST_LIST_CREATED_MESSAGE}
					</Text>
					<PrimaryButton
						text={strings.COMMON_LABEL_OK}
						styles={{ root: { width: '150px' } }}
						disabled={updateProgress.counter !== 99}
						onClick={props.onDismissPanel}
					/>
				</>
			)}
		</div>
	);
}
