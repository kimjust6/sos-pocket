export default function Tooltip({
  tip,
  hidden = false,
  children,
  classNames = "",
}: {
  tip: string;
  hidden?: boolean;
  children: React.ReactNode;
  classNames?: string;
}) {
  if (hidden) {
    return <>{children}</>;
  } else {
    {
      return (
        <div className="group relative flex">
          {children}
          <span
            className={`flex items-center outline-1 outline outline-stone-200 fixed whitespace-nowrap 
                            left-12 scale-0 transition-all rounded bg-zinc-800 p-2 text-xs text-white group-hover:scale-100 ${classNames}`}
          >
            {tip}
          </span>
        </div>
      );
    }
  }
}
