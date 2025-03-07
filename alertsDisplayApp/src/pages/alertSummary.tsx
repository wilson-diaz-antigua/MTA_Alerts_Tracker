const alertSummary = () => {
	return (
		<main className='text-slate-50 font-bold text-xl'> 
			<section className="pt-8 pb-2 pl-5 max-w-[90%] border-slate-50 border-b-2">active alerts</section>
			

			<section  className="pt-8 pb-2 pl-5 max-w-[90%] border-slate-50 border-b-2">weekend alerts</section>

			<section  className="pt-8 pb-2 pl-5 max-w-[90%] border-slate-50 border-b-2">upcomming alerts</section>
		</main>
	);
};

export default alertSummary;
