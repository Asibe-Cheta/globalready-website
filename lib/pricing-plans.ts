export type PlanId = 'seven_day' | 'monthly_pro' | 'four_month_pro' | 'yearly_pro'

export type CheckoutMode = 'payment' | 'subscription'

export type PricingPlan = {
  id: PlanId
  name: string
  price: string
  period: string
  checkoutMode: CheckoutMode
  badge?: string
  message?: string
  description: string
  features: string[]
}

export const DEFAULT_PLAN_ID: PlanId = 'monthly_pro'

export const proFeatures = [
  'CV download',
  'Premium job application links',
  'CV tailoring',
  'Job fit check',
  'Cover letter generation',
  'Interview practice',
  'Premium job access',
]

export const pricingPlans: PricingPlan[] = [
  {
    id: 'seven_day',
    name: '7-Day Access',
    price: '€1.99',
    period: 'one-time',
    checkoutMode: 'payment',
    description: 'Short-term premium access for one week.',
    features: [...proFeatures, 'Saved jobs / application tracker when available'],
  },
  {
    id: 'monthly_pro',
    name: 'Monthly Pro',
    price: '€9.99',
    period: '/month',
    checkoutMode: 'subscription',
    badge: 'Most Popular',
    description: 'Flexible monthly access. Cancel anytime.',
    features: [
      ...proFeatures,
      'Saved jobs & application tracker',
      'Weekly job match alerts when available',
      'Premium resource hub when available',
    ],
  },
  {
    id: 'four_month_pro',
    name: '4-Month Pro',
    price: '€24.99',
    period: 'one-time',
    checkoutMode: 'payment',
    badge: 'Best for serious applicants',
    message: 'Get 4 months of premium access for less than 3 monthly payments.',
    description: 'Four months of premium access paid upfront.',
    features: [
      ...proFeatures,
      'Saved jobs & application tracker',
      'Weekly job match alerts when available',
      'Premium resource hub when available',
    ],
  },
  {
    id: 'yearly_pro',
    name: 'Yearly Pro',
    price: '€69.99',
    period: '/year',
    checkoutMode: 'subscription',
    badge: 'Best Value',
    description: 'Best value for long-term preparation.',
    features: [
      ...proFeatures,
      'Saved jobs & application tracker',
      'Weekly job match alerts when available',
      'Premium resource hub when available',
    ],
  },
]

export function isPlanId(value: string | null | undefined): value is PlanId {
  return pricingPlans.some((plan) => plan.id === value)
}

export function getPricingPlan(value: string | null | undefined): PricingPlan {
  return pricingPlans.find((plan) => plan.id === value) ?? pricingPlans.find((plan) => plan.id === DEFAULT_PLAN_ID)!
}
