import { useEffect, useState } from "react";
function Index() {
  const [data, setdata] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/stops")
      .then((res) => res.json())
      .then((data) => {
        setdata(data);
      });
  }, []);

  return (
    <div className="-my-6">
      {data.map((stop) => {
        return (
          <div key={stop.id} className="timelineItem group">
            <div className=" group-last:before:hidden verticalLine">
              <div className="rightInfo">{stop.stop}</div>
            </div>
            {stop.alert.map((alert, index) => {
              return (
                <div key={index}>
                  <ul className="leftInfo">
                    <li className="items">{alert.route}</li>
                  </ul>
                </div>
              );
            })}
            {console.log(stop.alert)}
            {stop.alert.map((alert, index) => {
              return (
                <div key={index}>
                  <div div className="">
                    <div className="text-slate-500">{alert.alert_type}</div>
                    <div className="text-slate-500">{alert.heading}</div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default Index;
