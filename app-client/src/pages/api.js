import { useEffect, useState } from "react";

function Api() {
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
          </div>
        );
      })}
    </>
  );
}

export default Api;
