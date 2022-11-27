export type TYPEPlacement =
	| 'topLeft'
	| 'topRight'
	| 'rightTop'
	| 'rightBottom'
	| 'bottomRight'
	| 'bottomLeft'
	| 'leftBottom'
	| 'leftTop';

/**
 * @interface IExtensionOptions
 * @property listId Id of Feedback list, added in V4 for local/global feedback list usage
 * @property defaultText Text to display on the button
 * @property placement Top | Right | Bottom | Left + Top | Bottom OR Left | Right
 * @property useHoverEffect true | false to use hover effect on button
 * @property backgroundColor Color to use on button
 * @property textColor text and icon color (adjust together with propery backgroundColor)
 */
export default interface IExtensionOptions {
	listId: string;
	defaultText: string;
	disableHover: boolean;
	backgroundColor: string;
	textColor: string;
	placement: TYPEPlacement;
	noCache: boolean;
	disableFeedbackButton: boolean;
}
