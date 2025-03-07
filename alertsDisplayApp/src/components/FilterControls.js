import PropTypes from 'prop-types';
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
