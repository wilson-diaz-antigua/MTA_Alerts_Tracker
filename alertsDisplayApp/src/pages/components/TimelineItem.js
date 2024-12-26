import { useContext } from 'react';
import stopNames from '../../../util/stopNames.json';

import { AccordionContext } from '../index.js';
const TimelineItem = (props) => {
	const { accordionOpen, setAccordionOpen } = useContext(AccordionContext);
	const open = accordionOpen === props.index;
	const mapFromColors = new Map(
		props.stop.alert.map((item) => [item.heading, item])
	);
	const unique = [...mapFromColors.values()];
	const dirs = unique.map((item) => {
		return item.dateText;
	});

	return (
		<>
			<div className={`content ${accordionOpen ? 'mb-0' : 'mb-10'}`}>
				<div className=' timelineItem'>
					<div className='icon'>
						<svg
							className=''
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 40 40'
						>
							<circle
								className={`fill-current text-slate-50 stroke-zinc-900`}
								cx='20'
								cy='20'
								r='17.6'
								strokeWidth='10'
								fill='none'
							/>
						</svg>
					</div>
					<div className='leftSide '>
						<ul className='leftcont'>
							{props.alerts['service'].map((serviceIter, index) => {
								return (
									<li
										key={index}
										className={`items ${props.className[serviceIter]}`}
									>
										{serviceIter}
									</li>
								);
							})}
						</ul>
					</div>
				</div>
				<div className='mt-0'>
					<button
						onClick={() => {
							setAccordionOpen(open ? null : props.index);
						}}
						className={`self-start font-bold text-slate-50   mt-2${
							open
								? " ml-2 inline-block bg-slate-50 text-slate-900  rounded-e-md relative  px-2  before:content-[''] before:absolute before:h-0 before:w-0 before:top-[0px] before:left-[-24px] before:border-[12px]  before:border-r-slate-50 before:border-l-transparent before:border-y-transparent border-solid "
								: 'bg-slate-900'
						} `}
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
						<div className='overflow-hidden '>
							{props.alerts['type'].map((alertTypeIter, index) => {
								return <ul key={index}>{alertTypeIter}</ul>;
							})}
						</div>
					</div>

					<div
						className={`grid transition-all duration-300 ease-in-outtext-sm ${
							open
								? 'grid-rows-[1fr] opacity-100'
								: 'grid-rows-[0fr] opacity-0 overflow-hidden'
						}`}
					>
						<div className='mt-2 overflow-hidden'>
							{unique.map((item) => {
								return (
									<>
										<div className='text-sm text-slate-300'>
											{item.alert_type}
										</div>
										<div className='text-sm text-slate-600'>{item.heading}</div>
									</>
								);
							})}
							;
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default TimelineItem;
