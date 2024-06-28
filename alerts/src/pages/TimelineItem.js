import { useContext } from "react";
import stopNames from "../../../stopNames.json";
import { AccordionContext } from "./index.js";
const TimelineItem = (props) => {
  const { accordionOpen, setAccordionOpen } = useContext(AccordionContext);
  const open = accordionOpen === props.index;
  console.log(open);
  return (
    <>
      <div className={`content ${accordionOpen ? "mb-0" : "mb-10"}`}>
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
              {props.alerts["service"].map((serviceIter, index) => {
                return (
                  <li
                    key={index}
                    className={`items ${props.className[serviceIter]}`}
                  >
                    {serviceIter}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <div className="mt-0">
          <button
            onClick={() => {
              setAccordionOpen(open ? null : props.index);
            }}
            className={`self-start font-bold text-slate-50   mt-2${
              open
                ? " ml-2 inline-block bg-slate-50 text-slate-900  rounded-e-md relative  px-2  before:content-[''] before:absolute before:h-0 before:w-0 before:top-[0px] before:left-[-24px] before:border-[12px]  before:border-r-slate-50 before:border-l-transparent before:border-y-transparent border-solid "
                : "bg-slate-900"
            } `}
          >
            <span>{stopNames[props.stop.stop].stop_name}</span>
          </button>

          <div
            className={`grid transition-all duration-300 ease-in-out text-slate-600 text-sm ${
              !open
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0 overflow-hidden"
            }`}
          >
            <div className="overflow-hidden ">
              {props.alerts["type"].map((alertTypeIter, index) => {
                return <ul key={index}>{alertTypeIter}</ul>;
              })}
            </div>
          </div>

          <div
            className={`grid transition-all duration-300 ease-in-out text-slate-600 text-sm ${
              open
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0 overflow-hidden"
            }`}
          >
            <div className="mt-2 overflow-hidden">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TimelineItem;
