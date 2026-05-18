'use client'

import { useState, useEffect } from 'react'
import { Settings as SettingsIcon, Loader2, CheckCircle2 } from 'lucide-react'

export default function SettingsPage() {
  const [threshold, setThreshold] = useState<string>('5')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(d => {
        if (d.defaultLowStockThreshold !== undefined) setThreshold(String(d.defaultLowStockThreshold))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess(false)
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ defaultLowStockThreshold: parseInt(threshold) })
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to save settings')
      } else {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Global configuration for your organization</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/5">
              <div className="w-9 h-9 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <SettingsIcon className="w-4.5 h-4.5 text-blue-400" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Inventory Thresholds</p>
                <p className="text-slate-500 text-xs">Configure default stock alert levels</p>
              </div>
            </div>

            <div>
              <label htmlFor="default-threshold" className="block text-sm font-medium text-slate-300 mb-1.5">
                Default Low Stock Threshold
              </label>
              <input
                id="default-threshold"
                type="number"
                min="0"
                required
                value={threshold}
                onChange={e => setThreshold(e.target.value)}
                className="w-full bg-slate-800 border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all duration-200"
              />
              <p className="text-slate-500 text-xs mt-2">
                Products without a custom threshold will be flagged as &quot;low stock&quot; when quantity is at or below this value.
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Settings saved successfully!
            </div>
          )}

          <button
            id="save-settings-btn"
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl px-6 py-3 transition-all duration-200 shadow-lg shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      )}
    </div>
  )
}
