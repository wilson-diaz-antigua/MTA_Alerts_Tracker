import { createContext, useEffect, useState } from 'react';
import objects from '../../util/subwayLineColors.json';
import FilteredAlerts from '../components/FilteredAlerts.js';
import TimelineItem from '../components/TimelineItem';

export const AccordionContext = createContext();
let colors = 'bg-MTAred bg-MTAgreen bg-MTAmagenta bg-MTAblue';
let beforecolors =
	'before:bg-MTAred before:bg-MTAgreen before:bg-MTAmagenta before:bg-MTAblue';
function MtaTracker() {
	const [accordionOpen, setAccordionOpen] = useState(false);
	const [data, setdata] = useState([]);
	const [filtLines, setFiltLines] = useState('broadway');
	const [service, setService] = useState('x');
	const [direction, setDirection] = useState('Both Directions');
	const [stop, setStop] = useState('101');
	const [loading, setLoading] = useState(true);

	let terminal = {
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
	useEffect(() => {
		fetch('https://backend-production-0687.up.railway.app/stops')
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				setLoading(false);
				setdata(data);
			})
			.catch((error) => {
				console.error('Error fetching data:', error);
			});
	}, []);

	const filteredItems = data.filter((x) => {
		return service == 'x'
			? objects.serviceByLines[filtLines].includes(x.stop[0])
			: service.includes(x.stop[0]);
	});

	let dir =
		terminal[direction] &&
		terminal[direction].map((item) => item.toLowerCase());

	let data2 = filteredItems
		.map((stops) => {
			return {
				stop: stops.stop,
				alert: stops.alerts.filter((alerts) => {
					if (dir) {
						return dir.includes(
							alerts.direction
								? alerts.direction.toLowerCase()
								: alerts.direction
						);
					} else {
						return alerts;
					}
				}),
			};
		})
		.filter((item) => {
			return item.alert.length;
		});

	const data1 = () =>
		data2.map((item, index) => {
			const alerts = {
				service: [
					...new Set(
						item.alert.map((service) => {
							return service.route;
						})
					),
				],
				heading: [
					...new Set(
						item.alert.map((service) => {
							return service.heading;
						})
					),
				],
				type: [
					...new Set(
						item.alert.map((service) => {
							return service.alert_type;
						})
					),
				],
			};
			return (
				<>
					<AccordionContext.Provider
						value={{ accordionOpen, setAccordionOpen }}
					>
						<TimelineItem
							key={item.stop}
							index={index}
							alerts={alerts}
							className={objects.serviceColors}
							stop={item}
							filtLines={filtLines}
						/>
					</AccordionContext.Provider>
				</>
			);
		});

	return (
		<div className=' pb-[100%] bg-zinc-900'>
			<div className=' bg-zinc-900'>
				<section className=' flex  pt-10 ml-[05rem]   md:ml-[10rem]  lg:ml-[12.5rem]'>
					<div className='w-20 h-20 block '>
						<FilteredAlerts
							data={objects.serviceByLines[filtLines]}
							state={service}
							setState={(e) => {
								setService(e.target.value);
							}}
							className={`[text-align-last:center]  pt-2 m-0.5  p-2.5  rounded-full w-full h-full mb-0 text-slate-50 font-bold text-6xl text-center ${objects.lineColors[filtLines]} `}
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
								className={
									'  content-center h-auto pt-1 text-2xl font-black uppercase bg-transparent hb-20 justify-self-start text-slate-50'
								}
								value={false}
							/>
						</div>
						<div className='ml-5 '>
							<FilteredAlerts
								setState={(e) => {
									setService('x');
									setDirection(e.target.value);
								}}
								data={terminal}
								state={direction}
								className={
									'  content-center h-auto pt-2  text-1xl font-black uppercase bg-transparent hb-20 justify-self-start text-slate-50'
								}
								value={false}
							/>
						</div>
					</div>
				</section>
			</div>
			<div
				className={`${loading ? 'animate-pulse' : ''} content relative
          before:${objects.lineColors[filtLines]}`}
			>
				{loading && (
					<div
						role='status'
						className='max-w-sm ml-[6.8rem]   md:ml-[12rem]  lg:ml-[14.6rem] animate-pulse'
					>
						{[...Array(5)].map((e, i) => (
							<div className='mt-10 flex items-center' key={i}>
								<div
									className={
										' border-8 border-zinc-900  flex items-center justify-center w-7 h-7 bg-slate-50 rounded-full  '
									}
								></div>
								<div className='ml-4  h-3 bg-slate-50 w-52 rounded-full'></div>
							</div>
						))}
					</div>
				)}
				<div className='relative'>
					<section>{data1()}</section>
				</div>
			</div>
		</div>
	);
}

export default MtaTracker;
