const FilteredAlerts = (props) => {
  let objMap = props.value
    ? Object.values(props.data)
    : Object.keys(props.data);
  return (
    <>
      <select
        multiple={props.multiple || false}
        defaultValue="x"
        className={`appearance-none  ${props.tailwind}`}
        name="filter"
        id="filter"
        value={props.state}
        onChange={props.setState}
      >
        {props.value && <option value="x">X</option>}
        {objMap.map((filtIter, value) => {
          return <option value={filtIter}>{filtIter}</option>;
        })}
      </select>
    </>
  );
};

export default FilteredAlerts;
