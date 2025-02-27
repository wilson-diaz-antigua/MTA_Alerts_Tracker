const FilteredAlerts = (props) => {
	const objMap = props.value
		? Object.values(props.data)
		: Object.keys(props.data);

	return (
		<section>
			<select
				multiple={props.multiple || false}
				className={`appearance-none cursor-pointer ${props.className}`}
				name='filter'
				id='filter'
				value={props.state}
				onChange={props.setState}
			>
				{props.value && <option value='x'>X</option>}
				{objMap.map((filtIter, value) => (
					<option key={value} value={filtIter}>
						{filtIter}
					</option>
				))}
			</select>
		</section>
	);
};

export default FilteredAlerts;
