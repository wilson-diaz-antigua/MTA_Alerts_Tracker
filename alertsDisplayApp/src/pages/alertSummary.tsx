
import stopNames from '../../util/stopNames.json';
import objects from '../../util/subwayLineColors.json';
import useMtaData from "../hooks/useMTAData";

//TODO: select a home station and show alerts for that station
//TODO: animate alert summary after clicking on button


interface StopData {
	stop: string[];
	alerts: Alert[];
}
interface Alert {
	activePeriod: DateRange[];
	heading: string;
}

interface DateRange {
	start: number;
	end?: number;
}

const dates: DateRange[] = [
	{
		"start": 1742868000,
		"end": 1742877900
	},
	{
		"start": 1742954400,
		"end": 1742964300
	},
	{
		"start": 1743040800,
		"end": 1743050700
	},
	{
		"start": 1743127200,
		"end": 1743137100
	},
	{
		"start": 1743472800,
		"end": 1743482700
	},
	{
		"start": 1743559200,
		"end": 1743569100
	},
	{
		"start": 1743645600,
		"end": 1743655500
	},

];

function convertTimestampToDate(timestamp: number): string {
	const date = new Date(timestamp * 1000);
	return date.toISOString().split('T')[0];
}
function getWeekendTimestamps() {
	const now = new Date();
	const dayOfWeek = now.getDay();
	const saturday = new Date(now);
	const sunday = new Date(now);

	// Calculate the upcoming Saturday
	saturday.setDate(now.getDate() + (6 - dayOfWeek));
	saturday.setHours(0, 0, 0, 0);
	const nextsaturday = saturday.toISOString().split('T')[0]
	// Calculate the upcoming Sunday
	sunday.setDate(now.getDate() + (7 - dayOfWeek));
	sunday.setHours(0, 0, 0, 0);
	const nextsunday = sunday.toISOString().split('T')[0]
	const saturdayTimestamp = saturday.getTime() / 1000;
	const sundayTimestamp = sunday.getTime() / 1000;

	return { nextsaturday, nextsunday, saturdayTimestamp, sundayTimestamp };
};

function getHomeStation(data: StopData[], station: string): Alert[] {
	return data.filter((stop) => {
		return stop.stop.includes(station);
	}).flatMap((stop: StopData): Alert[] => {
		return stop.alerts;
	});
}


function filterAlertsByDate(data: Alert[], saturday: number[]) {
	return data.filter((datesInArray: Alert) => {
		console.log(datesInArray.activePeriod);
		return datesInArray.activePeriod.some((period: DateRange) => saturday.includes(period.start));
	});
}

function formatHeading(heading: string) {
	return heading.split(/(\[\d+\])/g).map((part, index) => {
		if (part.match(/\[\d+\]/)) {
			const number = part.replace(/\[|\]/g, '');
			return (
				<div key={index} className={` my-1 rounded-full flex-wrap justify-center items-center  inline-block w-5 h-5 text-center ${objects.serviceColors[number]}`}>
					{number}
				</div>
			);
		}
		return part;
	});
};
// TODO: create a function that filters the data to only show stops with alerts of a particular date


