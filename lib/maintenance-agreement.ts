export const MAINTENANCE_AGREEMENT_REF = 'GR-MA-2026-001'

export const maintenanceAgreementTitle = 'GlobalReady Monthly Maintenance Agreement'

export const maintenanceAgreementSections = [
  {
    title: '1. Parties',
    body: [
      'This Monthly Maintenance Agreement is entered into between Justice Chetachukwu Asibe, Bervic Digital ("Service Provider"), and GlobalReady ("Client").',
      'The parties agree that the Service Provider will provide ongoing website and technical maintenance services for GlobalReady under the terms below.',
    ],
  },
  {
    title: '2. Scope of Services',
    body: [
      'The Service Provider will provide reasonable monthly maintenance support for the GlobalReady website and related web operations.',
      'Services may include routine website updates, bug fixes, content updates, monitoring support, deployment support, and technical coordination with the mobile/backend team where required.',
    ],
  },
  {
    title: '3. Exclusions',
    body: [
      'This agreement does not include major redesigns, full rebuilds, new product development, third-party paid services, app store work, backend rewrites, or emergency work outside the agreed maintenance scope unless separately approved in writing.',
      'Any out-of-scope work may require a separate quote, timeline, and approval before work begins.',
    ],
  },
  {
    title: '4. Fees and Payment',
    body: [
      'GlobalReady will pay the agreed monthly maintenance fee for the services described in this agreement.',
      'Payment terms, billing method, and any applicable taxes or third-party costs will follow the commercial arrangement agreed by the parties in writing.',
    ],
  },
  {
    title: '5. Term and Cancellation',
    body: [
      'This agreement continues on a month-to-month basis unless cancelled by either party.',
      'Either party may cancel the agreement by giving written notice before the next billing period, unless a different notice period has been agreed in writing.',
    ],
  },
  {
    title: '6. Client Responsibilities',
    body: [
      'GlobalReady will provide timely access, approvals, content, credentials, and information needed for the Service Provider to perform the maintenance services.',
      'GlobalReady remains responsible for business decisions, legal compliance, payment processor setup, third-party platform accounts, and final approval of published content.',
    ],
  },
  {
    title: '7. Confidentiality',
    body: [
      'Each party agrees to keep confidential any non-public business, technical, customer, financial, or operational information received from the other party.',
      'Confidential information may only be used for purposes related to this agreement.',
    ],
  },
  {
    title: '8. No Guarantee',
    body: [
      'The Service Provider will use reasonable skill and care when performing maintenance services.',
      'The Service Provider does not guarantee uninterrupted service, search rankings, third-party platform availability, payment processor approval, or business results.',
    ],
  },
  {
    title: '9. Digital Signature',
    body: [
      'The parties agree that signatures captured on globalready.tech/sign/maintenance-agreement are valid digital signatures for this agreement.',
      'A fully signed PDF generated from this page may be retained by both parties as evidence of execution.',
    ],
  },
]

export function getAgreementPlainText() {
  return maintenanceAgreementSections
    .map((section) => `${section.title}\n${section.body.join('\n\n')}`)
    .join('\n\n')
}
