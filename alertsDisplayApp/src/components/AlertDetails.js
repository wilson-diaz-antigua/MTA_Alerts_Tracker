import PropTypes from 'prop-types';
import { ensureArray } from '../pages/mtaTracker.tsx';

/**
 * Alert details component that shows when timeline item is collapsed
 * @param {Object} props Component props
 * @param {boolean} props.isOpen Whether the parent accordion is open
 * @param {Array|string} props.alertTypes Alert types to display
 * @returns {JSX.Element|null} Alert details or null if no alert types
 */
const AlertDetails = ({ isOpen, alertTypes }) => {
	const alertTypesArray = ensureArray(alertTypes);

	if (alertTypesArray.length === 0) return null;

	return (
		<div
			className={`grid transition-all duration-300 ease-in-out text-slate-600 text-sm ${
				!isOpen
					? 'grid-rows-[1fr] opacity-100'
					: 'grid-rows-[0fr] opacity-0 overflow-hidden'
			}`}
		>
			<div className='overflow-hidden'>
				{alertTypesArray.map((alertType, index) => (
					<ul key={`alertType-${index}`}>{alertType}</ul>
				))}
			</div>
		</div>
	);
};

AlertDetails.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	alertTypes: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
};

AlertDetails.defaultProps = {
	alertTypes: [],
};

export default AlertDetails;
