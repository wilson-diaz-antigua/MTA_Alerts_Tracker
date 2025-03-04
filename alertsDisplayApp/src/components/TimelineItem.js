import PropTypes from 'prop-types';
import { useContext } from 'react';
import stopNames from '../../util/stopNames.json';
// Fix imports - separate the AccordionContext and ensureArray imports
import { AccordionContext } from '../pages/mtaTracker.tsx';
import { ensureArray } from '../utils/arrayUtils';
import AlertDetails from './AlertDetails';
import ExpandedAlertContent from './ExpandedAlertContent';
import ServiceList from './ServiceList';
import StationIcon from './StationIcon';

/**
 * TimelineItem component displays a station with its alerts in a timeline format
 */
const TimelineItem = ({
	index = 0,
	stop = null,
	alerts = { service: [], type: [], heading: [] } || {},
	className = {},
	filtLines = '',
	customIcon = null,
	customTitle = '',
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
					<button className='self-start font-bold text-slate-50 mt-10'>
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
		<div className={`content ${accordionOpen ? 'mb-0' : 'mb-0 '}`}>
			<div className='timelineItem  '>
				<StationIcon custom={customIcon} />
				<ServiceList services={alertServices} classNames={className || {}} />
			</div>

			<div onClick={toggleAccordion} className='mt-0 pt-4 cursor-pointer'>
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

export default TimelineItem;
