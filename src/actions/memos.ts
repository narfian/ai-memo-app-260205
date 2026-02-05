'use server'

import { supabase } from '@/lib/supabase'
import { Memo, MemoFormData } from '@/types/memo'
import { MemoRow } from '@/types/database'

// DB Row -> Memo 인터페이스 변환
function toMemo(row: MemoRow): Memo {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    category: row.category,
    tags: row.tags,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

// 모든 메모 조회
export async function getMemos(): Promise<Memo[]> {
  const { data, error } = await supabase
    .from('memos')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching memos:', error)
    throw new Error('메모를 불러오는데 실패했습니다.')
  }

  return (data || []).map(toMemo)
}

// 단일 메모 조회
export async function getMemoById(id: string): Promise<Memo | null> {
  const { data, error } = await supabase
    .from('memos')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null // 메모를 찾을 수 없음
    }
    console.error('Error fetching memo:', error)
    throw new Error('메모를 불러오는데 실패했습니다.')
  }

  return data ? toMemo(data) : null
}

// 메모 생성
export async function createMemo(formData: MemoFormData): Promise<Memo> {
  const { data, error } = await supabase
    .from('memos')
    .insert({
      title: formData.title,
      content: formData.content,
      category: formData.category,
      tags: formData.tags,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating memo:', error)
    throw new Error('메모 생성에 실패했습니다.')
  }

  return toMemo(data)
}

// 메모 수정
export async function updateMemo(
  id: string,
  formData: MemoFormData
): Promise<Memo> {
  const { data, error } = await supabase
    .from('memos')
    .update({
      title: formData.title,
      content: formData.content,
      category: formData.category,
      tags: formData.tags,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating memo:', error)
    throw new Error('메모 수정에 실패했습니다.')
  }

  return toMemo(data)
}

// 메모 삭제
export async function deleteMemo(id: string): Promise<void> {
  const { error } = await supabase.from('memos').delete().eq('id', id)

  if (error) {
    console.error('Error deleting memo:', error)
    throw new Error('메모 삭제에 실패했습니다.')
  }
}

// 카테고리별 메모 조회
export async function getMemosByCategory(category: string): Promise<Memo[]> {
  const query = supabase
    .from('memos')
    .select('*')
    .order('created_at', { ascending: false })

  if (category !== 'all') {
    query.eq('category', category)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching memos by category:', error)
    throw new Error('메모를 불러오는데 실패했습니다.')
  }

  return (data || []).map(toMemo)
}

// 메모 검색
export async function searchMemos(query: string): Promise<Memo[]> {
  const searchTerm = `%${query}%`

  const { data, error } = await supabase
    .from('memos')
    .select('*')
    .or(`title.ilike.${searchTerm},content.ilike.${searchTerm}`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error searching memos:', error)
    throw new Error('메모 검색에 실패했습니다.')
  }

  return (data || []).map(toMemo)
}

// 모든 메모 삭제
export async function clearAllMemos(): Promise<void> {
  const { error } = await supabase.from('memos').delete().neq('id', '')

  if (error) {
    console.error('Error clearing memos:', error)
    throw new Error('메모 삭제에 실패했습니다.')
  }
}
