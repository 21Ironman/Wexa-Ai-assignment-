'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Package, Boxes, AlertTriangle, TrendingDown, Plus } from 'lucide-react'

interface LowStockItem {
  id: string
  name: string
  sku: string
  quantity: number
  lowStockThreshold: number | null
}

interface DashboardStats {
  totalProducts: number
  totalQuantity: number
  lowStockItems: LowStockItem[]
}

function StatCard({
  title, value, icon: Icon, color, sub
}: { title: string; value: number | string; icon: React.ElementType; color: string; sub?: string }) {
  return (
    <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 flex items-start gap-4 hover:border-white/10 transition-colors duration-200">
      <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="min-w-0">
        <p className="text-slate-400 text-sm font-medium">{title}</p>
        <p className="text-white text-3xl font-bold mt-0.5 tracking-tight">{value}</p>
        {sub && <p className="text-slate-500 text-xs mt-1">{sub}</p>}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard')
      .then(r => r.json())
      .then(d => { setStats(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Your inventory at a glance</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <StatCard
              title="Total Products"
              value={stats?.totalProducts ?? 0}
              icon={Package}
              color="bg-blue-500/20 text-blue-400"
              sub="Products in inventory"
            />
            <StatCard
              title="Total Stock"
              value={stats?.totalQuantity ?? 0}
              icon={Boxes}
              color="bg-emerald-500/20 text-emerald-400"
              sub="Units across all products"
            />
            <StatCard
              title="Low Stock Items"
              value={stats?.lowStockItems.length ?? 0}
              icon={AlertTriangle}
              color={(stats?.lowStockItems.length ?? 0) > 0 ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-700/50 text-slate-400'}
              sub="Items below threshold"
            />
          </div>

          {/* Low stock table */}
          <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <TrendingDown className="w-4 h-4 text-amber-400" />
                <h2 className="text-white font-semibold text-sm">Low Stock Items</h2>
              </div>
              <Link
                href="/products/new"
                id="dashboard-add-product"
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg px-3 py-1.5 transition-colors duration-200"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Product
              </Link>
            </div>

            {!stats?.lowStockItems.length ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-3">
                  <Package className="w-6 h-6 text-emerald-400" />
                </div>
                <p className="text-slate-300 font-medium text-sm">All stocked up!</p>
                <p className="text-slate-500 text-xs mt-1">No products are below their stock threshold.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left text-slate-500 font-medium px-6 py-3">Product</th>
                      <th className="text-left text-slate-500 font-medium px-6 py-3">SKU</th>
                      <th className="text-right text-slate-500 font-medium px-6 py-3">Qty on Hand</th>
                      <th className="text-right text-slate-500 font-medium px-6 py-3">Threshold</th>
                      <th className="text-right text-slate-500 font-medium px-6 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {stats.lowStockItems.map(item => (
                      <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-3.5">
                          <span className="text-white font-medium">{item.name}</span>
                        </td>
                        <td className="px-6 py-3.5">
                          <span className="text-slate-400 font-mono text-xs bg-slate-800 px-2 py-0.5 rounded-md">{item.sku}</span>
                        </td>
                        <td className="px-6 py-3.5 text-right">
                          <span className={`font-semibold ${item.quantity === 0 ? 'text-red-400' : 'text-amber-400'}`}>
                            {item.quantity}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-right text-slate-400">
                          {item.lowStockThreshold ?? 'default'}
                        </td>
                        <td className="px-6 py-3.5 text-right">
                          <Link
                            href={`/products/${item.id}/edit`}
                            className="text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors"
                          >
                            Update stock →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
