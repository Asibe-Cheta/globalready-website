'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { CheckCircle2, Download, FileSignature, Loader2 } from 'lucide-react'
import {
  MAINTENANCE_AGREEMENT_REF,
  maintenanceAgreementSections,
  maintenanceAgreementTitle,
} from '@/lib/maintenance-agreement'

type AgreementRow = {
  id: string
  agreement_ref: string
  justice_signature: string | null
  justice_signed_at: string | null
  client_signature: string | null
  client_name: string | null
  client_title: string | null
  client_signed_at: string | null
  is_fully_executed: boolean
  created_at: string
}

function formatSignedAt(value: string | null) {
  if (!value) return 'Not signed yet'
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function SignaturePad({
  label,
  onSave,
  saving,
}: {
  label: string
  onSave: (signature: string) => Promise<void>
  saving: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const drawingRef = useRef(false)
  const hasInkRef = useRef(false)
  const [empty, setEmpty] = useState(true)
  const [error, setError] = useState('')

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const ratio = window.devicePixelRatio || 1
    canvas.width = rect.width * ratio
    canvas.height = rect.height * ratio
    const context = canvas.getContext('2d')
    if (!context) return
    context.scale(ratio, ratio)
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.lineWidth = 2.5
    context.strokeStyle = '#0f172a'
  }, [])

  useEffect(() => {
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    return () => window.removeEventListener('resize', resizeCanvas)
  }, [resizeCanvas])

  function point(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }
  }

  function startDrawing(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return
    event.currentTarget.setPointerCapture(event.pointerId)
    const { x, y } = point(event)
    drawingRef.current = true
    hasInkRef.current = true
    setEmpty(false)
    setError('')
    context.beginPath()
    context.moveTo(x, y)
  }

  function draw(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return
    const { x, y } = point(event)
    context.lineTo(x, y)
    context.stroke()
  }

  function stopDrawing() {
    drawingRef.current = false
  }

  function clear() {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return
    const rect = canvas.getBoundingClientRect()
    context.clearRect(0, 0, rect.width, rect.height)
    hasInkRef.current = false
    setEmpty(true)
    setError('')
  }

  async function save() {
    const canvas = canvasRef.current
    if (!canvas || empty || !hasInkRef.current) {
      setError('Please sign in the box before saving.')
      return
    }
    await onSave(canvas.toDataURL('image/png'))
  }

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a2432] p-5">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{label}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
        Sign in the box below using your mouse or finger.
      </p>
      <canvas
        ref={canvasRef}
        className="w-full h-56 bg-white border-2 border-dashed border-slate-300 rounded-xl touch-none"
        onPointerDown={startDrawing}
        onPointerMove={draw}
        onPointerUp={stopDrawing}
        onPointerCancel={stopDrawing}
      />
      {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <button
          type="button"
          onClick={clear}
          disabled={saving}
          className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#223249] disabled:opacity-50"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#0d6cf2] text-white font-medium hover:bg-blue-600 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Save My Signature
        </button>
      </div>
    </div>
  )
}

function SavedSignature({
  signature,
  name,
  title,
  signedAt,
}: {
  signature: string
  name: string
  title?: string | null
  signedAt: string | null
}) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a2432] p-5">
      <div className="flex items-center gap-2 mb-3 text-[#0bda5e]">
        <CheckCircle2 className="w-5 h-5" />
        <span className="font-semibold">Signed</span>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-3 mb-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={signature} alt={`${name} signature`} className="max-h-32 object-contain" />
      </div>
      <p className="font-semibold text-slate-900 dark:text-white">{name}</p>
      {title && <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>}
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{formatSignedAt(signedAt)}</p>
    </div>
  )
}

