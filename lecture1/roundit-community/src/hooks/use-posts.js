import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

/**
 * 게시물 목록 조회 훅
 * @param {number|null} boardId - 게시판 ID (null이면 전체)
 * @param {string} sortBy - 정렬 기준 ('hot' | 'new' | 'top')
 */
export function usePosts(boardId = null, sortBy = 'hot') {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('roundit_posts')
      .select(`
        *,
        roundit_users!author_id(id, username, profile_img),
        roundit_boards!board_id(id, name)
      `);

    if (boardId) query = query.eq('board_id', boardId);

    if (sortBy === 'new') {
      query = query.order('created_at', { ascending: false });
    } else {
      query = query.order('vote_score', { ascending: false });
    }

    const { data, error } = await query.limit(30);
    if (!error) setPosts(data || []);
    setLoading(false);
  }, [boardId, sortBy]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { posts, loading, refetch: fetchPosts };
}
