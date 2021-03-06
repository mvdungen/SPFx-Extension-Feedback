import { sp } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import { IContextInfo } from '@pnp/sp/sites';
import { IFieldInfo, IField } from '@pnp/sp/fields';

import IFeedbackValuesRef from './IFeedbackValuesRef';

export const FEEDBACKLIST: string = 'Feedback';

/**
 * @function getValuesInformation
 * @description get site and page information from document and window objects
 * @returns default feedback information with site/page info
 */
export async function getValuesInformation(): Promise<Partial<IFeedbackValuesRef>> {
	// get site information
	const _siteCtx: IContextInfo = await sp.site.getContextInfo();

	// create info
	const _feedbackInfo: Partial<IFeedbackValuesRef> = {
		siteUrl: _siteCtx.WebFullUrl,
		siteTitle: document.title,
		pageUrl: window.location.href,
		pageTitle: document.title,
	};
	return _feedbackInfo;
}

/**
 * @function getCategoryChoices
 * @description Retrieves category field from feedback list and returns an array of all choices
 * @returns Array containing all choices from Category field
 */
export async function getCategoryChoices(): Promise<string[]> {
	// initialize
	let _resultChoices: string[] = [];
	// retrieve the field from the feedback list
	let _fld: IField = await sp.web.lists
		.getByTitle(FEEDBACKLIST)
		.fields.getByInternalNameOrTitle('Category')();
	// set choices
	_resultChoices = await _fld['Choices'] as string[];
	// return results
	return _resultChoices;
}

/**
 * @function ensureFeedbackListExists
 * @description ensures that the feedback list exists on the site
 * @returns TRUE if feedback list exist, otherwise FALSE
 */
export async function ensureFeedbackListExists(): Promise<boolean> {
	// get list info > nb: tried sp.web.lists.ensure('...') but it didn't work... Now we just get an
	// item from the list, if it fails it just returns false and we 'assume' the list does not exist
	const _exists: boolean = await sp.web.lists
		.getByTitle(FEEDBACKLIST)
		.items.top(1)
		.get()
		.then(() => true)
		.catch(() => false);
	// return the result
	return _exists;
}

/**
 * @function
 * @description Saves all information to SPO list and return TRUE if succeeded
 * @param values All feedback information in one object of type IFeedbackValuesRef
 */
export async function saveFeedback(values: IFeedbackValuesRef): Promise<boolean> {
	// save item
	return await sp.web.lists
		.getByTitle(FEEDBACKLIST)
		.items.add({
			Title: values.pageTitle,
			Body: values.feedbackBody,
			SiteUrl: {
				Url: values.siteUrl,
				Description: values.siteTitle,
			},
			PageUrl: {
				Url: values.pageUrl,
				Description: values.pageTitle,
			},
			Category: values.Category,
			Status: 'New',
		})
		.then(() => true)
		.catch(err => false);
}
