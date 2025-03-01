import PropTypes from 'prop-types';
import { useContext } from 'react';
import stopNames from '../../util/stopNames.json';
import { AccordionContext } from '../pages/mtaTracker.js';
import ServiceList from './ServiceList';

/**
 * Ensures a value is treated as an array
 * @param {any} value - The value to ensure is an array
 * @returns {Array} The value as an array
 */
const ensureArray = (value) => {
	if (value === undefined || value === null) return [];
	return Array.isArray(value) ? value : [value];
};

// Station icon component
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

// Alert details component
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

// Expanded alert component
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

const TimelineItem = ({
	index,
	stop,
	alerts,
	className,
	filtLines,
	customIcon,
	customTitle,
	isSpecial = false,
}) => {
	// Fix context usage with fallback values
	const context = useContext(AccordionContext) || {
		accordionOpen: true,
		setAccordionOpen: () => {},
	};
	const { accordionOpen, setAccordionOpen } = context;

	// Handle special items differently
	if (isSpecial) {
		return (
			<div className={`content mb-10`}>
				<div className='timelineItem'>
					<StationIcon custom={customIcon} />
					<ServiceList
						services={alerts?.service || []}
						classNames={className || {}}
					/>
				</div>
				<div className='mt-0'>
					<button className='self-start font-bold text-slate-50 mt-2 '>
						<span>{customTitle || 'Special Item'}</span>
					</button>
					{alerts?.type && (
						<div className='text-sm text-slate-600'>
							{ensureArray(alerts.type).map((type, i) => (
								<div key={i}>{type}</div>
							))}
						</div>
					)}
				</div>
			</div>
		);
	}

	// Handle standard timeline items
	if (!stop || (!stop.alert && !stop.alerts)) {
		return null;
	}

	const stopAlert = stop.alert || stop.alerts || [];
	const isOpen = accordionOpen === index;

	// Process alerts data consistently
	const alertData = ensureArray(stopAlert);

	// Get unique alerts by heading
	const uniqueAlerts = [
		...new Map(alertData.map((item) => [item?.heading || '', item])).values(),
	].filter(Boolean);

	// Get station name
	const stopId = typeof stop === 'object' ? stop.stop : stop;
	const stationName =
		customTitle || stopNames[stopId]?.stop_name || 'Unknown Station';

	// Process alerts data
	const alertServices = ensureArray(alerts?.service || []);
	const alertTypes = ensureArray(alerts?.type || []);

	const toggleAccordion = () => {
		// Only call setAccordionOpen if it exists
		if (typeof setAccordionOpen === 'function') {
			setAccordionOpen(isOpen ? null : index);
		}
	};

	return (
		<div className={`content ${accordionOpen ? 'mb-0' : 'mb-10'}`}>
			<div className='timelineItem'>
				<StationIcon custom={customIcon} />
				<ServiceList services={alertServices} classNames={className || {}} />
			</div>

			<div onClick={toggleAccordion} className='mt-0 cursor-pointer'>
				<button
					className={`self-start font-bold text-slate-50 mt-2 ${
						isOpen
							? "ml-2 inline-block bg-slate-50 text-slate-900 rounded-e-md relative px-2 before:content-[''] before:absolute before:h-0 before:w-0 before:top-[0px] before:left-[-24px] before:border-[12px] before:border-r-slate-50 before:border-l-transparent before:border-y-transparent border-solid"
							: ''
					}`}
				>
					<span>{stationName}</span>
				</button>

				<AlertDetails isOpen={isOpen} alertTypes={alertTypes} />
				<ExpandedAlertContent isOpen={isOpen} alertItems={uniqueAlerts} />
			</div>
		</div>
	);
};

TimelineItem.propTypes = {
	index: PropTypes.number,
	stop: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
	alerts: PropTypes.shape({
		service: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
		type: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
		heading: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
	}),
	className: PropTypes.object,
	filtLines: PropTypes.string,
	customIcon: PropTypes.node,
	customTitle: PropTypes.string,
	isSpecial: PropTypes.bool,
};

TimelineItem.defaultProps = {
	alerts: { service: [], type: [], heading: [] },
	className: {},
	isSpecial: false,
};

export default TimelineItem;
