"use client"

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bug, RefreshCw, CheckCircle2, XCircle, Activity } from 'lucide-react'

type CheckResult = {
  id: string
  name: string
  status: 'ok' | 'warn' | 'fail'
  details?: string
}

export function BugFixer() {
  const [open, setOpen] = useState(false)
  const [running, setRunning] = useState(false)
  const [results, setResults] = useState<CheckResult[]>([])

  const checks = useMemo(() => [
    {
      id: 'api-games',
      name: 'Games API reachable',
      run: async (): Promise<CheckResult> => {
        try {
          const res = await fetch('/api/games?limit=1', { cache: 'no-store' })
          if (!res.ok) return { id: 'api-games', name: 'Games API reachable', status: 'fail', details: `HTTP ${res.status}` }
          const json = await res.json()
          if (json && Array.isArray(json.games)) return { id: 'api-games', name: 'Games API reachable', status: 'ok' }
          return { id: 'api-games', name: 'Games API reachable', status: 'warn', details: 'Unexpected payload' }
        } catch (e: any) {
          return { id: 'api-games', name: 'Games API reachable', status: 'fail', details: e?.message || 'Network error' }
        }
      }
    },
    {
      id: 'categories',
      name: 'Categories API valid',
      run: async (): Promise<CheckResult> => {
        try {
          const res = await fetch('/api/categories', { cache: 'no-store' })
          if (!res.ok) return { id: 'categories', name: 'Categories API valid', status: 'fail', details: `HTTP ${res.status}` }
          const json = await res.json()
          if (json && Array.isArray(json.categories) && json.categories.length > 0) return { id: 'categories', name: 'Categories API valid', status: 'ok' }
          return { id: 'categories', name: 'Categories API valid', status: 'warn', details: 'No categories returned' }
        } catch (e: any) {
          return { id: 'categories', name: 'Categories API valid', status: 'fail', details: e?.message || 'Network error' }
        }
      }
    },
    {
      id: 'hdun-proxy',
      name: 'HDUN proxy functional',
      run: async (): Promise<CheckResult> => {
        try {
          const res = await fetch('/api/hdun/proxy?id=2048', { cache: 'no-store' })
          if (!res.ok) return { id: 'hdun-proxy', name: 'HDUN proxy functional', status: 'fail', details: `HTTP ${res.status}` }
          const ct = res.headers.get('content-type') || ''
          if (/text\/html/i.test(ct)) return { id: 'hdun-proxy', name: 'HDUN proxy functional', status: 'ok' }
          return { id: 'hdun-proxy', name: 'HDUN proxy functional', status: 'warn', details: 'Unexpected content-type' }
        } catch (e: any) {
          return { id: 'hdun-proxy', name: 'HDUN proxy functional', status: 'fail', details: e?.message || 'Network error' }
        }
      }
    },
  ], [])

  const runAll = async () => {
    setRunning(true)
    const out: CheckResult[] = []
    for (const c of checks) {
      const r = await c.run()
      out.push(r)
    }
    setResults(out)
    setRunning(false)
  }

  useEffect(() => {
    if (open && results.length === 0 && !running) {
      runAll()
    }
  }, [open])

  const statusIcon = (s: CheckResult['status']) => s === 'ok' ? (
    <CheckCircle2 className="h-4 w-4 text-green-500" />
  ) : s === 'warn' ? (
    <Activity className="h-4 w-4 text-yellow-500" />
  ) : (
    <XCircle className="h-4 w-4 text-red-500" />
  )

  return (
    <>
      {!open && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
          className="fixed bottom-4 right-20 z-40 h-10 rounded-full bg-background/80 backdrop-blur-sm border shadow hover:bg-background/90"
          title={'Show diagnostics'}
        >
          <Bug className="h-4 w-4 mr-2" /> Diagnostics
        </Button>
      )}

      {open && (
        <Card className="fixed bottom-20 right-4 w-80 z-50 shadow-2xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Diagnostics</CardTitle>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={runAll} disabled={running}>
                <RefreshCw className={`h-4 w-4 ${running ? 'animate-spin' : ''}`} />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                  ✕
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {results.map(r => (
              <div key={r.id} className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="text-sm font-medium flex items-center gap-2">
                    {statusIcon(r.status)} {r.name}
                  </div>
                  {r.details && (
                    <div className="text-xs text-muted-foreground mt-1">{r.details}</div>
                  )}
                </div>
              </div>
            ))}
            {results.length === 0 && (
              <div className="text-sm text-muted-foreground">No results yet.</div>
            )}
          </CardContent>
        </Card>
      )}
    </>
  )
}


