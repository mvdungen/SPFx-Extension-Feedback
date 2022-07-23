import { TYPEPlacement } from './IExtensionOptions';

/**
 * @function getPlacementStyle
 * @description Returns CSS styling based on the placement of de feedback button
 * @param placement Where to place the feedback button
 * @param disableHover Disable hover effect, true/false
 * @returns
 */
export function getPlacementStyle(
	placement: TYPEPlacement,
	disableHover: boolean
): React.CSSProperties {
	// set return defaults
	let _cssProps: React.CSSProperties = {},
		_buttonOffset: string = disableHover ? '0px' : '-30px';

	switch (placement) {
		case 'topLeft': // -------------------------------------- top
			_cssProps = {
				left: '100px',
				top: _buttonOffset,
				borderRadius: '0px 0px 5px 5px',
				transition: 'top ease-in-out 0.4s',
			};
			break;
		case 'topRight':
			_cssProps = {
				right: '100px',
				top: _buttonOffset,
				borderRadius: '0px 0px 5px 5px',
				transition: 'top ease-in-out 0.4s',
			};
			break;

		case 'bottomLeft': // ----------------------------------- bottom ( = default)
			_cssProps = {
				left: '100px',
				bottom: _buttonOffset,
				borderRadius: '5px 5px 0px 0px',
				transition: 'bottom ease-in-out 0.4s',
			};
			break;
		case 'bottomRight': // = default
		default:
			_cssProps = {
				right: '100px',
				bottom: _buttonOffset,
				borderRadius: '5px 5px 0px 0px',
				transition: 'bottom ease-in-out 0.4s',
			};
	}

    // TODO: placement of button + styling...
    
	// return CSS for this placement
	return {
		right: '100px',
		borderRadius: '5px 5px 0px 0px',
		transition: 'bottom ease-in-out 0.4s',
	};
}
