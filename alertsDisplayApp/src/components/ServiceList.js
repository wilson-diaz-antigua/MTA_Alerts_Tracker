import PropTypes from 'prop-types';

/**
 * Ensures a value is treated as an array
 * @param {any} value - The value to ensure is an array
 * @returns {Array} The value as an array
 */
const ensureArray = (value) => {
	if (value === undefined || value === null) return [];
	return Array.isArray(value) ? value : [value];
};

/**
 * ServiceList component displays a list of transit services with appropriate styling
 *
 * @param {Object} props - Component props
 * @param {Array|string} props.services - The services to display
 * @param {Object} props.classNames - Class name mapping for each service
 * @param {string} props.className - Additional class names for the container
 * @returns {JSX.Element} Rendered service list
 */
const ServiceList = ({ services, classNames, className = '' }) => {
	const serviceArray = ensureArray(services);

	if (serviceArray.length === 0)
		return <div className={`leftSide ${className}`}></div>;

	return (
		<div className={`leftSide ${className}`}>
			<ul className='leftcont'>
				{serviceArray.map((service, index) => (
					<li
						key={`service-${service}-${index}`}
						className={`items ${classNames?.[service] || ''}`}
					>
						{service}
					</li>
				))}
			</ul>
		</div>
	);
};

ServiceList.propTypes = {
	services: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
	classNames: PropTypes.object,
	className: PropTypes.string,
};

ServiceList.defaultProps = {
	services: [],
	classNames: {},
	className: '',
};

export default ServiceList;
