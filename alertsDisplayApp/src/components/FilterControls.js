import PropTypes from 'prop-types';
import SummaryIcon from '../assets/summaryIcon';
import terminal from '../constants/terminalDirections';
import FilteredAlerts from './FilteredAlerts';

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
 * @param {function} props.setHomeStation
 * @param {Object} props.objects - Subway line color and mapping data
 * @returns {JSX.Element} Filter controls UI
 */

const FilterControls = ({
	stopNames,
	setSummary,
	summary,
	homeStation,
	setHomeStation,
	filtLines,
	setFiltLines,
	service,
	setService,
	direction,
	setDirection,
	objects,
}) => (
	<section className='flex pt-5 ml-[04rem] md:ml-[10.2rem] lg:ml-[12.5rem]'>
		<div className='w-20 h-20 '>
			<FilteredAlerts
				data={objects.serviceByLines[filtLines]}
				state={service}
				setState={(e) => setService(e.target.value)}
				className={`[text-align-last:center] pt-2 m-0.5 p-2.5 rounded-full w-full h-full mb-0 text-slate-50 font-bold text-6xl text-center ${objects.lineColors[filtLines]}`}
				value={true}
			/>
		</div>
		<div className='w-44 ml-4 flex flex-col'>
			<div className=''>
				<FilteredAlerts
					setState={(e) => {
						setHomeStation(e.target.value);
					}}
					state={homeStation}
					data={stopNames}
					className=' h-auto w-36 md:w-64 truncate pt-1 text-lg font-black uppercase bg-transparent justify-self-start text-slate-50'
					value={true}
				/>
			</div>
			<div className=''>
				<div className=' sm:flex items-center justify-between'>
					<FilteredAlerts
						setState={(e) => {
							setService('1');
							setFiltLines(e.target.value);
						}}
						state={filtLines}
						data={objects.serviceByLines}
						className='content-center h-auto w-auto text-sm  font-bold uppercase bg-transparent text-zinc-400'
						value={false}
					/>
					<span className='content-center sm:mx-2 hidden sm:inline text-lg font-bold uppercase bg-transparent text-zinc-50'>
						|
					</span>
					<FilteredAlerts
						setState={(e) => {
							setService('x');
							setDirection(e.target.value);
						}}
						data={terminal}
						state={direction}
						className='content-center h-auto text-sm   font-bold uppercase bg-transparent justify-self-start text-zinc-400'
						value={false}
					/>
				</div>
			</div>
		</div>
		<div className=' flex items-center justify-center '>
			<button
				onClick={() => setSummary(!summary)}
				className=' w-12 h-12 rounded-full flex items-center justify-center bg-zinc-600 md:hidden'
			>
				<SummaryIcon />
			</button>
		</div>
	</section>
);

FilterControls.propTypes = {
	filtLines: PropTypes.string.isRequired,
	setFiltLines: PropTypes.func.isRequired,
	homeStation: PropTypes.string.isRequired,
	setHomeStation: PropTypes.func.isRequired,
	service: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
	setService: PropTypes.func.isRequired,
	direction: PropTypes.string.isRequired,
	setDirection: PropTypes.func.isRequired,
	objects: PropTypes.object.isRequired,
};

export default FilterControls;
