import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const session = getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search')

    const products = await prisma.product.findMany({
      where: {
        organizationId: session.organizationId as string,
        ...(search ? {
          OR: [
            { name: { contains: search } },
            { sku: { contains: search } }
          ]
        } : {})
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const { name, sku, description, quantity, costPrice, sellingPrice, lowStockThreshold } = body

    if (!name || !sku) {
      return NextResponse.json({ error: 'Name and SKU are required' }, { status: 400 })
    }

    const existingProduct = await prisma.product.findUnique({
      where: {
        organizationId_sku: {
          organizationId: session.organizationId as string,
          sku
        }
      }
    })

    if (existingProduct) {
      return NextResponse.json({ error: 'Product with this SKU already exists' }, { status: 400 })
    }

    const product = await prisma.product.create({
      data: {
        organizationId: session.organizationId as string,
        name,
        sku,
        description,
        quantity: Number(quantity) || 0,
        costPrice: costPrice ? Number(costPrice) : null,
        sellingPrice: sellingPrice ? Number(sellingPrice) : null,
        lowStockThreshold: lowStockThreshold ? Number(lowStockThreshold) : null,
      }
    })

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Failed to create product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
