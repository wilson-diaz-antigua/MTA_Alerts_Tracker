import { JSX, useContext } from 'react';
import stopNames from '../../util/stopNames.json';
import object from '../../util/subwayLineColors.json';
import { AccordionContext } from '../pages/mtaTracker';
import { ensureArray } from '../utils/arrayUtils';
import AlertDetails from './AlertDetails';
import ExpandedAlertContent from './ExpandedAlertContent';
import ServiceList from './ServiceList';

/**
 * TimelineItem component displays a station with its alerts in a timeline format
 */

interface TimelineItemProps {
	index?: number;
	stop?: string | object | any;
	alerts?: {
		service?: string | string[];
		type?: string | string[];
		heading?: string | string[];
	};
	className?: object;
	filtLines?: string;
	customIcon?: React.ReactNode;
	customTitle?: string;
	isSpecial?: boolean;
}
const COLORS = {
	TRAIN_COLORS: 'bg-MTAred bg-MTAgreen bg-MTAmagenta bg-MTAblue bg-MTAorange',
	DOT_COLORS:
		'text-MTAred" text-MTAgreen text-MTAmagenta text-MTAblue text-MTAorange',
	BEFORE_COLORS:
		'before:bg-MTAred before:bg-MTAgreen before:bg-MTAmagenta before:bg-MTAblue',
};
const TimelineItem = ({
	index,
	stop,
	alerts,
	className,
	filtLines,
	customIcon,
	customTitle,
	isSpecial,
}: TimelineItemProps): JSX.Element | null => {
	const context = useContext(AccordionContext)
	const { accordionOpen, setAccordionOpen } = context;
	COLORS

	const stationIcon = <div className='icon'>
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
				strokeWidth='13'
				fill='none'
			/>
		</svg>
	</div>


	const moreStationsIcon = <div className={`icon h-[70px] w-[30px] bg-zinc-900 fill-current pt-2 
		${object.dottedColors[filtLines]}`}>



		<svg
			viewBox='0 0 50 150'
			width='20'
			height='60'
			xmlns='http://www.w3.org/2000/svg'
		>
			<ellipse cx='25' cy='20' rx='10' ry='10' />
			<ellipse cx='25' cy='60' rx='10' ry='10' />
			<ellipse cx='25' cy='100' rx='10' ry='10' />
		</svg>
	</div>
	// Handle special items differently
	if (isSpecial) {
		return (
			<div className={`content mb-10`}>
				<div className='timelineItem'>
					{moreStationsIcon}

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
	// @ts-ignore
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
			// @ts-ignore
			setAccordionOpen(isOpen ? null : index);
		}
	};

	return (
		<div className={`content ${accordionOpen ? 'mb-0' : 'mb-0 '}`}>
			<div className='timelineItem  '>
				{stationIcon}
				<ServiceList services={alertServices} classNames={className || {}} />
			</div>

			<div onClick={toggleAccordion} className='mt-0 pt-4 cursor-pointer'>
				<button
					className={`self-start font-bold text-slate-50 mt-2 ${isOpen
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



export default TimelineItem;
