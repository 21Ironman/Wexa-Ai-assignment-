import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const orgId = session.organizationId as string

    const org = await prisma.organization.findUnique({
      where: { id: orgId },
      select: { defaultLowStockThreshold: true }
    })
    if (!org) return NextResponse.json({ error: 'Organization not found' }, { status: 404 })

    const defaultThreshold = org.defaultLowStockThreshold

    const totalProducts = await prisma.product.count({ where: { organizationId: orgId } })

    const sumResult = await prisma.product.aggregate({
      where: { organizationId: orgId },
      _sum: { quantity: true }
    })

    const totalQuantity = sumResult._sum.quantity || 0

    const allProducts = await prisma.product.findMany({
      where: { organizationId: orgId },
      select: { id: true, name: true, sku: true, quantity: true, lowStockThreshold: true }
    })

    const lowStockItems = allProducts
      .filter(p => {
        const threshold = p.lowStockThreshold !== null ? p.lowStockThreshold : defaultThreshold
        return p.quantity <= threshold
      })
      .slice(0, 10)

    return NextResponse.json({ totalProducts, totalQuantity, lowStockItems })
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 })
  }
}
