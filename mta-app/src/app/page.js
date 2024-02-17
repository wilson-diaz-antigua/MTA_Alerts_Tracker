"use client";
import { useEffect, useState } from "react";

function page() {
  let [data, setData] = useState([{}]);
  useEffect(() => {
    fetch("/ ")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });
  }, []);
  return <div></div>;
}

export default page;