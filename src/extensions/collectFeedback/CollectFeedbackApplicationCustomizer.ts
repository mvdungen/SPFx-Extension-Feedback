import { override } from '@microsoft/decorators';
import {
	BaseApplicationCustomizer,
	PlaceholderContent,
	PlaceholderName,
} from '@microsoft/sp-application-base';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { sp } from '@pnp/sp/presets/all';

import FeedbackController from './components/FeedbackButton/FeedbackController';
import IExtProperties from './IExtProperties';

export default class CollectFeedbackApplicationCustomizer extends BaseApplicationCustomizer<IExtProperties> {
	// feedback placeholder
	private _top: PlaceholderContent | undefined;

	@override
	public async onInit(): Promise<void> {
		return super.onInit().then(_ => {
			// initialize pnp js components
			sp.setup({
				spfxContext: this.context,
			});
			// wait for placeholder to be created to reference them
			this.context.placeholderProvider.changedEvent.add(
				this,
				this._renderPlaceHolders
			);
			return Promise.resolve();
		});
	}

	private async _renderPlaceHolders(): Promise<void> {
		if (!this._top) {
			// placeholder not present > create the placeholder
			this._top = this.context.placeholderProvider.tryCreateContent(
				PlaceholderName.Top,
				{ onDispose: this._onDispose }
			);
			// check placeholder
			if (!this._top) {
				// error creating placeholder
				console.log('ERROR: Placeholder could not be found or is empty...!');
				// bail out here
				return;
			}

			if (this._top) {
				// create placeholder feedback button
				const elm = React.createElement(FeedbackController, {
					context: this.context,
					extensionProperties: this.properties
				});
				// show element
				ReactDOM.render(elm, this._top.domElement);
			}
		}
	}

	private _onDispose(): void {
		// not implemented
		console.log('disposed');
	}
}
