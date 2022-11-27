import * as React from 'react';

import IExtensionOptions from './IExtensionOptions';
import { getPlacementStyle } from './fnFeedbackButton';
import PanelFeedbackController from '../PanelFeedback/PanelFeedbackController';

import { Icon, Text } from 'office-ui-fabric-react';

import styles from './css/FeedbackController.module.scss';

export interface IFeedbackButtonProps {
	context: any;
	options: IExtensionOptions;
}
export interface IFeedbackButtonState {
	isFeedbackPanelOpen: boolean;
}

export default function FeedbackButton(props: IFeedbackButtonProps) {
	//
	// state and initialisation

	const [stateFeedback, setStateFeedback] = React.useState<IFeedbackButtonState>({
		isFeedbackPanelOpen: false,
	});
	const buttonRef = React.useRef<HTMLDivElement | null>(null);

	// NB: use loading state for initial loading; component loads after the page is loaded AND after
	//	   css is loaded which results in a glitch in the page showing the unformatted label in the
	//	   upper left corner of the document followed by the formatted button in the lower right corner.
	//	   Using the loading state (and returning null when loading) prevents the glitch...
	const [isLoading, setIsLoading] = React.useState<boolean>(true);

	const _feedbackText: string = props.options.defaultText;
	const _cssProps: React.CSSProperties = getPlacementStyle(
		props.options.placement,
		props.options.disableHover
	);
	const _disableFeedbackButton: boolean = props.options.disableFeedbackButton;

	//
	// component mount --------------------------------------------------------

	React.useEffect(() => {
		// mount component
		setIsLoading(false);
	}, []);

	//
	// helper functions -------------------------------------------------------

	function _toggleFeedbackPanel() {
		setStateFeedback({
			isFeedbackPanelOpen: !stateFeedback.isFeedbackPanelOpen,
		});
	}

	function _onDismissPanel() {
		// close panel
		_toggleFeedbackPanel();
	}

	//
	// component render -------------------------------------------------------

	if (isLoading || _disableFeedbackButton) {
		// loading state OR button completely disabled > return nothing
		return null;
	}

	return (
		<>
			{/* feedback button */}

			<div
				ref={buttonRef}
				className={styles.FeedbackButton}
				onClick={_toggleFeedbackPanel}
				style={_cssProps}>
				<Text variant='mediumPlus' className={styles.FeedbackTextContainer}>
					<Icon iconName='Feedback' className={styles.FeedbackIcon} />
					<span className={styles.FeedbackText}>{_feedbackText}</span>
				</Text>
			</div>

			{/* collect feedback panel */}

			<PanelFeedbackController
				context={props.context}
				isOpen={stateFeedback.isFeedbackPanelOpen}
				options={props.options}
				onDismissPanel={_onDismissPanel}
			/>
		</>
	);
}
