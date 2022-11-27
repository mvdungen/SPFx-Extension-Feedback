import IExtensionOptions from './IExtensionOptions';

import { sp } from '@pnp/sp';
import { IContextInfo } from '@pnp/sp/sites';
import '@pnp/sp/webs';

import * as strings from 'CollectFeedbackApplicationCustomizerStrings';
import { IFolder, IFolderAddResult } from '@pnp/sp/folders';

const STORAGE_KEY: string = 'CollectFeedback';

/**
 * @function getDefaultExtensionOptions
 * @param options Partial object containing overwrite for default settings
 * @returns object of type IExtensionOptions containing default settings
 */
export function getDefaultExtensionOptions(options: Partial<IExtensionOptions> | undefined): IExtensionOptions {
	// set default options
	let _returnOptions: IExtensionOptions = {
		listId: '',
		defaultText: strings.FEEDBACKBUTTON_LABEL,
		disableHover: false,
		backgroundColor: '#1e3c82',
		textColor: '#ffffff',
		placement: 'bottomRight',
		noCache: false,
		disableFeedbackButton: false,
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
 * @returns object containing either the default options or the site assets/global options
 */
export async function fetchExtensionOptions(): Promise<IExtensionOptions> {
	// get site information
	const _siteCtx: IContextInfo = await sp.site.getContextInfo();
	// get site url
	const _siteUrl: string = _siteCtx.WebFullUrl;
	// set option file to retrieve
	const _optionFile: string = `${_siteUrl}/siteassets/feedback/feedback.json`;

	let _results: IExtensionOptions = undefined;

	// get from storage
	let _storage: IExtensionOptions | null = null;

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

	// merge json settings if available with default settings
	_results = getDefaultExtensionOptions(_results);

	// return results
	return _results;
}

/**
 * @function createFeedbackJsonFile
 * @description Creates the initial JSON file with extension settings
 * @returns true if file creaion is successfull, false if errored
 */
export async function createFeedbackJsonFile(fileContent: string): Promise<boolean> {
	// get site information
	const _siteCtx: IContextInfo = await sp.site.getContextInfo();
	// get site url
	const _siteUrl: string = _siteCtx.WebFullUrl;
	// set option file to retrieve
	const _optionFileFolder: string = `${_siteUrl.replace(window.location.origin, '')}/SiteAssets/Feedback`;
	const _optionFile: string = `feedback.json`;

	let _result: boolean = true;

	try {
		// TODO - Check if folder exists, if exists, do not create it...

		// create the feedback folder
		const _folder: IFolderAddResult = await sp.web.folders.addUsingPath(_optionFileFolder);
		// create the file
		if (_folder && _folder.data.Exists) {
			const _file = await sp.web
				.getFolderByServerRelativePath(_optionFileFolder)
				.files.add(_optionFile, fileContent, true);
		} else {
			// folder creation failed > set result
			_result = false;
		}
	} catch (error) {
		// file creation failed
		_result = false;
	}

	// return success
	return _result;
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
