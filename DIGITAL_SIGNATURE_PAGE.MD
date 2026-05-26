# Digital Signature Page — Maintenance Agreement

## Overview
Build a page at globalready.tech/sign/maintenance-agreement
where two parties can digitally sign the 
GlobalReady Monthly Maintenance Agreement.

Justice Asibe signs first. The GlobalReady 
representative signs second. Both can 
download the fully signed agreement as 
a PDF after both signatures are complete.

---

## Page Flow

### Step 1 — View the Agreement
Display the full text of the maintenance 
agreement on the page for both parties 
to read before signing.

The agreement text should be hardcoded 
on this page matching the document 
provided by Justice Asibe.

### Step 2 — Justice Signs First
Label: "Signature of Justice Chetachukwu 
Asibe, Bervic Digital"

A signature pad component where Justice 
can draw his signature using touch on 
mobile or mouse on desktop.

Below the pad:
- "Clear" button to redraw
- "Save My Signature" button

On saving:
- Signature image stored in the database 
  linked to this agreement
- Timestamp of signing recorded
- Page shows confirmation:
  "Justice Asibe has signed. 
  Awaiting GlobalReady signature."
- The signature pad for Justice locks 
  and cannot be redrawn after saving

### Step 3 — GlobalReady Signs
When the GlobalReady representative 
visits the same URL after Justice 
has signed, they see:

- Justice's signature displayed 
  with his name and timestamp
- A second signature pad labelled:
  "Signature of GlobalReady Representative"
- Name input field: "Your full name"
- Title input field: "Your job title"
- "Clear" button
- "Sign Agreement" button

On saving:
- Their signature, name, title and 
  timestamp stored in database
- Agreement marked as fully executed

### Step 4 — Download PDF
Once both signatures are saved, 
both parties see a prominent button:

"Download Signed Agreement (PDF)"

This generates a PDF containing:
- The full agreement text
- Justice's signature with name 
  and timestamp
- GlobalReady representative's 
  signature with name, title 
  and timestamp
- A unique agreement reference number
- "Signed digitally via globalready.tech" 
  at the bottom

Use jsPDF or puppeteer to generate 
the PDF server-side or client-side. 
Check what is already available 
before adding new dependencies.

---

## Page States

### State 1 — Neither party has signed
Show the agreement text and 
Justice's signature pad only.
GlobalReady's pad is not yet visible.

### State 2 — Justice has signed, 
### GlobalReady has not
Show Justice's saved signature 
with timestamp.
Show GlobalReady's signature pad 
and input fields.
Download button not yet available.

### State 3 — Both have signed
Show both signatures with timestamps.
Show "Download Signed Agreement" 
button prominently for both parties.
Both signature pads are locked 
and cannot be redrawn.

---

## Signature Pad
Use react-signature-canvas or 
signature_pad library. Check 
what is already installed before 
adding new dependencies.

The pad must:
- Work with mouse on desktop
- Work with touch on mobile and tablet
- Be clearly bordered so users 
  know where to sign
- Have a clear instruction above: 
  "Sign in the box below using 
  your mouse or finger"

---

## Database Storage
Store the following per agreement:

maintenance_agreement_signatures (
id: UUID primary key
agreement_ref: text unique
justice_signature: text (base64 image)
justice_signed_at: timestamptz | null
client_signature: text (base64 image) | null
client_name: text | null
client_title: text | null
client_signed_at: timestamptz | null
is_fully_executed: boolean default false
created_at: timestamptz
)

---

## Design
Match the existing GlobalReady 
website design system.
The page should feel professional 
and trustworthy.
On mobile ensure signature pads 
are large enough to sign comfortably.

---

## Acceptance Criteria
- [ ] Page live at 
      globalready.tech/sign/maintenance-agreement
- [ ] Agreement text displayed correctly
- [ ] Justice signature pad works 
      on desktop and mobile
- [ ] Clear button works
- [ ] Justice signature saves correctly 
      with timestamp
- [ ] Justice pad locks after saving
- [ ] GlobalReady signature pad 
      appears after Justice signs
- [ ] Name and title fields work
- [ ] GlobalReady signature saves 
      correctly with timestamp
- [ ] Agreement marked fully executed 
      when both sign
- [ ] PDF generates with both 
      signatures and timestamps
- [ ] Download button works for 
      both parties
- [ ] All three page states display 
      correctly
- [ ] Works on mobile and desktop
