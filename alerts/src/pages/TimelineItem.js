import stopNames from "../../../stopNames.json";

const TimelineItem = (props) => {
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
              {props.alerts["service"].map((serviceIter) => {
                let lineThemes = props.lineColor[serviceIter];
                return <li className={`items ${lineThemes}`}>{serviceIter}</li>;
              })}
            </ul>
          </div>
        </div>

        <div className="flex flex-row items-start justify-start h-10 ml-0 space-x-2 mt-[2.9rem] text-slate-500">
          <button
            onClick={props.setState}
            className="self-start font-bold text-slate-50"
          >
            {stopNames[props.stop.stop].stop_name}
          </button>
          <ul className="self-start">
            {props.alerts["type"].map((alertTypeIter) => {
              return <li>{alertTypeIter}</li>;
            })}
          </ul>
        </div>
      </div>
    </>
  );
};

export default TimelineItem;