const alertSummary = () => {
	const { data, loading } = useMtaData();
	const today = new Date();
	const todayTimestamp = Math.floor(today.getTime() / 1000);
	const { nextsaturday, nextsunday, saturdayTimestamp, sundayTimestamp } = getWeekendTimestamps();
	const station = getHomeStation(data, "621");
	const mockStation = [
		{
			activePeriod: [{ start: todayTimestamp }],
			alert_type: 'Delays',
			dateText: {},
			direction: null,
			heading:
				'[4][5] trains are running with delays in both directions after we moved a train that had its brakes activated near 125 St.',
			route: '5'
		},
		{
			activePeriod: [{ end: 1742659200, start: 1742642100 }],
			alert_type: 'Planned - Stops Skipped',
			dateText: 'Mar 22, Saturday, 7:15 AM to 12:00 PM',
			direction: 'uptown',
			heading: 'In Manhattan, uptown [5] skips 125 St',
			route: '5'
		},
		{
			activePeriod: [{ end: 1742659200, start: 1742616060 }],
			alert_type: 'Planned - Stops Skipped',
			dateText: 'Mar 22, Saturday, 12:01 AM to 12:00 PM',
			direction: 'uptown',
			heading: 'In Manhattan, uptown [4] skips 125 St',
			route: '4'
		},
		{
			activePeriod: [{ end: 1742659200, start: 1742616060 }],
			alert_type: 'Planned - Stops Skipped',
			dateText: 'Mar 22, Saturday, 12:01 AM to 12:00 PM',
			direction: 'uptown',
			heading: 'In Manhattan, uptown [6] skips 125 St',
			route: '6'
		},
		{
			activePeriod: [{ end: 1742745600, start: 1742702460 }],
			alert_type: 'Planned - Stops Skipped',
			dateText: 'Mar 23, Sunday, 12:01 AM to 12:00 PM',
			direction: 'downtown',
			heading: 'In Manhattan, downtown [6] skips 125 St',
			route: '6'
		},
		{
			activePeriod: [{ end: 1742745600, start: sundayTimestamp }],
			alert_type: 'Planned - Stops Skipped',
			dateText: 'Mar 23, Sunday, 9:00 AM to 12:00 PM',
			direction: 'downtown',
			heading: 'In Manhattan, downtown [5] skips 125 St',
			route: '5'
		},
		{
			activePeriod: [{ end: 1742745600, start: 1742702460 }],
			alert_type: 'Planned - Stops Skipped',
			dateText: 'Mar 23, Sunday, 12:01 AM to 12:00 PM',
			direction: 'downtown',
			heading: 'In Manhattan, downtown [4] skips 125 St',
			route: '4'
		},
		{
			activePeriod: [{ end: 1744016400, start: saturdayTimestamp }],
			alert_type: 'Planned - Part Suspended',
			dateText: 'Apr 4 - 7, Fri 9:45 PM to Mon 5:00 AM',
			direction: null,
			heading: 'In the Bronx, no [6] between Hunts Point Av and 125 St',
			route: '6'
		},
		{
			activePeriod: [
				{ end: 1743498000, start: 1743471000 },
				{ end: 1743584400, start: 1743557400 },
				{ end: 1743670800, start: 1743643800 },
				{ end: 1743757200, start: 1743730200 }
			],
			alert_type: 'Planned - Part Suspended',
			dateText: 'Mar 31 - Apr 4, Mon to Fri, 9:30 PM to 5:00 AM',
			direction: null,
			heading: 'No [6] between Hunts Point Av and 125 St',
			route: '6'
		},
		{
			activePeriod: [
				{ end: 1742877900, start: saturdayTimestamp },
				{ end: 1742964300, start: 1742954400 },
				{ end: 1743050700, start: 1743040800 },
				{ end: 1743137100, start: 1743127200 },
				{ end: 1743482700, start: 1743472800 },
				{ end: 1743569100, start: 1743559200 },
				{ end: 1743655500, start: 1743645600 },
				{ end: 1743741900, start: 1743732000 }
			],
			alert_type: 'Planned - Express to Local',
			dateText: 'Mar 24 - 27 and Mar 31 - Apr 3, Mon to Thu, beginning at 10 PM',
			direction: 'downtown',
			heading:
				'In Manhattan, downtown [4] runs local from 125 St to Grand Central-42 St',
			route: '4'
		},
		{
			activePeriod: [
				{ end: 1742621400, start: 1742608800 },
				{ end: 1742707800, start: 1742637600 },
				{ end: 1742794200, start: 1742726700 },
				{ end: 1742016600, start: 1742004000 },
				{ end: 1742103000, start: 1742032800 },
				{ end: 1742189400, start: 1742121900 }
			],
			alert_type: 'Planned - Express to Local',
			dateText:
				'Mar 14 - 16 and Mar 21 - 23, Fri beginning at 10 PM, Sat and Sun, all day',
			direction: 'uptown',
			heading:
				'In Manhattan, uptown [4] runs local from Grand Central-42 St to 125 St',
			route: '4'
		},
		{
			activePeriod: [
				{ end: 1742698800, start: saturdayTimestamp },
				{ end: 1742785200, start: 1742738400 },
				{ end: 1742094000, start: saturdayTimestamp },
				{ end: 1742180400, start: 1742133600 }
			],
			alert_type: 'Planned - Express to Local',
			dateText: 'Mar 15 - 16 and Mar 22 - 23, Sat and Sun*, days and evenings',
			direction: 'uptown',
			heading:
				'In Manhattan, uptown [5] runs local from Grand Central-42 St to 125 St',
			route: '5'
		}
	]


	const weekendAlerts = filterAlertsByDate(mockStation, [saturdayTimestamp, sundayTimestamp]);
	const todayAlerts = filterAlertsByDate(mockStation, [todayTimestamp]);









	return (
		<main className='text-slate-50 font-bold text-xl'>
			<section className="pt-8 pb-2 pl-5 max-w-[90%] border-slate-50 border-b-2">active alerts   <span className='ml-1 text-base font-semibold text-zinc-400'>{stopNames['621'].stop_name}</span></section>
			{todayAlerts.map((alert, index) => {
				return (
					<div key={index} className="pl-5 w-[90%]">
						<div className="text-sm font-medium">{formatHeading(alert.heading)}</div>

					</div>
				)
			})}

			<section className="pt-8 pb-2 pl-5 max-w-[90%] border-slate-50 border-b-2">weekend alerts <span className='ml-1 text-base font-semibold text-zinc-400'>{stopNames['621'].stop_name}</span></section>
			{weekendAlerts.map((alert, index) => {
				return (
					<div key={index} className="pl-5 w-[90%]">
						<div className="text-sm font-medium">{formatHeading(alert.heading)}</div>

					</div>
				)
			})}

		</main>
	);
};

export default alertSummary;
