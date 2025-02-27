import { useContext } from 'react';
import stopNames from '../../util/stopNames.json';
import { AccordionContext } from '../pages/mtaTracker.js';

const TimelineItem = (props) => {
	const { accordionOpen, setAccordionOpen } = useContext(AccordionContext);

	if (!props.stop || !props.stop.alert) {
		return null;
	}

	const open = accordionOpen === props.index;
	const mapFromColors = new Map(
		props.stop.alert.map((item) => [item.heading, item])
	);
	const unique = [...mapFromColors.values()];

	return (
		<>
			<div className={`content ${accordionOpen ? 'mb-0' : 'mb-10'}`}>
				<div className='timelineItem'>
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
					<div className='leftSide'>
						<ul className='leftcont'>
							{props.alerts['service'].map((serviceIter, index) => (
								<li
									key={index}
									className={`items ${props.className[serviceIter]}`}
								>
									{serviceIter}
								</li>
							))}
						</ul>
					</div>
				</div>
				<div
					onClick={() => setAccordionOpen(open ? null : props.index)}
					className='mt-0 cursor-pointer'
				>
					<button
						className={`self-start font-bold text-slate-50 mt-2 ${
							open
								? "ml-2 inline-block bg-slate-50 text-slate-900 rounded-e-md relative px-2 before:content-[''] before:absolute before:h-0 before:w-0 before:top-[0px] before:left-[-24px] before:border-[12px] before:border-r-slate-50 before:border-l-transparent before:border-y-transparent border-solid"
								: 'bg-slate-900'
						}`}
					>
						<span>{stopNames[props.stop.stop].stop_name}</span>
					</button>

					<div
						className={`grid transition-all duration-300 ease-in-out text-slate-600 text-sm ${
							!open
								? 'grid-rows-[1fr] opacity-100'
								: 'grid-rows-[0fr] opacity-0 overflow-hidden'
						}`}
					>
						<div className='overflow-hidden'>
							{props.alerts['type'].map((alertTypeIter, index) => (
								<ul key={index}>{alertTypeIter}</ul>
							))}
						</div>
					</div>

					<div
						className={`grid transition-all duration-300 ease-in-out text-sm ${
							open
								? 'grid-rows-[1fr] opacity-100'
								: 'grid-rows-[0fr] opacity-0 overflow-hidden'
						}`}
					>
						<div className='mt-2 overflow-hidden'>
							{unique.map((item) => (
								<>
									<div className='text-sm text-slate-300'>
										{item.alert_type}
									</div>
									<div className='text-sm text-slate-600'>{item.heading}</div>
								</>
							))}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default TimelineItem;
