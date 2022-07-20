import * as React from 'react';

import IExtProperties from '../../IExtProperties';
import FeedbackButton from './FeedbackButton';

import styles from './css/FeedbackController.module.scss';
import '../../css/globalvars.css';

export interface IFeedbackControllerProps {
	context: any;
	extensionProperties: IExtProperties;
}
export interface IFeedbackControllerState {}

export default function FeedbackController(props: IFeedbackControllerProps) {
	//
	// set global css vars depening on extension properties
	const _root: any = document.querySelector(':root');

	if (_root) {
		// fore and background color
		_root.style.setProperty(
			'--buttonBgColor',
			props.extensionProperties.backgroundColor || '#1e3c82'
		);
		_root.style.setProperty(
			'--buttonTextColor',
			props.extensionProperties.textColor || '#ffffff'
		);

		// hover effect
		_root.style.setProperty(
			'--buttonOffset',
			props.extensionProperties.useHoverEffect ? '-30px' : '0px'
		);
	}

	// component render -------------------------------------------------------

	return (
		<div className={styles.FeedbackController}>
			<FeedbackButton {...props} />
		</div>
	);
}
