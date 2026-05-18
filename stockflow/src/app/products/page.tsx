'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Plus, Search, Pencil, Trash2, AlertTriangle, Package } from 'lucide-react'

interface Product {
  id: string
  name: string
  sku: string
  quantity: number
  sellingPrice: number | null
  lowStockThreshold: number | null
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [defaultThreshold, setDefaultThreshold] = useState(5)

  const fetchProducts = useCallback(async () => {
    const res = await fetch(`/api/products${search ? `?search=${encodeURIComponent(search)}` : ''}`)
    const data = await res.json()
    setProducts(data.products || [])
    setLoading(false)
  }, [search])

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => {
      if (d.defaultLowStockThreshold !== undefined) setDefaultThreshold(d.defaultLowStockThreshold)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => fetchProducts(), 300)
    return () => clearTimeout(timer)
  }, [fetchProducts])

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this product?')) return
    setDeletingId(id)
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' })
      setProducts(prev => prev.filter(p => p.id !== id))
    } catch {
      alert('Failed to delete product')
    } finally {
      setDeletingId(null)
    }
  }

  function isLowStock(p: Product) {
    const threshold = p.lowStockThreshold !== null ? p.lowStockThreshold : defaultThreshold
    return p.quantity <= threshold
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Products</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your inventory catalog</p>
        </div>
        <Link
          href="/products/new"
          id="add-product-btn"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl px-4 py-2.5 transition-all duration-200 shadow-lg shadow-blue-500/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          id="product-search"
          type="text"
          placeholder="Search by name or SKU..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 pl-11 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all duration-200"
        />
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
              <Package className="w-7 h-7 text-slate-500" />
            </div>
            <p className="text-slate-300 font-medium">No products found</p>
            <p className="text-slate-500 text-sm mt-1 mb-5">
              {search ? 'Try a different search term.' : 'Get started by adding your first product.'}
            </p>
            {!search && (
              <Link
                href="/products/new"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl px-4 py-2.5 transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-slate-500 font-medium px-6 py-3.5">Name</th>
                  <th className="text-left text-slate-500 font-medium px-6 py-3.5">SKU</th>
                  <th className="text-right text-slate-500 font-medium px-6 py-3.5">Qty on Hand</th>
                  <th className="text-right text-slate-500 font-medium px-6 py-3.5">Selling Price</th>
                  <th className="text-center text-slate-500 font-medium px-6 py-3.5">Status</th>
                  <th className="text-right text-slate-500 font-medium px-6 py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map(product => {
                  const low = isLowStock(product)
                  return (
                    <tr key={product.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                        <span className="text-white font-medium">{product.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-400 font-mono text-xs bg-slate-800 px-2 py-0.5 rounded-md">{product.sku}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`font-semibold ${product.quantity === 0 ? 'text-red-400' : low ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {product.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-slate-300">
                        {product.sellingPrice != null ? `$${product.sellingPrice.toFixed(2)}` : '—'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {low ? (
                          <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-400 text-xs font-medium px-2.5 py-1 rounded-full border border-amber-500/20">
                            <AlertTriangle className="w-3 h-3" />
                            Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center bg-emerald-500/10 text-emerald-400 text-xs font-medium px-2.5 py-1 rounded-full border border-emerald-500/20">
                            In Stock
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 justify-end">
                          <Link
                            href={`/products/${product.id}/edit`}
                            id={`edit-product-${product.id}`}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-150"
                            title="Edit product"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button
                            id={`delete-product-${product.id}`}
                            onClick={() => handleDelete(product.id)}
                            disabled={deletingId === product.id}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150 disabled:opacity-50"
                            title="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {products.length > 0 && (
        <p className="text-slate-600 text-xs mt-3 text-right">
          {products.length} product{products.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  )
}
