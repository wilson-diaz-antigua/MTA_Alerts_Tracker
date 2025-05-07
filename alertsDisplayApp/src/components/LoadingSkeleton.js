/**
 * Loading Skeleton Component for timeline display
 * @returns {JSX.Element} Loading skeleton with animation
 */
const LoadingSkeleton = () => (
  <div
    role="status"
    className="ml-[5.8rem] max-w-sm animate-pulse md:ml-[12rem] lg:ml-[14.4rem]"
  >
    {[...Array(5)].map((_, i) => (
      <div className="mt-10 flex items-center" key={i}>
        <div className="flex h-7 w-7 items-center justify-center rounded-full border-8 border-zinc-900 bg-slate-50"></div>
        <div className="ml-4 h-3 w-52 rounded-full bg-slate-50"></div>
      </div>
    ))}
  </div>
);

export default LoadingSkeleton;
