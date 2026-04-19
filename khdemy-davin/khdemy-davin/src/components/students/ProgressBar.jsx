const COLOR = {
  indigo: { bar: "bg-indigo-500" },
  sky:    { bar: "bg-sky-500" },
  pink:   { bar: "bg-pink-500" },
  amber:  { bar: "bg-amber-500" },
  violet: { bar: "bg-violet-500" },
  emerald:{ bar: "bg-emerald-500" },
  rose:   { bar: "bg-rose-500" },
}

export default function ProgressBar({ pct, colorKey = "indigo", h = "h-1.5" }) {
  const c = COLOR[colorKey] || COLOR.indigo
  return (
    <div className={"w-full " + h + " rounded-full bg-slate-100 overflow-hidden"}>
      <div
        className={"h-full rounded-full transition-all duration-500 " + c.bar}
        style={{ width: pct + "%" }}
      />
    </div>
  )
}