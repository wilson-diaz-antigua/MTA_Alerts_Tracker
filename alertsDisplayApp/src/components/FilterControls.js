import PropTypes from "prop-types";
import SummaryIcon from "../assets/summaryIcon";
import terminal from "../constants/terminalDirections";
import FilteredAlerts from "./FilteredAlerts";

/**
 * Filter Controls Component for MTA tracker
 * Provides UI for filtering subway line information
 *
 * @param {Object} props - Component props
 * @param {string} props.filtLines - Currently selected line filter
 * @param {Array} props.stopNames - List of subway stop names
 * @param {Function} props.setSummary - Function to update summary view
 * @param {boolean} props.summary - Current summary view state
 * @param {string} props.homeStation - Currently selected home station
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
  <section className="ml-[04rem] flex pt-5 md:ml-[10.2rem] lg:ml-[12.5rem]">
    {/* Container for the filtered alerts button */}
    <div className="h-20 w-20">
      <FilteredAlerts
        data={objects.serviceByLines[filtLines]} // Data for the selected line's services
        state={service} // Current selected service
        setState={(e) => setService(e.target.value)} // Update service on change
        className={`m-0.5 mb-0 h-full w-full rounded-full p-2.5 pt-2 text-center text-6xl font-bold text-slate-50 [text-align-last:center] ${objects.lineColors[filtLines]}`} // Styling for the button
        value={true} // Indicates this is a selectable value
      />
    </div>

    {/* Container for the dropdowns */}
    <div className="ml-2 flex w-44 flex-col">
      <div className="">
        {/* Dropdown for selecting the home station */}
        <FilteredAlerts
          setState={(e) => {
            setHomeStation(e.target.value); // Update home station on change
            setSummary(true); // Enable summary view
          }}
          state={homeStation} // Current selected home station
          data={stopNames} // List of stop names
          className="h-auto w-36 justify-self-start truncate bg-transparent pt-1 text-lg font-black uppercase text-slate-50 iphone-14pro-max:w-48 md:w-64" // Styling for the dropdown
          value={true} // Indicates this is a selectable value
        />
      </div>
      <div className="">
        <div className="items-center justify-between [text-align-last:right] iphone-14pro-max:flex">
          {/* Dropdown for selecting the subway line */}
          <FilteredAlerts
            setState={(e) => {
              setService(objects.serviceByLines[filtLines][0]); // Reset service to the first option for the new line
              setFiltLines(e.target.value); // Update selected line
            }}
            state={filtLines} // Current selected line
            data={objects.serviceByLines} // Data for all lines
            className="h-auto w-auto content-center bg-transparent text-sm font-bold uppercase text-zinc-400 [text-align-last:right] iphone-14pro-max:text-right" // Styling for the dropdown
            value={false} // Indicates this is not a selectable value
          />
          {/* Separator for better UI */}
          <span className="hidden content-center bg-transparent text-lg font-bold uppercase text-zinc-50 iphone-14pro-max:mx-2 iphone-14pro-max:inline">
            |
          </span>
          {/* Dropdown for selecting the direction */}
          <FilteredAlerts
            setState={(e) => {
              setService(objects.serviceByLines[filtLines][0]); // Reset service to the first option for the new direction
              setDirection(e.target.value); // Update selected direction
            }}
            data={terminal} // Data for terminal directions
            state={direction} // Current selected direction
            className="h-auto content-center justify-self-start bg-transparent text-sm font-bold uppercase text-zinc-400 [text-align-last:left]" // Styling for the dropdown
            value={false} // Indicates this is not a selectable value
          />
        </div>
      </div>
    </div>

    {/* Button to toggle summary view */}
    <div className="mr-4 flex items-center justify-end iphone-14pro-max:ml-10">
      <button
        onClick={() => setSummary(!summary)} // Toggle summary view state
        className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-600 md:hidden" // Styling for the button
      >
        <SummaryIcon /> {/* Icon for the summary button */}
      </button>
    </div>
  </section>
);

FilterControls.propTypes = {
  stopNames: PropTypes.array,

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
