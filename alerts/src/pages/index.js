import { useEffect, useState } from "react";
import routeNames from "../../../stops.json";
function Index() {
  const [data, setdata] = useState([]);
  const [filtered, setfilter] = useState('broadway');
 const [lines, setlines] = useState('x');
 
 
 
  
  const handleChangeFilter = (event) => {
  setlines('x')  
 setfilter(event.target.value);
  
  };

  let stops = {
    'broadway': ["1", "2", "3"],
    'lexington': ["4", "5", "6"],
    "queens blvd": ["7"],
    "8th ave":["A","B","C","E"],
  };
  let stopColors = {
    broadway: "bg-MTAred",
    lexington: "bg-MTAgreen",
    "queens blvd": "bg-MTAmagenta",
    "8th ave": "bg-MTAblue",
  };
  let stopLineColors = {
    broadway: "before:bg-MTAred",
    lexington: "before:bg-MTAgreen",
    "queens blvd": "before:bg-MTAmagenta",
    "8th ave": "before:bg-MTAblue",
  };
  
  
let lineColors = {
  1: "bg-MTAred",
  2: "bg-MTAred",
  3: "bg-MTAred",
  4: "bg-MTAgreen",
  5: "bg-MTAgreen",
  6: "bg-MTAgreen",
  7: "bg-MTAmagenta",
  "A":"bg-MTAblue",
  "B":"bg-MTAblue",
  "C":"bg-MTAblue",
  "E":"bg-MTAblue",
};



  useEffect(() => {
    fetch("http://localhost:8080/api/stops")
      .then((res) => res.json())
      .then((data) => {
        setdata(data);
      });
  }, []);

  

    const filteredItems = data.filter((x) => {
      return lines == "x"
        ? stops[filtered].includes(x.stop[0])
        : lines.includes(x.stop[0]);
    });
    
    const startStop = filteredItems.findIndex((obj) => obj.stop == "120");
    
    
    
    const data1 =() => filteredItems.map((item, id) => {
      
    
    const alerts = ({ 'route':[
      ...new Set(
        item.alert.map((routes) => {
          
          return routes.route;
        })

        
      )],
      'type': [
       ...new Set(
         item.alert.map((routes) => {
           return routes.alert_type;
         })
       ),
     ]
    })
    

    return (
      <>
       
        <div className="content">
          <div className=" timelineItem">
            <div className="icon">
              <svg
                className=" fill-amber-200"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
              >
                <path d="M8 0a8 8 0 1 0 8 8 8.009 8.009 0 0 0-8-8Zm0 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" />
              </svg>
            </div>
            <div className="leftSide ">
              <ul className="leftcont">
                {alerts['route'].map((item) => {
                  
                  return <li className= {"items " + lineColors[item]}>{item} </li>;
                })}
              </ul>
            </div>
          </div>

          <div className="flex flex-row items-start justify-start h-10 ml-0 space-x-2 mt-[2.9rem] text-slate-500">
            <div className="self-start font-bold text-slate-50">
              {routeNames[item.stop].stop_name}
            </div>
            <ul className="self-start">
              {alerts['type'].map((item) => {
                return <li>{item}</li>;
              })}
            </ul>
          </div>
        </div>
      </>
    );
  });

  return (
    <div className="pb-10 bg-zinc-900">
      <section className="flex  pt-10 ml-[05rem] sm:ml-[10rem]  md:ml-[10rem]  lg:ml-[13rem]">
        <div className="w-20 h-20 justify-self-end">
          <select
            defaultValue="x"
            className={"pt-2 route " + stopColors[filtered]}
            name="filter"
            id="filter"
            value={lines}
            onChange={(e) => {
              setlines(e.target.value);
            }}
          >
            <option>x</option>
            {Object.values(stops[filtered]).map((item) => {
              return <option className="appearance-none">{item}</option>;
            })}
          </select>
        </div>
        <div className="ml-10">
          <select
            className="content-center h-auto pt-5 ml-4 text-2xl font-black uppercase bg-transparent hb-20 justify-self-start text-slate-50"
            name="filter"
            id="filter"
            value={filtered}
            onChange={handleChangeFilter}
          >
            {Object.keys(stops).map((item) => {
              return <option className="">{item}</option>;
            })}
          </select>
         
        </div>
      </section>

      <div className={`container relative ${stopLineColors[filtered]}`}>
        <div className="relative">
          <section>{data1()}</section>
        </div>
      </div>
    </div>
  );
}

export default Index;
