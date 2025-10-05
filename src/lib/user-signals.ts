import type { Game } from '@/types/game'

type NumericMap = Record<string, number>

export interface UserSignals {
  categories: NumericMap
  tags: NumericMap
  sources: NumericMap
  playedIds: string[]
  lastPlayedAt: Record<string, number>
}

const STORAGE_KEY = 'pine_user_signals_v1'

function safeParse<T>(json: string | null, fallback: T): T {
  if (!json) return fallback
  try { return JSON.parse(json) as T } catch { return fallback }
}

export function readSignals(): UserSignals {
  try {
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null
    const parsed = safeParse<UserSignals>(raw, {
      categories: {}, tags: {}, sources: {}, playedIds: [], lastPlayedAt: {}
    })
    return parsed
  } catch {
    return { categories: {}, tags: {}, sources: {}, playedIds: [], lastPlayedAt: {} }
  }
}

function writeSignals(sig: UserSignals) {
  try {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sig))
  } catch {}
}

export function recordGameInteraction(game: Game) {
  try {
    const sig = readSignals()
    const now = Date.now()
    const inc = (map: NumericMap, key: string, by = 1) => {
      if (!key) return
      map[key] = (map[key] || 0) + by
    }
    inc(sig.categories, game.category, 2)
    for (const t of game.tags || []) inc(sig.tags, t, 1)
    inc(sig.sources, game.source || 'lessons', 1)
    if (!sig.playedIds.includes(game.id)) sig.playedIds.unshift(game.id)
    // cap history
    if (sig.playedIds.length > 200) sig.playedIds = sig.playedIds.slice(0, 200)
    sig.lastPlayedAt[game.id] = now
    writeSignals(sig)
  } catch {}
}

export function buildUserSignalsHeaders(): HeadersInit {
  try {
    const sig = readSignals()
    // keep header small: trim low-signal noise
    const trim = (map: NumericMap, min = 1): NumericMap => {
      const out: NumericMap = {}
      for (const [k, v] of Object.entries(map)) if (v >= min) out[k] = v
      return out
    }
    const compact: UserSignals = {
      categories: trim(sig.categories, 1),
      tags: trim(sig.tags, 1),
      sources: trim(sig.sources, 1),
      playedIds: sig.playedIds.slice(0, 200),
      lastPlayedAt: sig.lastPlayedAt,
    }
    return { 'x-user-signals': JSON.stringify(compact) }
  } catch {
    return {}
  }
}


