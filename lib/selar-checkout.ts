import type { PlanId } from '@/lib/pricing-plans'

const productCodeMap: Record<PlanId, string | undefined> = {
  seven_day: process.env.NEXT_PUBLIC_SELAR_PRODUCT_SEVEN_DAY,
  monthly_pro: process.env.NEXT_PUBLIC_SELAR_PRODUCT_MONTHLY_PRO,
  four_month_pro: process.env.NEXT_PUBLIC_SELAR_PRODUCT_FOUR_MONTH_PRO,
  yearly_pro: process.env.NEXT_PUBLIC_SELAR_PRODUCT_YEARLY_PRO,
}

export function getSelarProductCode(planId: PlanId): string | null {
  const code = productCodeMap[planId]?.trim()
  return code || null
}

export function isSelarConfigured(planId: PlanId): boolean {
  return getSelarProductCode(planId) !== null
}

export function buildSelarCheckoutUrl(productCode: string, email?: string | null): string {
  const url = new URL(`https://selar.co/${encodeURIComponent(productCode)}`)
  url.searchParams.set('add_to_cart', '1')
  const trimmedEmail = email?.trim()
  if (trimmedEmail) {
    url.searchParams.set('email', trimmedEmail)
  }
  return url.toString()
}
