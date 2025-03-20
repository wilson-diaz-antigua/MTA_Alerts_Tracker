import { useEffect, useState } from "react";
import objects from "../../util/subwayLineColors.json";
import {
	convertTimestampToDate,
	filterAlertsByDate,
	findstopNamebyID,
	getHomeStation,
	getWeekendTimestamps,
} from "../utils/alertUtils";

//TODO: select a home station and show alerts for that station
//TODO: animate alert summary after clicking on button
function formatHeading(heading: string) {
	return heading.split(/(\[\w+\])/g).map((part, index) => {
		if (part.match(/\[\w?\]/)) {
			const trainLine = part.replace(/\[|\]/g, "");
			return (
				<div
					key={index}
					className={`my-1 inline-block h-5 w-[20px] items-center justify-center rounded-full text-center ${objects.serviceColors[trainLine]}`}
				>
					{trainLine}
				</div>
			);
		}
		return part;
	});
}

const AlertSummary = (props) => {
	// Add client-side rendering control
	const [isClient, setIsClient] = useState(false);

	// Moved data processing to useEffect to ensure it runs client-side only
	const [todayAlerts, setTodayAlerts] = useState([]);
	const [weekendAlerts, setWeekendAlerts] = useState([]);

	useEffect(() => {
		setIsClient(true);

		const today = new Date();
		const todayTimestamp = convertTimestampToDate(
			Math.floor(today.getTime() / 1000),
		);
		const { nextsaturday, nextsunday, saturdayTimestamp, sundayTimestamp } =
			getWeekendTimestamps();

		const findstopNameID =
			props.stopnamedata && props.homestation
				? findstopNamebyID(props.stopnamedata, props.homestation)
				: "";

		// Only try to get station data if we have a valid stop ID
		const station = findstopNameID
			? getHomeStation(props.data, findstopNameID)
			: [];

		setTodayAlerts(filterAlertsByDate(station, [todayTimestamp]));
		setWeekendAlerts(filterAlertsByDate(station, [nextsaturday, nextsunday]));
	}, [props.data, props.stopnamedata, props.homestation]);

	// Return fallback UI while client-side rendering is not ready
	if (!isClient) {
		return (
			<main className="text-xl font-bold text-slate-50">
				<section className="max-w-[90%] border-b-2 border-slate-50 pb-2 pl-5 pt-8">
					Loading alerts...
				</section>
			</main>
		);
	}

	// Rest of your component with client-side rendering
	return (
		<main className="text-xl font-bold text-slate-50 md:mr-3 lg:mr-10">
			<section className="truncate border-b-2 border-slate-50 pb-2 pt-8">
				active alerts{" "}
				<span className="ml-1 text-base font-semibold text-zinc-400">
					{props.homestation}
				</span>
			</section>
			{todayAlerts.length > 0 ? (
				todayAlerts.map((alert, index) => {
					return (
						<div key={index} className="pl-5 pt-2">
							<div className="text-sm font-medium">
								{formatHeading(alert.heading)}
							</div>
						</div>
					);
				})
			) : (
				<div className="pl-5 pt-2">
					<div className="text-sm font-medium">No alerts for today.</div>
				</div>
			)}

			<section className="truncate border-b-2 border-slate-50 pb-2 pt-8">
				weekend alerts{" "}
				<span className="ml-1 text-base font-semibold text-zinc-400">
					{props.homestation}
				</span>
			</section>
			{weekendAlerts.length > 0 ? (
				weekendAlerts.map((alert, index) => {
					return (
						<div key={index} className="pl-5 pt-2">
							<div className="text-sm font-medium">
								{formatHeading(alert.heading)}
							</div>
						</div>
					);
				})
			) : (
				<div className="pl-5 pt-2">
					<div className="text-sm font-medium">
						No alerts for the upcoming weekend.
					</div>
				</div>
			)}
		</main>
	);
};

export default AlertSummary;
