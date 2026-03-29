import { NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { getSupabaseServiceClient } from '@/lib/supabase'

interface ParticipantInput {
  name: string
  share_amount: number
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, total_amount, currency, participants, creator_address } = body as {
      title: string
      total_amount: number
      currency: 'STRK' | 'USDC'
      participants: ParticipantInput[]
      creator_address?: string
    }

    if (!title || !total_amount || !currency || !Array.isArray(participants) || participants.length < 2) {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
    }

    const slug = nanoid(8)
    const contract_bill_id = `0x${Date.now().toString(16)}${Math.random().toString(16).slice(2, 8)}`

    const supabase = getSupabaseServiceClient()

    const { data: bill, error: billError } = await supabase
      .from('bills')
      .insert({
        slug,
        title,
        total_amount,
        currency,
        creator_address: creator_address ?? null,
        contract_bill_id,
      })
      .select('*')
      .single()

    if (billError || !bill) {
      return NextResponse.json({ error: billError?.message ?? 'Failed to create bill.' }, { status: 500 })
    }

    const payload = participants.map((participant) => ({
      bill_id: bill.id,
      name: participant.name,
      share_amount: participant.share_amount,
    }))

    const { data: insertedParticipants, error: participantError } = await supabase
      .from('participants')
      .insert(payload)
      .select('*')

    if (participantError) {
      return NextResponse.json({ error: participantError.message }, { status: 500 })
    }

    return NextResponse.json({ slug, billId: contract_bill_id, participants: insertedParticipants })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unexpected error.' },
      { status: 500 },
    )
  }
}
