import axios from 'axios';
import { createContext, useCallback, useEffect, useState } from 'react';
import objects from '../../util/subwayLineColors.json';
import FilteredAlerts from '../components/FilteredAlerts.js';
import TimelineItem from '../components/TimelineItem';
let colors = 'bg-MTAred bg-MTAgreen bg-MTAmagenta bg-MTAblue bg-MTAorange';
let beforecolors =
	'before:bg-MTAred before:bg-MTAgreen before:bg-MTAmagenta before:bg-MTAblue';
// Initialize the context with default values to prevent undefined errors
export const AccordionContext = createContext({
	accordionOpen: null,
	setAccordionOpen: () => {},
});

// Constants
const API_BASE_URL = 'https://backend-production-0687.up.railway.app';
const RETRY_DELAY = 2000;

// Direction terminal mapping
const terminal = {
	Northbound: [
		'Astoria-bound',
		'96 St-bound',
		'Jamaica Center-bound',
		'Jamaica-bound',
		'Northbound',
		'Norwood-bound',
		'Pelham Bay-bound',
		'Queens-bound',
		'Wakefield-bound',
		'Woodlawn-bound',
		'uptown',
		'manhattan-bound',
		'8 Av-bound',
		'Bronx-bound',
	],
	Southbound: [
		'Flushing',
		'Atlantic Av-bound',
		'Brighton Beach-bound',
		'Brooklyn-bound',
		'Church Av-bound',
		'Court Sq-bound',
		'Dyre Av-bound',
		'Forest Hills-bound',
		'Lots Av-bound',
		'Southbound',
		'Tottenville-bound',
		'Trade Center-bound',
		'coney Island-bound',
		'downtown',
		'Flushing-bound',
	],
	'Both Directions': null,
};

/**
 * Custom hook for fetching MTA data
 */
