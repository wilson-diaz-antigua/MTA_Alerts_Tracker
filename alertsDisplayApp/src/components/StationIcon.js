import PropTypes from 'prop-types';

/**
 * Station icon component for timeline displays
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.custom - Custom icon to display instead of default
 * @returns {JSX.Element} Station icon
 */
const StationIcon = ({ custom }) => {
	if (custom) {
		return custom;
	}

	return (
		<div className='icon'>
			<svg
				height={40}
				width={40}
				xmlns='http://www.w3.org/2000/svg'
				viewBox='0 0 40 40'
			>
				<circle
					className='fill-current text-slate-50 stroke-zinc-900'
					cx='20'
					cy='20'
					r='15'
					strokeWidth='12'
					fill='none'
				/>
			</svg>
		</div>
	);
};

StationIcon.propTypes = {
	custom: PropTypes.node,
};

export default StationIcon;
