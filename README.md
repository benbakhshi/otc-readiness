# OTC Readiness

Everything needed to take a Delaware C corporation from formation to public quotation on the **OTCID Basic Market** (the lowest OTC Markets tier with public quoting, successor to Pink Current as of July 1, 2025) — and to stay compliant quarter after quarter.

> ⚠ **Not legal advice.** Every generated document is a draft for review by securities counsel. Fees and rules were verified against sources current as of July 2026 (see `docs/`) and change frequently.

## What's here

```
master/          Single source of truth: company-master.json (+ schema.json for the editor UI)
templates/       Every document as a template pulling from the master file
  formation/       Charter, bylaws, board consents, stock purchase agreement, stock ledger
  governance/      Generic board consent, annual stockholder consent
  otc/             OTCID disclosure statement, Management Certification, Form 211 package,
                   attorney letter (legacy, pre-7/2025)
generated/       Filled documents (regenerate any time; committed so git tracks every change)
scripts/         generate-docs.js — fills all templates from the master file
requirements/    requirements.json — the readiness checklist (34 items across 5 phases)
docs/            Researched requirements with sources: roadmap, formation, quoting, compliance
app/             Web app (front end + back end) for you and selected users
```

## The workflow

1. Edit company facts **once** in `master/company-master.json` — directly, or via the app's **Company Master** page.
2. Regenerate documents (app button, or `node scripts/generate-docs.js`). The generator flags unresolved fields and cap-table reconciliation errors (issuance history must equal outstanding shares).
3. Track progress in the app's **Checklist**; watch filing deadlines on the **Calendar** (computed from your fiscal year end per OTCID rules).
4. Commit. Git history is the audit trail for every document and data change.

## Running the app

Zero dependencies — Node 22.5+ only (uses built-in `node:sqlite`, so nothing to install):

```sh
node app/server.js        # http://localhost:4550
```

First boot seeds an admin account (`ben@herzlcapital.com`) and writes the initial password to `app/data/initial-admin-password.txt` (gitignored — note it, then delete the file). Add editors/viewers from the **Users** tab.

Roles: **admin** (everything + user management), **editor** (checklist, master data, document generation), **viewer** (read-only).

## Key compliance numbers (OTCID, as researched July 2026)

- Quarterly reports: **45 days** after quarter end · Annual report: **90 days** after FYE
- Management Certification: annually, ≤ **45 days after the annual report deadline**
- Profile verification: every **6 months** · Late-filing notice: within **1 business day** (+5d/+15d cure)
- Application **$3,500**; annual fee ~**$6,000–7,500** (verify current schedule)
- Rule 144 hold for non-reporting issuers: **12 months** — plan seed placements early
- FINRA Rule 5250: **never pay a market maker** to file Form 211
