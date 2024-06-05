import { useEffect, useState } from "react";
import objects from "../../../themes.json";
import FilteredAlerts from "./FilteredAlerts.js";
import TimelineItem from "./TimelineItem";
let colors = "bg-MTAred bg-MTAgreen bg-MTAmagenta bg-MTAblue";

function Index() {
  const [data, setdata] = useState([]);
  const [filtLines, setFiltLines] = useState("broadway");
  const [service, setService] = useState("x");
  const [direction, setDirection] = useState("downtown");
  const [stop, setStop] = useState("101");
  const testClick = (event, id) => {
    setStop(id);
  };

  useEffect(() => {
    fetch("http://localhost:8080/api/stops")
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

  const startStop = filteredItems.findIndex((obj) => obj.stop == stop);
  const indexOf = filteredItems.findIndex((obj) => obj.stop == "42");

  const data1 = () =>
    filteredItems.map((item, index) => {
      // let item = nitem.alert.filter((item) => {
      //   return item;
      // });
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
        <TimelineItem
          key={item.stop}
          setState={(event) => testClick(event, item.stop)}
          alerts={alerts}
          className={objects.serviceColors}
          stop={item}
        />
      );
    });

  return (
    <div className="pb-10 bg-zinc-900">
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
        <div className="ml-5">
          <FilteredAlerts
            setState={(e) => {
              setService("x");
              setFiltLines(e.target.value);
            }}
            data={objects.serviceByLines}
            className={
              "  content-center h-auto pt-5 ml-4 text-2xl font-black uppercase bg-transparent hb-20 justify-self-start text-slate-50"
            }
            value={false}
          />
        </div>
      </section>
      <div
        className={` container relative
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
