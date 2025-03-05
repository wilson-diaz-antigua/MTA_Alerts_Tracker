import PropTypes from 'prop-types';
import { ensureArray } from '../pages/mtaTracker.tsx';

/**
 * Expanded alert content component that shows when timeline item is open
 * @param {Object} props Component props
 * @param {boolean} props.isOpen Whether the parent accordion is open
 * @param {Array|Object} props.alertItems Alert items to display
 * @returns {JSX.Element|null} Expanded alert content or null if no items
 */
const ExpandedAlertContent = ({ isOpen, alertItems }) => {
	const alertItemsArray = ensureArray(alertItems);

	if (alertItemsArray.length === 0) return null;

	return (
		<div
			className={`grid transition-all duration-300 ease-in-out text-sm ${
				isOpen
					? 'grid-rows-[1fr] opacity-100'
					: 'grid-rows-[0fr] opacity-0 overflow-hidden'
			}`}
		>
			<div className='mt-2 overflow-hidden'>
				{alertItemsArray.map((item, index) => (
					<div key={`alert-${index}`}>
						<div className='text-sm text-slate-300'>
							{item?.alert_type || ''}
						</div>
						<div className='text-sm text-slate-600'>{item?.heading || ''}</div>
					</div>
				))}
			</div>
		</div>
	);
};

ExpandedAlertContent.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	alertItems: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

ExpandedAlertContent.defaultProps = {
	alertItems: [],
};

export default ExpandedAlertContent;
