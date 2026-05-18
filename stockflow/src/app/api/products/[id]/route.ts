import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const product = await prisma.product.findFirst({
      where: { id: params.id, organizationId: session.organizationId as string }
    })
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    return NextResponse.json({ product })
  } catch (error) {
    console.error('Failed to fetch product:', error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const { name, sku, description, quantity, costPrice, sellingPrice, lowStockThreshold } = body

    const existing = await prisma.product.findFirst({
      where: { id: params.id, organizationId: session.organizationId as string }
    })
    if (!existing) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        sku,
        description,
        quantity: Number(quantity),
        costPrice: costPrice ? Number(costPrice) : null,
        sellingPrice: sellingPrice ? Number(sellingPrice) : null,
        lowStockThreshold: lowStockThreshold ? Number(lowStockThreshold) : null,
      }
    })
    return NextResponse.json({ product })
  } catch (error) {
    console.error('Failed to update product:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const existing = await prisma.product.findFirst({
      where: { id: params.id, organizationId: session.organizationId as string }
    })
    if (!existing) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

    await prisma.product.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete product:', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
