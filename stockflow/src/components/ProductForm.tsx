'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, Save } from 'lucide-react'

interface ProductFormData {
  name: string
  sku: string
  description: string
  quantity: string
  costPrice: string
  sellingPrice: string
  lowStockThreshold: string
}

interface ProductFormProps {
  productId?: string
}

const defaultForm: ProductFormData = {
  name: '',
  sku: '',
  description: '',
  quantity: '0',
  costPrice: '',
  sellingPrice: '',
  lowStockThreshold: ''
}

function FormField({ label, id, children, hint }: { label: string; id: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-slate-500 text-xs mt-1.5">{hint}</p>}
    </div>
  )
}

const inputClass = "w-full bg-slate-800 border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all duration-200"

export default function ProductForm({ productId }: ProductFormProps) {
  const router = useRouter()
  const [form, setForm] = useState<ProductFormData>(defaultForm)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(!!productId)
  const [error, setError] = useState('')
  const [adjustQty, setAdjustQty] = useState('')

  useEffect(() => {
    if (!productId) return
    fetch(`/api/products/${productId}`)
      .then(r => r.json())
      .then(d => {
        if (d.product) {
          const p = d.product
          setForm({
            name: p.name,
            sku: p.sku,
            description: p.description || '',
            quantity: String(p.quantity),
            costPrice: p.costPrice != null ? String(p.costPrice) : '',
            sellingPrice: p.sellingPrice != null ? String(p.sellingPrice) : '',
            lowStockThreshold: p.lowStockThreshold != null ? String(p.lowStockThreshold) : ''
          })
        }
        setFetching(false)
      })
      .catch(() => setFetching(false))
  }, [productId])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleAdjust(delta: number) {
    const n = parseInt(adjustQty)
    if (isNaN(n)) return
    const current = parseInt(form.quantity) || 0
    const newQty = Math.max(0, current + n * delta)
    setForm(prev => ({ ...prev, quantity: String(newQty) }))
    setAdjustQty('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const body = {
      name: form.name,
      sku: form.sku,
      description: form.description || undefined,
      quantity: parseInt(form.quantity) || 0,
      costPrice: form.costPrice ? parseFloat(form.costPrice) : undefined,
      sellingPrice: form.sellingPrice ? parseFloat(form.sellingPrice) : undefined,
      lowStockThreshold: form.lowStockThreshold ? parseInt(form.lowStockThreshold) : undefined
    }

    try {
      const url = productId ? `/api/products/${productId}` : '/api/products'
      const method = productId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong')
      } else {
        router.push('/products')
        router.refresh()
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/products"
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-150"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {productId ? 'Edit Product' : 'Add Product'}
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {productId ? 'Update product details and stock.' : 'Add a new product to your inventory.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 space-y-4">
          <h2 className="text-white font-semibold text-sm uppercase tracking-wide mb-4 text-slate-400">Basic Info</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Product Name *" id="product-name">
              <input
                id="product-name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Blue Denim Jacket"
                className={inputClass}
              />
            </FormField>
            <FormField label="SKU *" id="product-sku" hint="Must be unique within your org">
              <input
                id="product-sku"
                name="sku"
                type="text"
                required
                value={form.sku}
                onChange={handleChange}
                placeholder="e.g. SKU-001"
                className={inputClass}
              />
            </FormField>
          </div>

          <FormField label="Description" id="product-description">
            <textarea
              id="product-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Optional product description..."
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </FormField>
        </div>

        {/* Stock */}
        <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 space-y-4">
          <h2 className="text-white font-semibold text-sm uppercase tracking-wide mb-4 text-slate-400">Stock</h2>

          <FormField label="Quantity on Hand *" id="product-quantity">
            <input
              id="product-quantity"
              name="quantity"
              type="number"
              min="0"
              required
              value={form.quantity}
              onChange={handleChange}
              className={inputClass}
            />
          </FormField>

          {/* Quick adjust (only for edit mode) */}
          {productId && (
            <div>
              <p className="text-sm font-medium text-slate-300 mb-2">Quick Stock Adjustment</p>
              <div className="flex items-center gap-2">
                <input
                  id="adjust-qty-input"
                  type="number"
                  min="0"
                  value={adjustQty}
                  onChange={e => setAdjustQty(e.target.value)}
                  placeholder="Enter units"
                  className="flex-1 bg-slate-800 border border-white/5 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all duration-200"
                />
                <button
                  type="button"
                  id="adjust-add-btn"
                  onClick={() => handleAdjust(1)}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  + Add
                </button>
                <button
                  type="button"
                  id="adjust-remove-btn"
                  onClick={() => handleAdjust(-1)}
                  className="px-4 py-2.5 bg-red-600/80 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  − Remove
                </button>
              </div>
            </div>
          )}

          <FormField label="Low Stock Threshold" id="product-threshold" hint="Leave blank to use the global default from Settings">
            <input
              id="product-threshold"
              name="lowStockThreshold"
              type="number"
              min="0"
              value={form.lowStockThreshold}
              onChange={handleChange}
              placeholder="e.g. 5"
              className={inputClass}
            />
          </FormField>
        </div>

        {/* Pricing */}
        <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
          <h2 className="text-white font-semibold text-sm uppercase tracking-wide mb-4 text-slate-400">Pricing</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Cost Price" id="product-cost">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
                <input
                  id="product-cost"
                  name="costPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.costPrice}
                  onChange={handleChange}
                  placeholder="0.00"
                  className={`${inputClass} pl-7`}
                />
              </div>
            </FormField>
            <FormField label="Selling Price" id="product-selling">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
                <input
                  id="product-selling"
                  name="sellingPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.sellingPrice}
                  onChange={handleChange}
                  placeholder="0.00"
                  className={`${inputClass} pl-7`}
                />
              </div>
            </FormField>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            id="save-product-btn"
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl px-6 py-3 transition-all duration-200 shadow-lg shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {loading ? 'Saving...' : productId ? 'Save Changes' : 'Create Product'}
          </button>
          <Link
            href="/products"
            className="px-6 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 font-medium transition-all duration-150 text-sm"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
