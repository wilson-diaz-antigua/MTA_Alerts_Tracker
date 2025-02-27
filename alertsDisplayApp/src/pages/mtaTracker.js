import axios from 'axios';
import { createContext, useEffect, useState } from 'react';
import objects from '../../util/subwayLineColors.json';
import FilteredAlerts from '../components/FilteredAlerts.js';
import TimelineItem from '../components/TimelineItem';

export const AccordionContext = createContext();

const colors = 'bg-MTAred bg-MTAgreen bg-MTAmagenta bg-MTAblue';
const beforecolors =
	'before:bg-MTAred before:bg-MTAgreen before:bg-MTAmagenta before:bg-MTAblue';

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

function MtaTracker() {
	const [accordionOpen, setAccordionOpen] = useState(false);
	const [data, setData] = useState([]);
	const [filtLines, setFiltLines] = useState('broadway');
	const [service, setService] = useState('x');
	const [direction, setDirection] = useState('Both Directions');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const checkDatabaseConnection = async () => {
			try {
				const response = await axios.get(
					'https://backend-production-0687.up.railway.app/stops'
				);
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
					await new Promise((resolve) => setTimeout(resolve, 2000));
				}
			}

			try {
				const response = await axios.get(
					'https://backend-production-0687.up.railway.app/stops'
				);
				setData(response.data);
			} catch (error) {
				console.error('Error fetching data:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const filteredItems = data.filter((x) =>
		service === 'x'
			? objects.serviceByLines[filtLines].includes(x.stop[0])
			: service.includes(x.stop[0])
	);

	const dir =
		terminal[direction] &&
		terminal[direction].map((item) => item.toLowerCase());

	const data2 = filteredItems
		.map((stops) => ({
			stop: stops.stop,
			alert: stops.alerts.filter((alerts) =>
				dir
					? dir.includes(
							alerts.direction
								? alerts.direction.toLowerCase()
								: alerts.direction
					  )
					: alerts
			),
		}))
		.filter((item) => item.alert.length);

	const data1 = () =>
		data2.map((item, index) => {
			const alerts = {
				service: [...new Set(item.alert.map((service) => service.route))],
				heading: [...new Set(item.alert.map((service) => service.heading))],
				type: [...new Set(item.alert.map((service) => service.alert_type))],
			};
			return (
				<AccordionContext.Provider
					key={item.stop}
					value={{ accordionOpen, setAccordionOpen }}
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

	return (
		<div className='pb-[100%] bg-zinc-900'>
			<div className='bg-zinc-900'>
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
			</div>
			<div
				className={`${loading ? 'animate-pulse' : ''} content relative before:${
					objects.lineColors[filtLines]
				}`}
			>
				{loading && (
					<div
						role='status'
						className='max-w-sm ml-[6.8rem] md:ml-[12rem] lg:ml-[14.6rem] animate-pulse'
					>
						{[...Array(5)].map((e, i) => (
							<div className='mt-10 flex items-center' key={i}>
								<div className='border-8 border-zinc-900 flex items-center justify-center w-7 h-7 bg-slate-50 rounded-full'></div>
								<div className='ml-4 h-3 bg-slate-50 w-52 rounded-full'></div>
							</div>
						))}
					</div>
				)}
				<div className='relative'>
					<section>{data1().slice(0, 5)}</section>
					<section>{data1().slice(-1)}</section>
					<div className='timelineItem'>
						<div className='icon'>
							<svg
								height={40}
								width={40}
								xmlns='http://www.w3.org/2000/svg'
								viewBox='0 0 60 60'
							>
								<rect
									width='60'
									height='20'
									x='0'
									y='0'
									rx='0'
									ry='0'
									fill='red'
								/>
							</svg>
						</div>
						<button className='leftSide'>
							<span className='self-start font-bold text-slate-50'></span>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default MtaTracker;
