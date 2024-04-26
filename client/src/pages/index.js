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
    <div>
      {data.map((stop, index) => (
        <div key={index}>{stop.stop}</div>
      ))}
    </div>
  );
}

export default index;
