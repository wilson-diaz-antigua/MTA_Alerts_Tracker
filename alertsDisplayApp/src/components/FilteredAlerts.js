const FilteredAlerts = (props) => {
	let objMap = props.value
		? Object.values(props.data)
		: Object.keys(props.data);
	return (
		<section className=''>
			<select
				multiple={props.multiple || false}
				className={` appearance-none cursor-pointer  ${props.className}`}
				name='filter'
				value={props.state}
				onChange={props.setState}
			>
				{objMap.map((filtIter, value) => {
					return (
						<option className='' key={value} value={filtIter}>
							{filtIter}
						</option>
					);
				})}
			</select>
		</section>
	);
};

export default FilteredAlerts;
