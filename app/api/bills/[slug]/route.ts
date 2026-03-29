import { NextResponse } from 'next/server'
import { getSupabaseServiceClient } from '@/lib/supabase'

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } },
) {
  const supabase = getSupabaseServiceClient()

  const { data: bill, error: billError } = await supabase
    .from('bills')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (billError || !bill) {
    return NextResponse.json({ error: 'Bill not found.' }, { status: 404 })
  }

  const { data: participants, error: participantsError } = await supabase
    .from('participants')
    .select('*')
    .eq('bill_id', bill.id)

  if (participantsError) {
    return NextResponse.json({ error: participantsError.message }, { status: 500 })
  }

  return NextResponse.json({
    bill: {
      ...bill,
      participants,
    },
  })
}