const useMTAData = () => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const checkDatabaseConnection = async () => {
			try {
				const response = await axios.get(`${API_BASE_URL}/stops`);
				return response.status === 200;
			} catch (error) {
				console.error('Error checking database connection:', error);
				return false;
			}
		};

		const fetchData = async () => {
			let isConnected = false;

			while (!isConnected) {
				isConnected = await checkDatabaseConnection();
				if (!isConnected) {
					await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
				}
			}

			try {
				const response = await axios.get(`${API_BASE_URL}/stops`);
				setData(response.data);
			} catch (error) {
				console.error('Error fetching data:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	return { data, loading };
};

/**
 * Filter Controls Component
 */
const FilterControls = ({
	filtLines,
	setFiltLines,
	service,
	setService,
	direction,
	setDirection,
}) => (
	<section className='flex pt-10 ml-[05rem] md:ml-[10rem] lg:ml-[12.5rem]'>
		<div className='w-20 h-20 block'>
			<FilteredAlerts
				data={objects.serviceByLines[filtLines]}
				state={service}
				setState={(e) => setService(e.target.value)}
				className={`[text-align-last:center] pt-2 m-0.5 p-2.5 rounded-full w-full h-full mb-0 text-slate-50 font-bold text-6xl text-center ${objects.lineColors[filtLines]}`}
				value={true}
			/>
		</div>
		<div>
			<div className='ml-5'>
				<FilteredAlerts
					setState={(e) => {
						setService('x');
						setFiltLines(e.target.value);
					}}
					state={filtLines}
					data={objects.serviceByLines}
					className='content-center h-auto pt-1 text-2xl font-black uppercase bg-transparent hb-20 justify-self-start text-slate-50'
					value={false}
				/>
			</div>
			<div className='ml-5'>
				<FilteredAlerts
					setState={(e) => {
						setService('x');
						setDirection(e.target.value);
					}}
					data={terminal}
					state={direction}
					className='content-center h-auto pt-2 text-1xl font-black uppercase bg-transparent hb-20 justify-self-start text-slate-50'
					value={false}
				/>
			</div>
		</div>
	</section>
);

/**
 * Loading Skeleton Component
 */
const LoadingSkeleton = () => (
	<div
		role='status'
		className='max-w-sm ml-[6.8rem] md:ml-[12rem] lg:ml-[14.4rem] animate-pulse'
	>
		{[...Array(5)].map((_, i) => (
			<div className='mt-10 flex items-center' key={i}>
				<div className='border-8 border-zinc-900 flex items-center justify-center w-7 h-7 bg-slate-50 rounded-full'></div>
				<div className='ml-4 h-3 bg-slate-50 w-52 rounded-full'></div>
			</div>
		))}
	</div>
);

/**
 * End Marker Component
 */
const EndMarker = ({ linecolors }) => (
	<div className='timelineItem'>
		<div
			className={`icon fill-current text-zinc-900 ${objects.lineColors[linecolors]}`}
		>
			<svg
				height={40}
				width={40}
				xmlns='http://www.w3.org/2000/svg'
				viewBox='0 0 60 60'
			>
				<rect width='60' height='20' x='0' y='0' rx='0' ry='0' />
			</svg>
		</div>
		<button className='leftSide'>
			<span className='self-start font-bold text-slate-50'></span>
		</button>
	</div>
);

/**
 * Main MTA Tracker Component
 */
function MtaTracker() {
	const [accordionOpen, setAccordionOpen] = useState(false);
	const [filtLines, setFiltLines] = useState('broadway');
	const [service, setService] = useState('x');
	const [direction, setDirection] = useState('Both Directions');

	const { data, loading } = useMTAData();

	// Create a context value object to ensure stability
	const accordionContextValue = {
		accordionOpen,
		setAccordionOpen,
	};

	// Process data based on selected filters
	const processAlertData = useCallback(() => {
		// Filter by service line
		const filteredItems = data.filter((x) =>
			service === 'x'
				? objects.serviceByLines[filtLines].includes(x.stop[0])
				: service.includes(x.stop[0])
		);

		// Process direction filter
		const directionTerms =
			terminal[direction] &&
			terminal[direction].map((item) => item.toLowerCase());

		// Apply direction filter and organize alerts
		return filteredItems
			.map((stops) => ({
				stop: stops.stop,
				alert: stops.alerts.filter((alert) =>
					directionTerms
						? directionTerms.includes(
								alert.direction
									? alert.direction.toLowerCase()
									: alert.direction
						  )
						: alert
				),
			}))
			.filter((item) => item.alert.length);
	}, [data, service, filtLines, direction]);

	const alertData = processAlertData();

	// Create timeline items from processed data
	const renderTimelineItems = () =>
		alertData.map((item, index) => {
			const alerts = {
				service: [...new Set(item.alert.map((service) => service.route))],
				heading: [...new Set(item.alert.map((service) => service.heading))],
				type: [...new Set(item.alert.map((service) => service.alert_type))],
			};

			return (
				<AccordionContext.Provider
					key={`regular-${item.stop}`}
					value={accordionContextValue}
				>
					<TimelineItem
						index={index}
						alerts={alerts}
						className={objects.serviceColors}
						stop={item}
						filtLines={filtLines}
					/>
				</AccordionContext.Provider>
			);
		});

	// Create a special summary item
	const renderSummaryItem = () => {
		// Get a count of unique alerts by type
		const alertTypes = {};
		alertData.forEach((item) => {
			item.alert.forEach((alert) => {
				if (!alertTypes[alert.alert_type]) {
					alertTypes[alert.alert_type] = 0;
				}
				alertTypes[alert.alert_type]++;
			});
		});

		// Convert to formatted strings for display
		const summaryAlerts = {
			service: [
				...new Set(
					alertData.flatMap((item) => item.alert.map((alert) => alert.route))
				),
			],
			type: Object.entries(alertTypes).map(
				([type, count]) => `${type}: ${count} alerts`
			),
		};

		// Custom icon for summary item
		const summaryIcon = (
			<div className='icon'>
				<svg
					height={40}
					width={40}
					xmlns='http://www.w3.org/2000/svg'
					viewBox='0 0 40 40'
				>
					<rect width='30' height='30' x='5' y='5' fill='#f59e0b' rx='4' />
					<text
						x='20'
						y='25'
						textAnchor='middle'
						fill='white'
						fontSize='18'
						fontWeight='bold'
					>
						!
					</text>
				</svg>
			</div>
		);

		return (
			<AccordionContext.Provider
				key='summary-item'
				value={accordionContextValue}
			>
				<TimelineItem
					index={-1} // Special index for summary
					alerts={summaryAlerts}
					className={objects.serviceColors}
					customIcon={summaryIcon}
					customTitle={`Alert Summary (${alertData.length} stations affected)`}
					isSpecial={true}
				/>
			</AccordionContext.Provider>
		);
	};

	const customIcon = (
		<div className='icon fill-current text-red-700 stroke-zinc-900'>
			<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 512'>
				<path
					d='M143 256.3 7 120.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0L313 86.3c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.4 9.5-24.6 9.5-34 .1zm34 192 136-136c9.4-9.4 9.4-24.6 0-33.9l-22.6-22.6c-9.4-9.4-24.6-9.4-33.9 0L160 352.1l-96.4-96.4c-9.4-9.4-24.6-9.4-33.9 0L7 278.3c-9.4 9.4-9.4 24.6 0 33.9l136 136c9.4 9.5 24.6 9.5 34 .1z'
					strokeWidth='50'
				/>
			</svg>
		</div>
	);

	return (
		<div className='pb-[100%] bg-zinc-900'>
			{/* Wrap the entire component tree in the context provider */}
			<AccordionContext.Provider value={accordionContextValue}>
				<div className='bg-zinc-600'>
					<FilterControls
						filtLines={filtLines}
						setFiltLines={setFiltLines}
						service={service}
						setService={setService}
						direction={direction}
						setDirection={setDirection}
					/>
				</div>

				<div
					className={`${
						loading ? 'animate-pulse' : ''
					} content relative before:${objects.lineColors[filtLines]}`}
				>
					{loading ? (
						<LoadingSkeleton />
					) : (
						<div className='relative'>
							{/* Summary item at the top */}
							{alertData.length > 0 && (
								<section className='mb-6'>{renderSummaryItem()}</section>
							)}

							{/* Regular timeline items */}
							<section>{renderTimelineItems().slice(0, 5)}</section>

							{/* Show "more stations affected" item if needed */}
							{alertData.length > 6 && (
								<section>
									<TimelineItem
										customIcon={customIcon}
										index={-2}
										customTitle={`${
											alertData.length - 6
										} more stations affected`}
										isSpecial={true}
										alerts={{
											type: [
												`Total of ${alertData.length} stations have alerts`,
											],
										}}
									/>
								</section>
							)}

							{/* Last timeline item */}
							<section>{renderTimelineItems().slice(-1)}</section>
							<EndMarker linecolors={filtLines} />
						</div>
					)}
				</div>
			</AccordionContext.Provider>
		</div>
	);
}

export default MtaTracker;
