import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

const GAME_IDS = new Set(['tlou1', 'gowr', 'fh5', 'celeste', 're9', 'sf6', 'acnh'])
const MAX_NAME_LENGTH = 50
const MAX_COMMENT_LENGTH = 1000

function isValidGameId(gameId: string | null): gameId is string {
  return Boolean(gameId && GAME_IDS.has(gameId))
}

function databaseUnavailable() {
  return NextResponse.json(
    { error: 'Community comments are not configured. Set DATABASE_URL on the server.' },
    { status: 503 },
  )
}

export async function GET(request: NextRequest) {
  const gameId = request.nextUrl.searchParams.get('gameId')
  if (!isValidGameId(gameId)) {
    return NextResponse.json({ error: 'A valid game ID is required.' }, { status: 400 })
  }
  if (!process.env.DATABASE_URL) return databaseUnavailable()

  try {
    const comments = await prisma.publicGameComment.findMany({
      where: { gameId },
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: { id: true, name: true, content: true, createdAt: true },
    })
    return NextResponse.json({ comments })
  } catch (error) {
    console.error('Could not load community comments:', error)
    return NextResponse.json({ error: 'Could not load community comments.' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Request must contain valid JSON.' }, { status: 400 })
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'A comment is required.' }, { status: 400 })
  }

  const { gameId, name, content, website } = body as Record<string, unknown>
  if (typeof website === 'string' && website.trim()) {
    return NextResponse.json({ error: 'Comment could not be submitted.' }, { status: 400 })
  }
  if (typeof gameId !== 'string' || !isValidGameId(gameId)) {
    return NextResponse.json({ error: 'A valid game ID is required.' }, { status: 400 })
  }
  if (typeof name !== 'string' || typeof content !== 'string') {
    return NextResponse.json({ error: 'Your name and comment are required.' }, { status: 400 })
  }

  const trimmedName = name.trim()
  const trimmedContent = content.trim()
  if (!trimmedName || trimmedName.length > MAX_NAME_LENGTH) {
    return NextResponse.json({ error: `Name must be between 1 and ${MAX_NAME_LENGTH} characters.` }, { status: 400 })
  }
  if (!trimmedContent || trimmedContent.length > MAX_COMMENT_LENGTH) {
    return NextResponse.json({ error: `Comment must be between 1 and ${MAX_COMMENT_LENGTH} characters.` }, { status: 400 })
  }
  if (!process.env.DATABASE_URL) return databaseUnavailable()

  try {
    const comment = await prisma.publicGameComment.create({
      data: { gameId, name: trimmedName, content: trimmedContent },
      select: { id: true, name: true, content: true, createdAt: true },
    })
    return NextResponse.json({ comment }, { status: 201 })
  } catch (error) {
    console.error('Could not save community comment:', error)
    return NextResponse.json({ error: 'Could not save your comment.' }, { status: 500 })
  }
}
