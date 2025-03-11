import PropTypes from 'prop-types';

import terminal from '../constants/terminalDirections';
import FilteredAlerts from './FilteredAlerts';

const summaryIcon = (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		width='30'
		height='30'
		viewBox='0 0 32 32'
		className='fill-current text-slate-50'
	>
		<path d='M19 10h7v2h-7zM19 15h7v2h-7zM19 20h7v2h-7zM6 10h7v2H6zM6 15h7v2H6zM6 20h7v2H6z' />
		<path d='M28 5H4a2.002 2.002 0 0 0-2 2v18a2.002 2.002 0 0 0 2 2h24a2.002 2.002 0 0 0 2-2V7a2.002 2.002 0 0 0-2-2ZM4 7h11v18H4Zm13 18V7h11v18Z' />
		<path d='M0 0h32v32H0z ' fill='none' />
	</svg>
);
/**
 * Filter Controls Component for MTA tracker
 * Provides UI for filtering subway line information
 *
 * @param {Object} props - Component props
 * @param {string} props.filtLines - Currently selected line filter
 * @param {Function} props.setFiltLines - Function to update line filter
 * @param {string} props.service - Currently selected service
 * @param {Function} props.setService - Function to update service
 * @param {string} props.direction - Currently selected direction
 * @param {Function} props.setDirection - Function to update direction
 * @param {Object} props.objects - Subway line color and mapping data
 * @returns {JSX.Element} Filter controls UI
 */

const FilterControls = ({
	filtLines,
	setFiltLines,
	service,
	setService,
	direction,
	setDirection,
	objects,
}) => (
	<section className='flex pt-5 ml-[04rem] md:ml-[10.2rem] lg:ml-[12.5rem]'>
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
		<div className='ml-4 flex items-center justify-center '>
			<button
				onClick={() => (window.location.href = '/project/alertSummary')}
				className=' w-12 h-12 rounded-full flex items-center justify-center bg-zinc-600 md:hidden'
			>
				{summaryIcon}
			</button>
		</div>
	</section>
);

FilterControls.propTypes = {
	filtLines: PropTypes.string.isRequired,
	setFiltLines: PropTypes.func.isRequired,
	service: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
	setService: PropTypes.func.isRequired,
	direction: PropTypes.string.isRequired,
	setDirection: PropTypes.func.isRequired,
	objects: PropTypes.object.isRequired,
};

export default FilterControls;
