const FilteredAlerts = (props) => {
  let objMap = props.value
    ? Object.values(props.data)
    : Object.keys(props.data);
  return (
    <>
      <select
        multiple={props.multiple || false}
        defaultValue="x"
        className={props.tailwind}
        name="filter"
        id="filter"
        value={props.service}
        onChange={props.setService}
      >
        {objMap.map((filtServiceIter) => {
          return <option className="appearance-none">{filtServiceIter}</option>;
        })}
      </select>
    </>
  );
};

export default FilteredAlerts;
