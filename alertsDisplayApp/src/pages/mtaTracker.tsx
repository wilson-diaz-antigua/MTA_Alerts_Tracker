import { createContext, useCallback, useState } from 'react';
import objects from '../../util/subwayLineColors.json';
import EndMarker from '../components/EndMarker';
import FilterControls from '../components/FilterControls';
import LoadingSkeleton from '../components/LoadingSkeleton';
import TimelineItem from '../components/TimelineItem';
import terminal from '../constants/terminalDirections';
import useMTAData from '../hooks/useMTAData';
// Change to namespace import
import * as ArrayUtils from '../utils/arrayUtils';

//--TODO: if length of stops is less than 6 then dont show last section
//--TODO: show full list of stops when clicking on the more stations affected section
const COLORS = {
	TRAIN_COLORS: 'bg-MTAred bg-MTAgreen bg-MTAmagenta bg-MTAblue bg-MTAorange',
	DOT_COLORS:
		'text-MTAred" text-MTAgreen text-MTAmagenta text-MTAblue text-MTAorange',
	BEFORE_COLORS:
		'before:bg-MTAred before:bg-MTAgreen before:bg-MTAmagenta before:bg-MTAblue',
};

// Define interfaces for type safety
interface Alert {
  route: string;
  heading: string;
  alert_type: string;
  direction?: string;
}

interface StopData {
  stop: string[];
  alerts: Alert[];
}

interface ProcessedAlert {
  service: string[];
  heading: string[];
  type: string[];
}

interface AccordionContextType {
  accordionOpen: boolean | null;
  setAccordionOpen: (open: boolean) => void;
}

// Initialize the context with default values
export const AccordionContext = createContext<AccordionContextType>({
  accordionOpen: null,
  setAccordionOpen: () => {},
});

// Re-export for backward compatibility
export const ensureArray = ArrayUtils.ensureArray;

/**
 * Main MTA Tracker Component
 */
function MtaTracker(): JSX.Element {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [accordionOpen, setAccordionOpen] = useState<boolean>(false);
  const [filtLines, setFiltLines] = useState<string>('broadway');
  const [service, setService] = useState<string>('x');
  const [direction, setDirection] = useState<string>('Both Directions');

  const { data, loading } = useMTAData();
  // Create a context value object to ensure stability
  const accordionContextValue: AccordionContextType = {
    accordionOpen,
    setAccordionOpen,
  };

  // Process data based on selected filters
  const processAlertData = useCallback((): StopData[] => {
    if (!data || !Array.isArray(data)) return [];
    
    // Filter by service line
    const filteredItems = data.filter((x) =>
      service === 'x'
        ? objects.serviceByLines[filtLines].includes(x.stop[0])
        : service.includes(x.stop[0])
    );

    // Process direction filter
    const directionTerms = terminal[direction] &&
      terminal[direction].map((item: string) => item.toLowerCase());

    // Apply direction filter and organize alerts
    return filteredItems
      .map((stops) => ({
        stop: stops.stop,
        alert: stops.alerts.filter((alert) =>
          directionTerms
            ? directionTerms.includes(
                alert.direction
                  ? alert.direction.toLowerCase()
                  : alert.direction
              )
            : alert
        ),
      }))
      .filter((item) => item.alert.length);
  }, [data, service, filtLines, direction]);

  const alertData = processAlertData();

  // Create timeline items from processed data
  const renderTimelineItems = (): JSX.Element[] =>
    alertData.map((item, index) => {
      const alerts: ProcessedAlert = {
        service: ArrayUtils.uniqueValues(item.alert, (service) => service.route),
        heading: ArrayUtils.uniqueValues(item.alert, (service) => service.heading),
        type: ArrayUtils.uniqueValues(item.alert, (service) => service.alert_type),
      };

      return (
   
        <AccordionContext.Provider
          key={`regular-${item.stop}`}
          value={accordionContextValue}
        >
          <TimelineItem
            index={index}
            alerts={alerts}
            className={objects.serviceColors}
            stop={item}
            filtLines={filtLines}
          />
        </AccordionContext.Provider>
      );
    });

  // Custom icon for "more stations" indicator
  const customIcon = (
    <div className={`icon h-[70px] w-[30px] bg-zinc-900 fill-current pt-2 ${objects.dottedColors[filtLines]}`}>
  


      <svg
        viewBox='0 0 50 150'
        width='20'
        height='60'
        xmlns='http://www.w3.org/2000/svg'
      >
        <ellipse cx='25' cy='20' rx='10' ry='10' />
        <ellipse cx='25' cy='60' rx='10' ry='10' />
        <ellipse cx='25' cy='100' rx='10' ry='10' />
      </svg>
    </div>
  );

  return (
    <div className=' bg-zinc-900'>
      <AccordionContext.Provider value={accordionContextValue}>
        <div className='bg-zinc-600'>
          <FilterControls
            filtLines={filtLines}
            setFiltLines={setFiltLines}
            service={service}
            setService={setService}
            direction={direction}
            setDirection={setDirection}
            objects={objects}
          />
        </div>
        <div
          className={`${
            loading ? 'animate-pulse' : ''
          } content relative before:${objects.lineColors[filtLines]}`}
        >
          {loading ? (
            <LoadingSkeleton />
          ) : (
            <div className='relative'>
              <section>{isExpanded? renderTimelineItems(): renderTimelineItems().slice(0, 5)}</section>

              {alertData.length > 6 &&  (

                <>
                  <section
                  onClick={() => setIsExpanded(!isExpanded)}
                  >
                    <TimelineItem
                      customIcon={customIcon}
                      index={-2}
                      customTitle={ isExpanded? `collapse stations`:`${
                        alertData.length - 6
                      } more stations affected`}
                      isSpecial={true}
                      alerts={isExpanded?{
                        type: [
                          ` show less`,
                        ],
                      }:{
                        type: [
                          ` show ${alertData.length -6} more stations with alerts`,
                        ],
                      }}
                    />
                  </section>
                  <section>{ isExpanded?'':renderTimelineItems().slice(-1)}</section>
                </>
              )}

              
              <EndMarker linecolors={filtLines} objects={objects} />
            </div>
          )}
        </div>
      </AccordionContext.Provider>
    </div>
  );
}

export default MtaTracker;
