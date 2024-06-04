import { useEffect, useState } from "react";
import stopNames from "../../../stops.json";
import objects from "../../../themes.json";
import FilteredAlerts from "./FilteredAlerts.js";
import TimelineItem from "./TimelineItem.js";

function Index() {
  const [data, setdata] = useState([]);
  const [filtLines, setFiltLines] = useState("broadway");
  const [service, setService] = useState("x");
  const [direction, setDirection] = useState("downtown");
  const [stop, setStop] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/stops")
      .then((res) => res.json())
      .then((data) => {
        setdata(data);
        setStop(data[0].stop);
      });
  }, []);

  const filteredItems = data.filter((x) => {
    return service == "x"
      ? objects.serviceByLines[filtLines].includes(x.stop[0])
      : service.includes(x.stop[0]);
  });
  console.log(stop);
  const startStop = filteredItems.findIndex((obj) => obj.stop == "120");
  const data1 = () =>
    filteredItems.map((item, id) => {
      const alerts = {
        service: [
          ...new Set(
            item.alert.map((service) => {
              return service.route;
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

      return (
        <>
          <TimelineItem
            key={id}
            setState={(e) => {
              setStop(e.currentTarget.textContent);
            }}
            alerts={alerts}
            lineColor={objects.serviceColors}
            stop_name={stopNames[item.stop].stop_name}
          ></TimelineItem>
        </>
      );
    });

  return (
    <div className="pb-10 bg-zinc-900">
      <section className="  flex  pt-10 ml-[05rem] sm:ml-[10rem]  md:ml-[10rem]  lg:ml-[13rem]">
        <div className="w-20 h-20 justify-self-end ">
          <FilteredAlerts
            lineColors={objects.lineColors}
            data={objects.serviceByLines[filtLines]}
            state={service}
            setState={(e) => {
              setService(e.target.value);
            }}
            tailwind={` pt-2 route ${objects.lineColors[filtLines]} `}
            value={true}
          ></FilteredAlerts>
        </div>
        <div className="ml-5">
          <FilteredAlerts
            setState={(e) => {
              setService("x");
              setFiltLines(e.target.value);
            }}
            data={objects.serviceByLines}
            tailwind={
              "  content-center h-auto pt-5 ml-4 text-2xl font-black uppercase bg-transparent hb-20 justify-self-start text-slate-50"
            }
            value={false}
          ></FilteredAlerts>
          {/* <FilteredAlerts
            data={["uptown", "downtown"]}
            state={direction}
            setState={(e) => {
              setDirection(e.target.value);
            }}
            tailwind={`block  content-center h-auto pt-1 ml-4 text-1xl font-black uppercase bg-transparent hb-20 justify-self-start text-slate-50 `}
            value={true}
          ></FilteredAlerts> */}
        </div>
      </section>
      {console.log(filtLines)}
      <div
        className={`container relative ${objects.timelineLineColors[filtLines]}`}
      >
        <div className="relative">
          <section>{data1()}</section>
        </div>
      </div>
    </div>
  );
}

export default Index;
