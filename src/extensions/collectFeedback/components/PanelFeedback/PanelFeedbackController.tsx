import * as React from 'react';

import IExtensionOptions from '../FeedbackButton/IExtensionOptions';
import CreateListForm from './CreateListForm/CreateListForm';
import PnPFeedbackForm from './FeedbackForm/PnPFeedbackForm';
import { Panel, PanelType, ActionButton } from '@fluentui/react';

// TODO - Remove unused code, changed in V4

import { ensureFeedbackListExists, getValuesInformation } from './fnPanelFeedback';
import FeedbackForm from './FeedbackForm/FeedbackForm';

import * as strings from 'CollectFeedbackApplicationCustomizerStrings';
import styles from './css/PanelFeedbackController.module.scss';
import SettingsForm from './SettingsForm/SettingsForm';

export interface IPanelFeedbackControllerProps {
	context: any;
	isOpen: boolean;
	options: IExtensionOptions;
	onDismissPanel: () => void;
}
export interface IPanelFeedbackControllerState {}

export default function PanelFeedbackController(props: IPanelFeedbackControllerProps) {
	//
	// state and initialisation

	const [isOpen, setIsOpen] = React.useState<boolean>(props.isOpen);
	const [isLoading, setIsLoading] = React.useState<boolean>(true);

	const [isListPresent, setListPresent] = React.useState<boolean>(false);
	const [showSettings, setShowSettings] = React.useState<boolean>(false);

	//
	// component mount --------------------------------------------------------

	React.useEffect(() => {
		async function _checkListAndOpenPanel(): Promise<void> {
			await ensureFeedbackListExists().then((_exists: boolean) => {
				// set state
				setListPresent(_exists);
				setIsLoading(false);
				setIsOpen(true);
			});
		}

		if (props.isOpen) {
			// check informtion when panel is open
			_checkListAndOpenPanel();
		} else {
			setIsOpen(false);
		}
	}, [props.isOpen]);

	// helper functions -------------------------------------------------------

	function _onDismissPanel() {
		// close panel > handling done in child component
		if (typeof props.onDismissPanel === 'function') {
			props.onDismissPanel();
		}
	}

	function _toggleSettingsPanel(): void {
		// show or hide
		const _toggle: boolean = showSettings;
		// toggle
		setShowSettings(!_toggle);
	}

	// component helpers ------------------------------------------------------

	const PanelFooter = () => {
		// additional information for site owners
		return (
			<div className={styles.PanelFooterContainer}>
				<ActionButton iconProps={{ iconName: 'Settings' }} onClick={_toggleSettingsPanel}>
					{
						showSettings ? 'Close Settings...' : 'Manage Feedback Extension...'
					}
				</ActionButton>
			</div>
		);
	};

	// component render -------------------------------------------------------

	if (isLoading) {
		// loading state > return nothing
		return null;
	}

	return (
		<Panel
			isOpen={isOpen}
			headerText={strings.PANEL_TITLE}
			type={PanelType.medium}
			onDismiss={_onDismissPanel}
			closeButtonAriaLabel='Close'
			isFooterAtBottom={true}
			onRenderFooter={PanelFooter}>
			<div className={styles.FeedbackPanel}>
				{/* panel content */}
				{showSettings ? (
					<SettingsForm />
				) : isListPresent ? (
					<PnPFeedbackForm context={props.context} options={props.options} onDismissPanel={_onDismissPanel} />
				) : (
					<CreateListForm onDismissPanel={_onDismissPanel} />
				)}
				{/* {isListPresent ? (
					<PnPFeedbackForm context={props.context} options={props.options} onDismissPanel={_onDismissPanel} />
				) : (
					<CreateListForm onDismissPanel={_onDismissPanel} />
				)} */}
			</div>
		</Panel>
	);
}
