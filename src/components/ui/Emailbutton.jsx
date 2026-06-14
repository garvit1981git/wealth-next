'use client'

import { generateAndEmailInsights } from '@/app/actions/Insights';
// import { generateAndEmailInsights } from '@/app/actions/insights';
import { useTransition } from 'react';

export default function EmailInsightsButton({ userId, email }) {
  const [isPending, startTransition] = useTransition();
console.log("this is id and mail", userId, email)
  const handleSend = () => {
    startTransition(async () => {
      const result = await generateAndEmailInsights(userId, email);
      if (result.success) {
        alert(result.message);
      } else {
        alert(result.error);
      }
    });
  };

  return (
    <button
      onClick={handleSend}
      disabled={isPending}
      className="px-4 py-2 bg-indigo-600 text-white rounded-md font-medium disabled:opacity-50 hover:bg-indigo-700 transition"
    >
      {isPending ? 'Analyzing & Emailing...' : 'Email Me New Insights'}
    </button>
  );
}