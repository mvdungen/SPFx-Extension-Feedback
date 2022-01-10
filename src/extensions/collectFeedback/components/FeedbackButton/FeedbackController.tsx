import * as React from 'react';

import FeedbackButton from './FeedbackButton';

import styles from './css/FeedbackController.module.scss';

export interface IFeedbackControllerProps {
	context: any;
}
export interface IFeedbackControllerState {}

export default function FeedbackController(props: IFeedbackControllerProps) {
	//
	// state and initialisation

	//
	// component mount --------------------------------------------------------

	React.useEffect(() => {
		// mount component
		// ...
		// unmount component
		// ..
	}, []);

	//
	// helper functions -------------------------------------------------------

	//
	// component render -------------------------------------------------------

	return (
		<div className={styles.FeedbackController}>
			<FeedbackButton context={props.context}/>
		</div>
	);
}
