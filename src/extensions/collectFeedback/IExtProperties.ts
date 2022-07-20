/**
 * @interface IEXTProperties
 * @property defaultText Text to display on the button
 * @property placement Top | Right | Bottom | Left + Top | Bottom OR Left | Right
 * @property useHoverEffect true | false to use hover effect on button
 * @property backgroundColor Color to use on button
 * @property textColor text and icon color (adjust together with propery backgroundColor)
 */
export default interface IExtProperties {
	defaultText: string;
	useHoverEffect: boolean;
	backgroundColor: string;
	textColor: string;
	placement:
		| 'topLeft'
		| 'topRight'
		| 'rightTop'
		| 'rightBottom'
		| 'bottomRight'
		| 'bottomLeft'
		| 'leftBottom'
		| 'leftTop';
}
