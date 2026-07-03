# Phase 1–2: Delaware Formation & Capitalization Requirements

*Compiled July 2026 from primary and practitioner sources (cited inline). Verify fees/rules before filing — this is preparation material, not legal advice.*

## Certificate of Incorporation (public-company-ready)

- **Authorized shares:** small-cap OTC issuers typically authorize **100M–500M common** to leave room for placements and conversions without repeated charter amendments (some go to 1B+). ([Harvard Business Services](https://www.delawareinc.com/blog/how-many-authorized-shares-for-your-delaware-corporation/))
- **Par value:** nominal — **$0.0001**. Delaware computes the incorporation filing tax on aggregate par value (8 Del. C. §391): 500M × $0.0001 = $50,000 of capital → minimum tax. Never use no-par stock at scale.
- **Blank-check preferred:** authorize **10M–20M undesignated preferred**; board fixes series terms later by certificate of designation without a stockholder vote.
- Include: DGCL §102(b)(7) exculpation (directors AND officers post-2022 amendment), indemnification, board power to amend bylaws.
- **Filing cost:** minimum **$109** per the DE Division of Corporations fee schedule (revised Aug 1, 2024, still current mid-2026; varies with authorized stock — the $15 statutory minimum filing tax under 8 Del. C. §391 is one component). ([DE fee schedule](https://corp.delaware.gov/fee/))

## Annual franchise tax (due March 1, with $50 annual report fee)

Two methods — pay the lower:
- **Authorized shares method:** $85 per 10,000 shares — at 100M+ authorized this hits the **$200,000 cap**. Avoid.
- **Assumed par value capital method:** $400 per $1M of assumed capital ((gross assets ÷ issued shares) × authorized). With most authorized shares actually issued and modest assets, this typically lands at **$400–$800/yr**. High authorized counts are only safe if you issue a large percentage of them. Quarterly estimated payments if tax ≥ $5,000. ([DE calculator](https://corp.delaware.gov/frtaxcalc/), [Clerky](https://help.clerky.com/article/2796-calculate-delaware-franchise-tax))

## Organizational documents (templates in `templates/formation/`)

1. **Action of Sole Incorporator** — elects initial board, incorporator resigns.
2. **Initial Board Consent** — bylaws, officers, founder issuances (shares/price/consideration), **uncertificated book-entry shares** (DGCL §158; transfer agents prefer this), fiscal year, bank, EIN, indemnification.
3. **Bylaws** — annual/special meetings, written consent (§228), advance notice, indemnification, board size flexibility.
4. **Stock ledger** — required by DE; becomes the seed record the transfer agent takes over.
5. **Founder Stock Purchase Agreements** — consideration documented (cash or IP assignment), vesting if any.
6. **83(b) elections** — due **within 30 days** of transfer, no exceptions. IRS now accepts online filing of **Form 15620** (since July 2025; supports $0.0001 par prices). ([Goodwin](https://www.goodwinlaw.com/en/insights/publications/2025/07/alerts-practices-erisa-online-filing-of-section-83b-elections))

## Registrations

- **EIN:** free (IRS online / SS-4).
- **Foreign qualification:** each state of real operations (CA adds $800/yr minimum tax).

## Building the shareholder base (the long pole)

- Sell shares under **Section 4(a)(2) / Reg D 506(b)/(c)**; file **Form D** (needs free EDGAR CIK via Form ID).
- **Rule 144 holding period: 12 months for non-reporting issuers** (vs 6 for SEC-reporting). Former shells are 144-ineligible under 144(i) until 12 months after Form 10-type disclosure. ([SEC](https://www.sec.gov/resources-small-businesses/small-business-compliance-guides/revisions-rules-144-145))
- Form 211 practitioner benchmarks: **≥25 non-affiliate holders who paid cash ≥12 months before filing**, mostly round lots; **≥1M shares outstanding, ≥250K free-trading**; no promoter-sourced concentrated float.
- **Bad-actor checks (Rule 506(d))** on all officers, directors, 20%+ holders, promoters before any Reg D offering.

## Record-keeping standard (what FINRA/transfer agents will trace)

For **every issuance since inception**: date, holder name/address, share count, class, book-entry number, **consideration paid with proof (wire/check copies)**, exemption relied upon, authorizing board consent, restrictive-legend status. Gaps here are the most common cause of FINRA deficiency letters.

## Governance minimums (Delaware)

- **Directors:** one natural person suffices (§141(b)); 2–3 for credibility.
- **Officers:** per bylaws (§142); one person may hold all offices.
- **Annual meeting:** required to elect directors (or §228 written consent); compellable via Chancery after 13 months without one (§211).
- **Minutes:** no statutory cadence; best practice quarterly + written consent for every issuance/material action — these become Form 211 backup.
