interface ActivityCardProps {
  // eslint-disable-next-line react/require-default-props
  skeleton?: boolean;
}

function ActivityCard({ skeleton }: ActivityCardProps) {
  if (skeleton) {
    return (
      <div className="p-4 rounded border border-slate-100 list-none w-full min-h-[200px] flex flex-col justify-between">
        <div className="card-title flex flex-col gap-1">
          <div className="w-1/2 h-7 mb-2 bg-slate-100 rounded animate-pulse" id="title" />
          <div className="w-full h-5 bg-slate-100 rounded animate-pulse" />
          <div className="w-2/3 h-5 bg-slate-100 rounded animate-pulse" />
        </div>

        <div className="w-1/3 h-6 bg-slate-100 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <li className="p-4 rounded border border-slate-100 hover:border-slate-300 list-none w-full hover:shadow-lg hover:shadow-slate-100 cursor-pointer transition-all duration-300 ease-in-out min-h-[200px] flex flex-col justify-between">
      <div className="card-title">
        <h3 className="text-lg md:text-xl">Activity</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
      </div>

      <span id="time">
        {new Date().toDateString().slice(3, 25)}
      </span>
    </li>
  );
}

export default ActivityCard;
