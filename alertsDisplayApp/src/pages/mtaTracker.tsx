import { createContext, JSX, useCallback, useEffect, useState } from 'react';
import objects from '../../util/subwayLineColors.json';
import EndMarker from '../components/EndMarker';
import FilterControls from '../components/FilterControls';
import LoadingSkeleton from '../components/LoadingSkeleton';
import TimelineItem from '../components/TimelineItem';
import terminal from '../constants/terminalDirections';
import useMTAData from '../hooks/useMTAData';
import { selectStopName } from '../utils/alertUtils';
import AlertSummary from './alertSummary';
// Change to namespace import
import { AccordionContextType, ProcessedAlert, StopData } from '../utils/alertTypes';
import * as ArrayUtils from '../utils/arrayUtils';

const COLORS = {
  TRAIN_COLORS: 'bg-MTAred bg-MTAgreen bg-MTAmagenta bg-MTAblue bg-MTAorange',
  DOT_COLORS:
    'text-MTAred" text-MTAgreen text-MTAmagenta text-MTAblue text-MTAorange',
  BEFORE_COLORS:
    'before:bg-MTAred before:bg-MTAgreen before:bg-MTAmagenta before:bg-MTAblue',
};

// Initialize the context with default values
export const AccordionContext = createContext<AccordionContextType>({
  accordionOpen: null,
  setAccordionOpen: () => { },
});


// Re-export for backward compatibility
export const ensureArray = ArrayUtils.ensureArray;

/**
 * Main MTA Tracker Component
 */
let initialHomeStation = 'Grand Central - 42 St';
function MtaTracker(): JSX.Element {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [accordionOpen, setAccordionOpen] = useState<boolean>(false);
  const [filtLines, setFiltLines] = useState<string>('broadway');
  const [service, setService] = useState<string>('1');
  const [direction, setDirection] = useState<string>('Both ways');
  const [homeStation, setHomeStation] = useState<string>(initialHomeStation);
  const [summary, setSummary] = useState(false);
  const { data, loading } = useMTAData();
  // Create a context value object to ensure stability
  const accordionContextValue: AccordionContextType = {
    accordionOpen,
    setAccordionOpen,
  };
  const stopnames = selectStopName(objects.serviceByLines[filtLines]);
  const stopNamedata = stopnames.map((item) => {

    return item.stop_name;
  });


  initialHomeStation = stopNamedata[0];

  useEffect(() => {
    setService(objects.serviceByLines[filtLines][0]);
  }, [filtLines, direction]);
  // Process data based on selected filters
  const processAlertData = useCallback((): StopData[] => {
    if (!data || !Array.isArray(data)) return [];


    const filterByLines = data.filter((item) =>
      objects.serviceByLines[filtLines].includes(item.stop[0]));
    const filteredByService = filterByLines.filter((item) =>
      item.alerts.some(alert => alert.route === service)
    );


    // Process direction filter
    const directionTerms = terminal[direction] &&
      terminal[direction].map((item: string) => item.toLowerCase());

    // Apply direction filter and organize alerts
    return filteredByService.map((stops) => ({
      stop: stops.stop,
      alerts: stops.alerts.filter((alert) =>
        directionTerms
          ? directionTerms.includes(
            alert.direction
              ? alert.direction.toLowerCase()
              : alert.direction
          )
          : alert
      ),
    }))
      .filter((item) => item.alerts.length);
  }, [data, service, filtLines, direction]);

  const alertData = processAlertData();

  // Create timeline items from processed data
  const renderTimelineItems = (): JSX.Element[] =>
    alertData.map((item, index) => {
      const alerts: ProcessedAlert = {
        service: ArrayUtils.uniqueValues(item.alerts, (service) => service.route),
        heading: ArrayUtils.uniqueValues(item.alerts, (service) => service.heading),
        type: ArrayUtils.uniqueValues(item.alerts, (service) => service.alert_type),
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



  return (
    <div className=' bg-zinc-900'>
      <AccordionContext.Provider value={accordionContextValue}>
        <div className='bg-zinc-800 sticky top-0 z-10  '>
          <FilterControls
            stopNames={[...new Set(stopNamedata)]}
            setSummary={setSummary}
            summary={summary}
            homeStation={homeStation}
            setHomeStation={setHomeStation}
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
          className={`${summary ? '' : `before:${objects.lineColors[filtLines]}`} ${loading ? 'animate-pulse' : ''
            } content relative  iphone-14pro-max:justify-center sm:justify-between  `}
        >
          <div className='flex justify-stretch '>
            {loading ? (
              <LoadingSkeleton />
            ) : (
              <div className={`${summary ? 'hidden' : 'relative'} sm:min-w-[430px] xl:w-[40%] md:w-[60%] `}>
                <section>{isExpanded ? renderTimelineItems() : renderTimelineItems().slice(0, 5)}</section>
                {alertData.length > 6 && (
                  <>
                    <section
                      onClick={() => setIsExpanded(!isExpanded)}
                    >
                      <TimelineItem
                        filtLines={filtLines}
                        index={-2}
                        customTitle={isExpanded ? `collapse stations` : `${alertData.length - 6
                          } more stations affected`}
                        isSpecial={true}
                        alerts={isExpanded ? {
                          service: [],
                          heading: [],
                          type: [
                            ` show less`,
                          ],
                        } : {
                          service: [],
                          heading: [],
                          type: [
                            ` show ${alertData.length - 6} more stations with alerts`,
                          ],
                        }}
                      />
                    </section>
                    <section>{isExpanded ? '' : renderTimelineItems().slice(-1)}</section>
                  </>
                )}
                <EndMarker linecolors={filtLines} objects={objects} />
              </div>
            )}
            <div className={` iphone-14pro-max:mx-5 max-w-[40rem] xl:mx-5 grow  ${summary ? 'block' : 'hidden'}  ${loading ? 'md:hidden' : 'md:block'}`}>
              <AlertSummary data={data} homestation={homeStation} stopnamedata={stopnames} />
            </div>
          </div>
        </div>
      </AccordionContext.Provider>
    </div>
  );
}

export default MtaTracker;
