import * as React from 'react';

import FeedbackButton from './FeedbackButton';

import styles from './css/FeedbackController.module.scss';

export interface IFeedbackControllerProps {
	context: any;
}
export interface IFeedbackControllerState {}

export default function FeedbackController(props: IFeedbackControllerProps) {
	//
	// component render -------------------------------------------------------

	return (
		<div className={styles.FeedbackController}>
			<FeedbackButton context={props.context}/>
		</div>
	);
}
