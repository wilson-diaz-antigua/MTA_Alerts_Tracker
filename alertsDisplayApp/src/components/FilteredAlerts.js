/**
 * A React functional component that renders a filtered list of alerts as a dropdown or multi-select menu.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.data - The data object containing the alerts to be displayed.
 * @param {boolean} [props.value=false] - Determines whether to use the values or keys of the `data` object for the dropdown options.
 * @param {boolean} [props.multiple=false] - Specifies whether the dropdown should allow multiple selections.
 * @param {string} [props.className=""] - Additional CSS classes to style the dropdown.
 * @param {string|number|Array} props.state - The current selected value(s) of the dropdown.
 * @param {Function} props.setState - The function to handle changes to the selected value(s).
 *
 * @returns {JSX.Element} A section containing a dropdown or multi-select menu with the filtered alerts.
 */
const FilteredAlerts = (props) => {
  let undefinedState = !props.state && props.data ? props.data[0] : "";
  let objMap = props.value
    ? Object.values(props.data || {})
    : Object.keys(props.data || {});
  return (
    <section className="">
      <select
        className={`cursor-pointer appearance-none ${props.className}`}
        name="filter"
        value={undefinedState}
        onChange={(e) => props.setState(e.target.value)}
      >
        {objMap.map((filtIter, value) => {
          return (
            <option
              className="w-auto overflow-clip"
              key={value}
              value={filtIter}
            >
              {filtIter}
            </option>
          );
        })}
      </select>
    </section>
  );
};

export default FilteredAlerts;
