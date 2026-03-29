import { NextResponse } from 'next/server'
import { getSupabaseServiceClient } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { participantId, txHash, walletAddress } = body as {
      participantId: string
      txHash: string
      walletAddress?: string
    }

    if (!participantId || !txHash) {
      return NextResponse.json({ error: 'participantId and txHash are required.' }, { status: 400 })
    }

    const supabase = getSupabaseServiceClient()

    const { data: updatedParticipant, error: participantError } = await supabase
      .from('participants')
      .update({
        paid: true,
        tx_hash: txHash,
        paid_at: new Date().toISOString(),
        wallet_address: walletAddress ?? null,
      })
      .eq('id', participantId)
      .select('*')
      .single()

    if (participantError || !updatedParticipant) {
      return NextResponse.json({ error: participantError?.message ?? 'Participant not found.' }, { status: 500 })
    }

    const { data: participants, error: participantsError } = await supabase
      .from('participants')
      .select('paid')
      .eq('bill_id', updatedParticipant.bill_id)

    if (participantsError || !participants) {
      return NextResponse.json({ error: participantsError?.message ?? 'Could not check bill status.' }, { status: 500 })
    }

    const allPaid = participants.every((p) => p.paid)

    if (allPaid) {
      await supabase.from('bills').update({ status: 'settled' }).eq('id', updatedParticipant.bill_id)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unexpected error.' },
      { status: 500 },
    )
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const txHash = searchParams.get('txHash')

  if (!txHash) {
    return NextResponse.json({ error: 'txHash is required.' }, { status: 400 })
  }

  const supabase = getSupabaseServiceClient()

  const { data: participant, error: participantError } = await supabase
    .from('participants')
    .select('*')
    .eq('tx_hash', txHash)
    .single()

  if (participantError || !participant) {
    return NextResponse.json({ receipt: null })
  }

  const { data: bill } = await supabase
    .from('bills')
    .select('*')
    .eq('id', participant.bill_id)
    .single()

  return NextResponse.json({ receipt: { participant, bill } })
}
