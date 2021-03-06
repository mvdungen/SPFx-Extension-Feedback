import * as React from 'react';

import { ensureFeedbackListExists, getValuesInformation } from './fnPanelFeedback';
import CreateListForm from './CreateListForm/CreateListForm';
import FeedbackForm from './FeedbackForm/FeedbackForm';

import { Panel, PanelType } from 'office-ui-fabric-react';

import * as strings from 'CollectFeedbackApplicationCustomizerStrings';
import styles from './css/PanelFeedbackController.module.scss';

export interface IPanelFeedbackControllerProps {
	context: any;
	isOpen: boolean;
	onDismissPanel: () => void;
}
export interface IPanelFeedbackControllerState {}

export default function PanelFeedbackController(props: IPanelFeedbackControllerProps) {
	//
	// state and initialisation

	const [isOpen, setIsOpen] = React.useState<boolean>(props.isOpen);
	const [isLoading, setIsLoading] = React.useState<boolean>(true);

	const [isListPresent, setListPresent] = React.useState<boolean>(false);

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

	//
	// helper functions -------------------------------------------------------

	function _onDismissPanel() {
		// close panel > handling done in child component
		if (typeof props.onDismissPanel === 'function') {
			props.onDismissPanel();
		}
	}

	//
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
			closeButtonAriaLabel='Close'>
			<div className={styles.FeedbackPanel}>
				{/* panel content */}
				{isListPresent ? (
					<FeedbackForm context={props.context} onDismissPanel={_onDismissPanel} />
				) : (
					<CreateListForm onDismissPanel={_onDismissPanel} />
				)}
			</div>
		</Panel>
	);
}
