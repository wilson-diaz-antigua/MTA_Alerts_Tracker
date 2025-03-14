import PropTypes from 'prop-types';

/**
 * End Marker Component for the timeline display
 * @param {Object} props - Component props
 * @param {string} props.linecolors - The line color key to use for styling
 * @param {Object} props.objects - Object containing color mappings
 * @returns {JSX.Element} End marker component
 */
const EndMarker = ({ linecolors, objects }) => (
	<div className='timelineItem '>
		<div
			className={` icon fill-current text-zinc-900 ${
				objects?.lineColors?.[linecolors] || ''
			}`}
		>
			<svg
				height={50}
				width={60}
				xmlns='http://www.w3.org/2000/svg'
				viewBox='10 0 40 40'
			>
				<rect width='60' height='20' x='0' y='0' rx='0' ry='0' />
			</svg>
		</div>
		<button className='rightSide'>
			<span className='self-start font-bold text-slate-50'></span>
		</button>
	</div>
);

EndMarker.propTypes = {
	linecolors: PropTypes.string.isRequired,
	objects: PropTypes.object.isRequired,
};

export default EndMarker;