export default function MaintenanceAgreementSignPage() {
  const [agreement, setAgreement] = useState<AgreementRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [savingRole, setSavingRole] = useState<'justice' | 'client' | null>(null)
  const [error, setError] = useState('')
  const [clientName, setClientName] = useState('')
  const [clientTitle, setClientTitle] = useState('')

  const loadAgreement = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/sign/maintenance-agreement')
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || 'Failed to load agreement')
      setAgreement(data.agreement)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load agreement')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAgreement()
  }, [loadAgreement])

  async function saveSignature(role: 'justice' | 'client', signature: string) {
    setSavingRole(role)
    setError('')
    try {
      const response = await fetch('/api/sign/maintenance-agreement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          signature,
          client_name: clientName,
          client_title: clientTitle,
        }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || 'Failed to save signature')
      setAgreement(data.agreement)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save signature')
    } finally {
      setSavingRole(null)
    }
  }

  async function downloadPdf() {
    if (!agreement?.justice_signature || !agreement.client_signature) return
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF({ unit: 'pt', format: 'a4' })
    const margin = 48
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    let y = margin

    function addText(text: string, size = 10, bold = false) {
      doc.setFont('helvetica', bold ? 'bold' : 'normal')
      doc.setFontSize(size)
      const lines = doc.splitTextToSize(text, pageWidth - margin * 2)
      lines.forEach((line: string) => {
        if (y > pageHeight - margin) {
          doc.addPage()
          y = margin
        }
        doc.text(line, margin, y)
        y += size + 5
      })
      y += 6
    }

    addText(maintenanceAgreementTitle, 16, true)
    addText(`Agreement reference: ${MAINTENANCE_AGREEMENT_REF}`, 10)
    maintenanceAgreementSections.forEach((section) => {
      addText(section.title, 12, true)
      section.body.forEach((paragraph) => addText(paragraph))
    })

    if (y > pageHeight - 260) {
      doc.addPage()
      y = margin
    }

    addText('Signatures', 14, true)
    addText(`Justice Chetachukwu Asibe, Bervic Digital - ${formatSignedAt(agreement.justice_signed_at)}`)
    doc.addImage(agreement.justice_signature, 'PNG', margin, y, 220, 85)
    y += 110
    addText(`${agreement.client_name}, ${agreement.client_title} - ${formatSignedAt(agreement.client_signed_at)}`)
    doc.addImage(agreement.client_signature, 'PNG', margin, y, 220, 85)

    doc.setFontSize(9)
    doc.setTextColor(100)
    doc.text('Signed digitally via globalready.tech', margin, pageHeight - 28)
    doc.save(`${MAINTENANCE_AGREEMENT_REF}-signed.pdf`)
  }

  const justiceSigned = Boolean(agreement?.justice_signature)
  const clientSigned = Boolean(agreement?.client_signature)

  return (
    <main className="min-h-screen">
      <Navigation />
      <section className="py-16 lg:py-24">
        <div className="section-container max-w-5xl">
          <div className="flex items-start gap-4 mb-8">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <FileSignature className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-primary mb-1">{MAINTENANCE_AGREEMENT_REF}</p>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{maintenanceAgreementTitle}</h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Review the agreement, sign in order, then download the fully executed PDF.
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-500">
              {error}
            </div>
          )}

          {loading ? (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a2432] p-10 text-center text-slate-500">
              <Loader2 className="w-8 h-8 mx-auto animate-spin mb-3" />
              Loading agreement...
            </div>
          ) : (
            <div className="space-y-8">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a2432] p-6 lg:p-8">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-5">Agreement Text</h2>
                <div className="space-y-6 text-slate-600 dark:text-slate-400">
                  {maintenanceAgreementSections.map((section) => (
                    <section key={section.title}>
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{section.title}</h3>
                      {section.body.map((paragraph) => (
                        <p key={paragraph} className="mb-2 leading-relaxed">{paragraph}</p>
                      ))}
                    </section>
                  ))}
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {agreement?.justice_signature ? (
                  <SavedSignature
                    signature={agreement.justice_signature}
                    name="Justice Chetachukwu Asibe"
                    title="Bervic Digital"
                    signedAt={agreement.justice_signed_at}
                  />
                ) : (
                  <SignaturePad
                    label="Signature of Justice Chetachukwu Asibe, Bervic Digital"
                    saving={savingRole === 'justice'}
                    onSave={(signature) => saveSignature('justice', signature)}
                  />
                )}

                {justiceSigned && (
                  agreement?.client_signature ? (
                    <SavedSignature
                      signature={agreement.client_signature}
                      name={agreement.client_name || 'GlobalReady Representative'}
                      title={agreement.client_title}
                      signedAt={agreement.client_signed_at}
                    />
                  ) : (
                    <div className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-3">
                        <input
                          value={clientName}
                          onChange={(event) => setClientName(event.target.value)}
                          placeholder="Your full name"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a2432] text-slate-900 dark:text-white"
                        />
                        <input
                          value={clientTitle}
                          onChange={(event) => setClientTitle(event.target.value)}
                          placeholder="Your job title"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a2432] text-slate-900 dark:text-white"
                        />
                      </div>
                      <SignaturePad
                        label="Signature of GlobalReady Representative"
                        saving={savingRole === 'client'}
                        onSave={(signature) => saveSignature('client', signature)}
                      />
                    </div>
                  )
                )}
              </div>

              {justiceSigned && !clientSigned && (
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-700 dark:text-amber-300">
                  Justice Asibe has signed. Awaiting GlobalReady signature.
                </div>
              )}

              {justiceSigned && clientSigned && (
                <div className="rounded-2xl border border-[#0bda5e]/30 bg-[#0bda5e]/10 p-6 text-center">
                  <CheckCircle2 className="w-10 h-10 text-[#0bda5e] mx-auto mb-3" />
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Agreement fully executed</h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Both parties have signed. Download the signed agreement for your records.
                  </p>
                  <button
                    type="button"
                    onClick={downloadPdf}
                    className="inline-flex items-center justify-center gap-2 btn-primary"
                  >
                    <Download className="w-4 h-4" />
                    Download Signed Agreement (PDF)
                  </button>
                </div>
              )}

              <div className="pt-4">
                <Link href="/" className="text-primary hover:underline font-medium">Back to Home</Link>
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  )
}
