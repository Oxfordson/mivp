'use client';

import { useState } from 'react';
import { castVoteAction } from '@/actions/voting';
import { BallotItem } from '@/types/database.types';
import { Button } from '@/components/ui/Button';

interface BallotCardProps {
  item: BallotItem;
  eventId: string;
  staffId: string;
  isAnonymous: boolean;
  disabled: boolean;
}

export default function BallotCard({
  item,
  eventId,
  staffId,
  isAnonymous,
  disabled,
}: BallotCardProps) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleVote = async () => {
    const confirmed = window.confirm(`Confirm your choice for: "${item.title}"? This cannot be undone.`);
    if (!confirmed) return;

    setLoading(true);
    setErrorMsg(null);

    const result = await castVoteAction({
      eventId,
      ballotItemId: item.id,
      staffId,
      isAnonymous,
    });

    if (!result.success) {
      setErrorMsg(result.error || 'Submission failed.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between hover:border-slate-300 transition">
      <div>
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="font-semibold text-slate-900 text-lg">{item.title}</h4>
            {item.subtitle && <p className="text-sm text-slate-500 mt-0.5">{item.subtitle}</p>}
          </div>
          <span className="text-xs uppercase font-mono px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
            {item.target_type}
          </span>
        </div>

        {item.metadata?.manifesto && (
          <p className="text-xs text-slate-600 mt-3 p-3 bg-slate-50 rounded-lg line-clamp-3">
            {item.metadata.manifesto}
          </p>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100">
        {errorMsg && <p className="text-xs text-red-600 mb-2 font-medium">{errorMsg}</p>}
        <Button
          onClick={handleVote}
          disabled={disabled || item.is_disqualified}
          isLoading={loading}
          className="w-full"
        >
          {item.is_disqualified ? 'Disqualified' : 'Select & Cast'}
        </Button>
      </div>
    </div>
  );
}