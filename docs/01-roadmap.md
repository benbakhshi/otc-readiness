# Roadmap: Private Delaware C Corp → Quoted on the OTCID Basic Market

> **Key regime change:** effective **July 1, 2025**, OTC Markets retired the "Pink Current Information" tier. The lowest tier a new issuer can actually enter with public quotation is now the **OTCID Basic Market** (Alternative Reporting Standard). "Pink Limited" survives only as a downgrade destination and the Expert Market has no public quoting. The old annual attorney letter was replaced by an officer-signed **Management Certification**.

## The path at a glance

| Phase | What happens | Typical timing |
|-------|--------------|----------------|
| 1. Formation | DE C corp with public-ready charter (high authorized common, blank-check preferred, $0.0001 par), bylaws, board consents, EIN, bank account | Week 1–2 |
| 2. Capitalization & Records | Founder shares + exempt placements (Reg D / 4(a)(2)), airtight issuance records, GAAP financials | Months 1–12 (Rule 144 12-month clock for non-reporting issuers drives the timeline) |
| 3. Infrastructure | Securities counsel, SEC-registered transfer agent (Verified Shares Program), CUSIP ($210), accountant | Months 2–4 (parallel) |
| 4. OTCID Application & Form 211 | OTCIQ account, Verified Profile, initial disclosure + Management Certification, sponsoring market maker files Form 211 with FINRA, pay $3,500 application fee | 3–6 months incl. 4–8 weeks FINRA review |
| 5. Ongoing Compliance | Quarterly (45d) + annual (90d) reports, annual Management Certification (+45d), profile verification (6mo), material news, DE franchise tax | Forever |

## The critical constraint most people miss

**Rule 144 holding period is 12 months for non-reporting issuers.** The free-trading float that FINRA/market makers want to see (~25+ non-affiliate cash-paying round-lot holders, ≥250K free-trading shares out of ≥1M outstanding) must generally have been **bought and paid for at least 12 months before the Form 211 is filed**. Plan the seed placements first; everything else can run in parallel during the hold period.

## Budget (from current practitioner sources — verify before committing)

| Item | Cost |
|------|------|
| DE formation (min fee with $0.0001 par) | $109–$500 |
| Registered agent | $50–$300/yr |
| CUSIP | $210 |
| Transfer agent setup | $2,500–$5,000 + monthly |
| Securities counsel (going-public project) | $20,000–$40,000 |
| GAAP financials (unaudited; audit not required for OTCID) | varies; audit $15K–$50K if elected |
| OTCID application | $3,500 |
| OTCID annual fee | $8,040/yr (verified July 2026; raised from $7,500 on July 1, 2026) |
| DE franchise tax (assumed par value method, most shares issued) | often $400–$800/yr |
| **All-in through first quotation** | **~$35,000–$75,000** |

Note: **FINRA Rule 5250 prohibits paying a market maker** (cash or stock) for filing the Form 211 or making a market. Anyone quoting a "market maker fee" is describing an illegal arrangement.

## How this repo works

1. **`master/company-master.json`** is the single source of truth — every fact about the company lives there once.
2. **`templates/`** contains every corporate and OTC document as a template pulling from the master file.
3. **`scripts/generate-docs.js`** fills all templates → `generated/` (run it, or click "Regenerate" in the web app).
4. **`requirements/requirements.json`** seeds the readiness checklist in the web app (`app/`), which tracks status/owner/notes per item and computes the compliance calendar from the fiscal year end.
5. Git history = your audit trail of every document and data change.

See `docs/02–04` for the detailed requirements with sources.
