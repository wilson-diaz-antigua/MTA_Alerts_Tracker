import { createContext, useEffect, useState } from "react";
import objects from "../../../themes.json";
import FilteredAlerts from "./FilteredAlerts.js";
import TimelineItem from "./TimelineItem";

export const AccordionContext = createContext();
let colors = "bg-MTAred bg-MTAgreen bg-MTAmagenta bg-MTAblue";
let beforecolors =
  "before:bg-MTAred before:bg-MTAgreen before:bg-MTAmagenta before:bg-MTAblue";
function Index() {
  const [accordionOpen, setAccordionOpen] = useState(false);
  const [data, setdata] = useState([]);
  const [filtLines, setFiltLines] = useState("broadway");
  const [service, setService] = useState("x");
  const [direction, setDirection] = useState("Both Directions");
  const [stop, setStop] = useState("101");
  const testClick = (event, id) => {
    setStop(id);
  };

  let terminal = {
    Northbound: [
      "Astoria-bound",
      "96 St-bound",
      "Jamaica Center-bound",
      "Jamaica-bound",
      "Northbound",
      "Norwood-bound",
      "Pelham Bay-bound",
      "Queens-bound",
      "Wakefield-bound",
      "Woodlawn-bound",
      "uptown",
      "manhattan-bound",
      "8 Av-bound",
      "Bronx-bound",
    ],

    Southbound: [
      "Flushing",
      "Atlantic Av-bound",
      "Brighton Beach-bound",
      "Brooklyn-bound",
      "Church Av-bound",
      "Court Sq-bound",
      "Dyre Av-bound",
      "Forest Hills-bound",
      "Lots Av-bound",
      "Southbound",
      "Tottenville-bound",
      "Trade Center-bound",
      "coney Island-bound",
      "downtown",
      "Flushing-bound",
    ],
    "Both Directions": null,
  };
  useEffect(() => {
    fetch("http://localhost:6543/api/stops")
      .then((res) => res.json())
      .then((data) => {
        setdata(data);
      });
  }, []);

  const filteredItems = data.filter((x) => {
    return service == "x"
      ? objects.serviceByLines[filtLines].includes(x.stop[0])
      : service.includes(x.stop[0]);
  });

  let dir =
    terminal[direction] &&
    terminal[direction].map((item) => item.toLowerCase());

  // const startStop = filteredItems.findIndex((obj) => obj.stop == stop);
  // const indexOf = filteredItems.findIndex((obj) => obj.stop == "42");
  let data2 = filteredItems
    .map((stops) => {
      return {
        stop: stops.stop,
        alert: stops.alert.filter((alerts) => {
          if (dir) {
            return dir.includes(
              alerts.direction
                ? alerts.direction.toLowerCase()
                : alerts.direction
            );
          } else {
            return alerts;
          }
        }),
      };
    })
    .filter((item) => {
      return item.alert.length;
    });

  // let dir = filteredItems.map((element) => {
  //   return [...new Set(element.alert.map((element) => element.direction))];
  // });
  // dir = dir.flat();
  // dir = dir.filter((item, index) => {
  //   return dir.indexOf(item) === index;
  // });
  // console.log(dir);
  console.log(data2);
  const data1 = () =>
    data2.map((item, index) => {
      const alerts = {
        service: [
          ...new Set(
            item.alert.map((service) => {
              return service.route;
            })
          ),
        ],
        heading: [
          ...new Set(
            item.alert.map((service) => {
              return service.heading;
            })
          ),
        ],
        type: [
          ...new Set(
            item.alert.map((service) => {
              return service.alert_type;
            })
          ),
        ],
      };
      console.log(item);
      return (
        <>
          <AccordionContext.Provider
            value={{ accordionOpen, setAccordionOpen }}
          >
            <TimelineItem
              key={item.stop}
              index={index}
              alerts={alerts}
              className={objects.serviceColors}
              stop={item}
            />
          </AccordionContext.Provider>
        </>
      );
    });

  return (
    <div className=" pb-[100%] bg-zinc-900">
      <section className="  flex  pt-10 ml-[05rem] sm:ml-[10rem]  md:ml-[10rem]  lg:ml-[13rem]">
        <div className="w-20 h-20 justify-self-end ">
          <FilteredAlerts
            data={objects.serviceByLines[filtLines]}
            state={service}
            setState={(e) => {
              setService(e.target.value);
            }}
            className={` pt-2 route ${objects.lineColors[filtLines]} `}
            value={true}
          />
        </div>
        <div>
          <div className="ml-5">
            <FilteredAlerts
              setState={(e) => {
                setService("x");
                setFiltLines(e.target.value);
              }}
              state={filtLines}
              data={objects.serviceByLines}
              className={
                "  content-center h-auto pt-1 text-2xl font-black uppercase bg-transparent hb-20 justify-self-start text-slate-50"
              }
              value={false}
            />
          </div>
          <div className="ml-5 ">
            <FilteredAlerts
              setState={(e) => {
                setService("x");
                setDirection(e.target.value);
              }}
              data={terminal}
              state={direction}
              className={
                "  content-center h-auto pt-2  text-1xl font-black uppercase bg-transparent hb-20 justify-self-start text-slate-50"
              }
              value={false}
            />
          </div>
        </div>
      </section>
      <div
        className={` content relative
          before:${objects.lineColors[filtLines]}`}
      >
        <div className="relative">
          <section>{data1()}</section>
        </div>
      </div>
    </div>
  );
}

export default Index;
