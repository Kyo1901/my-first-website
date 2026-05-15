import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

/**
 * 투표 상태 관리 훅
 * @param {string} targetType - 'post' | 'comment'
 * @param {number} targetId - 대상 ID
 * @param {string|null} userId - 현재 사용자 ID
 */
export function useVote(targetType, targetId, userId) {
  const [userVote, setUserVote] = useState(null);

  useEffect(() => {
    if (!userId || !targetId) return;
    supabase
      .from('votes')
      .select('vote_type')
      .eq('user_id', userId)
      .eq('target_type', targetType)
      .eq('target_id', targetId)
      .single()
      .then(({ data }) => setUserVote(data?.vote_type || null));
  }, [targetType, targetId, userId]);

  async function vote(voteType) {
    if (!userId) return;

    if (userVote === voteType) {
      await supabase
        .from('votes')
        .delete()
        .eq('user_id', userId)
        .eq('target_type', targetType)
        .eq('target_id', targetId);
      setUserVote(null);
    } else if (userVote) {
      await supabase
        .from('votes')
        .update({ vote_type: voteType })
        .eq('user_id', userId)
        .eq('target_type', targetType)
        .eq('target_id', targetId);
      setUserVote(voteType);
    } else {
      await supabase.from('votes').insert({
        user_id: userId,
        target_type: targetType,
        target_id: targetId,
        vote_type: voteType,
      });
      setUserVote(voteType);
    }
  }

  return { userVote, vote };
}
