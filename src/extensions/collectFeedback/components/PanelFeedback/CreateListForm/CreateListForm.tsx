import * as React from 'react';

import { sp } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/security/list';
import '@pnp/sp/items';

import { FEEDBACKLIST } from '../fnPanelFeedback';
import { DefaultButton, Icon, PrimaryButton, Text } from 'office-ui-fabric-react';
import { ChoiceFieldFormatType, UrlFieldFormatType } from '@pnp/sp/fields';

import styles from '../css/PanelFeedbackController.module.scss';
import { IRoleAssignment, IRoleAssignmentInfo, PermissionKind } from '@pnp/sp/security';

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
		"Create list 'Feedback'...",
		'Adding fields to list...',
		'Changing default list views...',
		'Setting list security...',
		'All done',
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
			"This list collects feedback from the end users. Use the 'Give Feedback' button on the page, to enter create an entry in this list.",
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
								<Icon
									iconName='CheckMark'
									style={{ marginRight: '5px' }}
								/>
								{_task}
							</div>
						);
					} else {
						// doing
						return (
							<div style={{ margin: '5px 0px' }}>
								<Icon
									iconName='CheckBox'
									style={{ marginRight: '5px' }}
								/>
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
					Oeps, the feedback list does not exist and it seems that you do not
					have enough permissions to create the list. Please contact support for
					more information. You are currently not able to provide us with
					feedback. Sorry for the inconvenience.
				</Text>
				<DefaultButton
					text='Close'
					styles={{ root: { width: '150px' } }}
					onClick={props.onDismissPanel}
				/>
			</div>
		);
	}

	return (
		<div className={styles.FormContainer}>
			<Text variant='medium'>
				Hmm, it seems that the 'Feedback' list to store the feedback does not
				exists. Click 'Create List' to create the list on this site.
			</Text>
			{updateProgress.counter === 0 && (
				<DefaultButton
					text='Create List'
					styles={{ root: { width: '150px' } }}
					disabled={updateProgress.counter > 0}
					onClick={_createList}
				/>
			)}
			{updateProgress.counter > 0 && _setTaskList()}
			{updateProgress.counter === 99 && (
				<>
					<Text variant='medium'>
						The list has been created for you. You can now use the feedback
						module on this site.
					</Text>
					<PrimaryButton
						text='Ok'
						styles={{ root: { width: '150px' } }}
						disabled={updateProgress.counter !== 99}
						onClick={props.onDismissPanel}
					/>
				</>
			)}
		</div>
	);
}
