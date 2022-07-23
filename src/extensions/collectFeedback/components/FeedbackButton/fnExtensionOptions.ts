import IExtensionOptions from './IExtensionOptions';

import { sp } from '@pnp/sp';
import { IContextInfo } from '@pnp/sp/sites';
import '@pnp/sp/webs';

import * as strings from 'CollectFeedbackApplicationCustomizerStrings';

const STORAGE_KEY: string = 'CollectFeedback';

/**
 * @function getDefaultExtensionOptions
 * @param options Partial object containing overwrite for default settings
 * @returns object of type IExtensionOptions containing default settings
 */
export function getDefaultExtensionOptions(
	options: Partial<IExtensionOptions> | undefined
): IExtensionOptions {
	// set default options
	let _returnOptions: IExtensionOptions = {
		defaultText: strings.FEEDBACKBUTTON_LABEL,
		disableHover: false,
		backgroundColor: '#1e3c82',
		textColor: '#ffffff',
		placement: 'bottomRight',
		noCache: false,
		disableFeedbackButton: false
	};
	// add options if applicable
	if (options) {
		_returnOptions = {
			..._returnOptions,
			...options,
		};
	}
	// return optios
	return _returnOptions;
}

/**
 * @function fetchExtensionOptions
 * @description fetches the options Site Assets JSON file, when not found returns the default options
 * @returns object containing either the default options or the site assets options
 */
export async function fetchExtensionOptions(): Promise<IExtensionOptions> {
	// get site information
	const _siteCtx: IContextInfo = await sp.site.getContextInfo();
	// get site url
	const _siteUrl: string = _siteCtx.WebFullUrl;
	// set option file to retrieve
	const _optionFile: string = `${_siteUrl}/siteassets/feedback/feedback.json`;

	let _results: IExtensionOptions = undefined;
	let _retrievedFromStorage: boolean = false;

	// get from storage
	let _storage: IExtensionOptions | null = _retrieveSettings();

	if (_storage) {
		// settings from storage > set results and do not fetch
		_results = _storage;
		_retrievedFromStorage = true;
	} else {
		try {
			// retrieve file
			const _file = sp.web.getFileByUrl(_optionFile);

			if (_file) {
				// retrieve file contents
				_results = await _file.getJSON();
			}
		} catch (error) {
			// file not found > retrieve default options
		}
	}

	// merge json settings if available with default settings
	_results = getDefaultExtensionOptions(_results);

	if (!_retrievedFromStorage) {
		// store to session storage
		_storeSettings(_results);
	}

	// return results
	return _results;
}

/**
 * @function setGlobalCSSFromOptions
 * @description Set global css vars depening on extension options
 * @param options Extension options
 */
export function setGlobalCSSFromOptions(options: IExtensionOptions): void {
	//
	const _root: any = document.querySelector(':root');

	if (_root) {
		// fore and background color
		_root.style.setProperty('--buttonBgColor', options.backgroundColor);
		_root.style.setProperty('--buttonTextColor', options.textColor);
		// hover effect
		_root.style.setProperty('--buttonOffset', options.disableHover ? '0px' : '-30px');
	}
}

// local helper functions

/**
 * @function _retrieveSettings
 * @description Retrieves settings from session storage
 * @returns extension options or null if no settings found in session storage
 */
function _retrieveSettings(): IExtensionOptions | null {
	// set default return
	let _returnOptions: IExtensionOptions | null = null;
	// get storage
	let _storage: string | null = window.sessionStorage.getItem(STORAGE_KEY);
	// check
	if (_storage) {
		// convert to json
		_returnOptions = JSON.parse(_storage);
	}
	// return results
	return _returnOptions;
}

/**
 * @function _storeSettings
 * @description Store settings in session storage
 * @param options extension options to store in session storage
 */
function _storeSettings(options: IExtensionOptions): void {
	// get settings
	const _settings: string = JSON.stringify(options);
	// check the no cache option
	if (options.noCache) {
		// do nothing
	} else {
		// store options
		window.sessionStorage.setItem(STORAGE_KEY, _settings);
	}
}
