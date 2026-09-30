import { useEffect, useState } from 'react'
import { supabase, READINGS_TABLE } from '../supabaseClient'
import { buildDemoData } from './demoData'

// Loads every reading once, then derives the "last 30 days per animal" slice
// used by the cow-detail charts. Falls back to the demo herd whenever
// Supabase isn't configured, or the query fails, or the table is empty —
// so the app always has something to show.
export function useReadings() {
  const [state, setState] = useState({ rows: [], daily: {}, source: 'demo', loading: true, error: null })

  useEffect(() => {
    let cancelled = false

    async function load() {
      if (supabase) {
        const { data, error } = await supabase
          .from(READINGS_TABLE)
          .select('*')
          .order('recorded_at', { ascending: true })

        if (!error && data && data.length) {
          const cutoff = new Date(
            new Date(data[data.length - 1].recorded_at) - 30 * 86400000
          )
            .toISOString()
            .slice(0, 10)
          const daily = {}
          data
            .filter((r) => r.recorded_at >= cutoff)
            .forEach((r) => {
              ;(daily[r.animal_id] ??= []).push(r)
            })
          if (!cancelled) setState({ rows: data, daily, source: 'live', loading: false, error: null })
          return
        }
        if (error && !cancelled) {
          console.warn('Supabase read failed, using demo data:', error.message)
        }
      }
      const demo = buildDemoData()
      if (!cancelled) setState({ ...demo, source: 'demo', loading: false, error: null })
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return state
}
