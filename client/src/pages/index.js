import { useEffect, useState } from "react";

function index() {
  const [data, setdata] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/stops")
      .then((res) => res.json())
      .then((data) => {
        setdata(data);
      });
  }, []);

  return (
    <>
      {data.map((stop) => {
        return (
          <div key={stop.id} className="group flex relative">
            <h1 className="bg-red-400 text-white px-2 py-1">{stop.stop}</h1>
            {stop.alert.map((alert, index) => {
              return (
                <div
                  className="group-hover:opacity-100 transition-opacity bg-gray-800 px-1 text-sm text-gray-100 rounded-md absolute left-1/2 
    -translate-x-1/2 translate-y-full opacity-0 m-4 mx-auto"
                  key={index}
                >
                  <h2> {alert.alert_type}</h2>
                  <p>{alert.heading}</p>
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );
}

export default index;
