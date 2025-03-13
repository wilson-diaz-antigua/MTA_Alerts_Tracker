import stopNames from '../../util/stopNames.json';
import { Alert, DateRange, StopData, StopNameObject } from "./alertTypes";

/**
 * Selects and returns an array of stop name objects based on the provided stop IDs.
 *
 * @param {string[]} stop - An array of stop IDs to be selected.
 * @returns {StopNameObject[]} An array of objects containing the stop ID and stop name.
 *
 * @example
 * const stops = ['123', '456'];
 * const result = selectStopName(stops);
 * // result might be [{ stop_id: '123', stop_name: 'Stop 123' }, { stop_id: '456', stop_name: 'Stop 456' }]
 */
export function selectStopName(stop: string[]): StopNameObject[] {
    let stopName = new Set<StopNameObject>();

    for (const [key, value] of Object.entries(stopNames)) {
        if (stop.includes(key[0])) {
            stopName.add({ stop_id: key.slice(0, 3), stop_name: value.stop_name });
        }
    }

    return Array.from(stopName);
}


/**
 * Finds the stop ID by the given stop name or stop ID.
 *
 * @param {StopNameObject[]} data - An array of stop name objects.
 * @param {string} homeStation - The stop name or stop ID to search for.
 * @returns {string} - The stop ID of the matching station, or an empty string if no match is found.
 *
 * @throws Will log an error message if the provided data is invalid or if no matching station is found.
 */
export function findstopNamebyID(data: StopNameObject[], homeStation: string): string {
    // Check if data exists and is an array
    if (!data || !Array.isArray(data)) {
        console.error("Invalid station data provided");
        return "";
    }
    // Check if any matching stations were found
    const filt = data.filter(
        (item) => item.stop_name === homeStation || item.stop_id === homeStation
    );
    if (filt.length === 0) {
        console.error(`No station found matching "${homeStation}"`);
        return "";
    }
    return filt[0].stop_id;
}

/**
 * Converts a Unix timestamp to a date string in the format 'YYYY-MM-DD'.
 *
 * @param {number} timestamp - The Unix timestamp to convert, in seconds.
 * @returns {string} The formatted date string.
 */
export function convertTimestampToDate(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    return date.toISOString().split('T')[0];
}

/**
 * Calculates the timestamps for the upcoming Saturday and Sunday.
 *
 * @returns An object containing:
 * - `nextsaturday`: The date string (YYYY-MM-DD) for the upcoming Saturday.
 * - `nextsunday`: The date string (YYYY-MM-DD) for the upcoming Sunday.
 * - `saturdayTimestamp`: The Unix timestamp (in seconds) for the upcoming Saturday at midnight.
 * - `sundayTimestamp`: The Unix timestamp (in seconds) for the upcoming Sunday at midnight.
 */
export function getWeekendTimestamps() {
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
}

/**
 * Retrieves alerts for a specific home station from the provided stop data.
 *
 * @param {StopData[]} data - An array of stop data objects.
 * @param {string} station - The name of the home station to filter alerts for.
 * @returns {Alert[]} An array of alerts associated with the specified home station.
 */
export function getHomeStation(data: StopData[], station: string): Alert[] {
    return data.filter((stop) => {
        return stop.stop.includes(station);
    }).flatMap((stop: StopData): Alert[] => {
        return stop.alerts;
    });
}

/**
 * Filters the alerts based on the given date array.
 *
 * @param {Alert[]} data - The array of alerts to be filtered.
 * @param {string[]} saturday - The array of dates to filter the alerts by.
 * @returns {Alert[]} The filtered array of alerts that are active on the given dates.
 */
export function filterAlertsByDate(data: Alert[], saturday: string[]) {
    return data.filter((datesInArray: Alert) => {
        console.log(datesInArray.activePeriod);
        return datesInArray.activePeriod.some((period: DateRange) => saturday.includes(convertTimestampToDate(period.start)));
    });
}

