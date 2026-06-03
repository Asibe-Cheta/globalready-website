import type { PlanId } from '@/lib/pricing-plans'

/** Public Selar product slugs (not secrets). Env vars override these defaults. */
const DEFAULT_SELAR_PRODUCT_CODES: Partial<Record<PlanId, string>> = {
  monthly_pro: 'r636f00tdn',
  four_month_pro: '3c740226s3',
  yearly_pro: 'c899qx619s',
}

const productCodeMap: Record<PlanId, string | undefined> = {
  seven_day: process.env.NEXT_PUBLIC_SELAR_PRODUCT_SEVEN_DAY,
  monthly_pro:
    process.env.NEXT_PUBLIC_SELAR_PRODUCT_MONTHLY_PRO ?? DEFAULT_SELAR_PRODUCT_CODES.monthly_pro,
  four_month_pro:
    process.env.NEXT_PUBLIC_SELAR_PRODUCT_FOUR_MONTH_PRO ?? DEFAULT_SELAR_PRODUCT_CODES.four_month_pro,
  yearly_pro:
    process.env.NEXT_PUBLIC_SELAR_PRODUCT_YEARLY_PRO ?? DEFAULT_SELAR_PRODUCT_CODES.yearly_pro,
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
