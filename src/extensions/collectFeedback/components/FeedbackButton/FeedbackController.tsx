import * as React from 'react';

import IExtensionOptions from './IExtensionOptions';
import FeedbackButton from './FeedbackButton';
import { fetchExtensionOptions, setGlobalCSSFromOptions } from './fnExtensionOptions';

import styles from './css/FeedbackController.module.scss';
import '../../css/globalvars.css';

export interface IFeedbackControllerProps {
	context: any;
}
export interface IFeedbackControllerState {}

export default function FeedbackController(props: IFeedbackControllerProps) {
	//
	const [isLoading, setIsLoading] = React.useState<boolean>(true);
	const refOptions = React.useRef<IExtensionOptions | null>(null);

	// mount controller

	React.useEffect(() => {
		//
		async function _getExtentionOptions(): Promise<void> {
			// fetch local settings from site assets
			await fetchExtensionOptions().then((_options: IExtensionOptions) => {
				// set options
				setGlobalCSSFromOptions(_options);
				// save reference to pass to child components
				refOptions.current = _options;
				// load button
				setIsLoading(false);
			});
		}
		// retrieve settings
		_getExtentionOptions();
	}, []);

	// component render -------------------------------------------------------

	if (isLoading) {
		// fetching options > do nothing
		return null;
	}

	return (
		<div className={styles.FeedbackController}>
			<FeedbackButton context={props.context} options={refOptions.current} />
		</div>
	);
}
