/**
 * Loading Skeleton Component for timeline display
 * @returns {JSX.Element} Loading skeleton with animation
 */
const LoadingSkeleton = () => (
	<div
		role='status'
		className='max-w-sm ml-[5.8rem] md:ml-[12rem] lg:ml-[14.4rem] animate-pulse'
	>
		{[...Array(5)].map((_, i) => (
			<div className='mt-10 flex items-center' key={i}>
				<div className='border-8 border-zinc-900 flex items-center justify-center w-7 h-7 bg-slate-50 rounded-full'></div>
				<div className='ml-4 h-3 bg-slate-50 w-52 rounded-full'></div>
			</div>
		))}
	</div>
);

export default LoadingSkeleton;
