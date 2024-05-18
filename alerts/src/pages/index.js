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
    <ul className="-my-6">
      {data.map((stop) => {
        return (
          <div key={stop.id} className="timelineItem group">
            <div className=" group-last:before:hidden verticalLine">
              <li className="rightInfo">{stop.stop}</li>
            </div>
            <ul className="leftInfo">
              {stop.alert.map((alert, index) => {
                let routes = [new Set(alert.route)];
                return (
                  <div key={index}>
                    <li className="items">{routes}</li>
                  </div>
                );
              })}
            </ul>

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
    </ul>
  );
}

export default Index;
