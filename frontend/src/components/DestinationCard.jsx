export default function DestinationCard({ image, title, region, description }) {
  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <img src={image} alt={title} className="h-52 w-full object-cover" />
      <div className="p-5">
        <p className="text-xs font-bold uppercase text-peacock dark:text-cyan-300">
          {region}
        </p>
        <h3 className="mt-2 text-xl font-bold text-slate-950 dark:text-white">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
      </div>
    </article>
  );
}
