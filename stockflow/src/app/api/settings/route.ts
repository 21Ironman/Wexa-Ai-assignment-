import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const org = await prisma.organization.findUnique({
      where: { id: session.organizationId as string },
      select: { defaultLowStockThreshold: true }
    })
    if (!org) return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    return NextResponse.json({ defaultLowStockThreshold: org.defaultLowStockThreshold })
  } catch (error) {
    console.error('Failed to fetch settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  const session = getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { defaultLowStockThreshold } = await req.json()
    if (defaultLowStockThreshold === undefined) {
      return NextResponse.json({ error: 'Missing threshold value' }, { status: 400 })
    }

    const org = await prisma.organization.update({
      where: { id: session.organizationId as string },
      data: { defaultLowStockThreshold: Number(defaultLowStockThreshold) }
    })
    return NextResponse.json({ defaultLowStockThreshold: org.defaultLowStockThreshold })
  } catch (error) {
    console.error('Failed to update settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
