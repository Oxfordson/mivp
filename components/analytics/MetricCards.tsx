interface MetricCardsProps {
  totalEligible: number;
  totalAccredited: number;
  totalVotesCast: number;
  overallTurnout: number;
}

export default function MetricCards({
  totalEligible,
  totalAccredited,
  totalVotesCast,
  overallTurnout,
}: MetricCardsProps) {
  const cards = [
    { label: 'Eligible Staff', value: totalEligible, unit: 'Members', color: 'text-slate-900' },
    { label: 'Accredited', value: totalAccredited, unit: 'Verified', color: 'text-blue-700' },
    { label: 'Valid Votes Cast', value: totalVotesCast, unit: 'Recorded', color: 'text-emerald-600' },
    { label: 'Turnout Rate', value: `${overallTurnout}%`, unit: 'Of accredited pool', color: 'text-indigo-600' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{card.label}</p>
          <p className={`text-3xl font-bold mt-2 font-mono ${card.color}`}>{card.value}</p>
          <p className="text-xs text-slate-400 mt-1">{card.unit}</p>
        </div>
      ))}
    </div>
  );
}