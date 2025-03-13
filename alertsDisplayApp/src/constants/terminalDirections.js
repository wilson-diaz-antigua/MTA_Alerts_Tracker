/**
 * Direction terminal mapping for MTA subway lines
 * Maps direction names to an array of direction phrases used in alerts
 */
const terminal = {
	Northbound: [
		'Astoria-bound',
		'96 St-bound',
		'Jamaica Center-bound',
		'Jamaica-bound',
		'Northbound',
		'Norwood-bound',
		'Pelham Bay-bound',
		'Queens-bound',
		'Wakefield-bound',
		'Woodlawn-bound',
		'uptown',
		'manhattan-bound',
		'8 Av-bound',
		'Bronx-bound',
	],
	Southbound: [
		'Flushing',
		'Atlantic Av-bound',
		'Brighton Beach-bound',
		'Brooklyn-bound',
		'Church Av-bound',
		'Court Sq-bound',
		'Dyre Av-bound',
		'Forest Hills-bound',
		'Lots Av-bound',
		'Southbound',
		'Tottenville-bound',
		'Trade Center-bound',
		'coney Island-bound',
		'downtown',
		'Flushing-bound',
	],
	'Both ways': null,
};

export default terminal;
