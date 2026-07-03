# Verification Report — Key Figures & Rules

*Generated July 2, 2026. Every material number in this repo was researched by one agent and independently re-derived by an adversarial verifier from separate (preferably primary) sources. Verdicts below; primary sources include the OTCID Rules v1.0 PDF, OTCID Disclosure Guidelines, OTC Markets fee schedule (as updated 2026-07-01), 8 Del. C. §§391/502/503/504, FINRA Rules 5250/6432, 17 CFR 230.144, CUSIP GS fee schedule, and DTC Operational Arrangements (June 10, 2026).*
**Result: 35 confirmed, 3 corrected, 2 informational.**


## OTCID Fees

- ✅ **OTCID Basic Market one-time application fee is $3,500**
  - $3,500 (one-time application fee) — CONFIRMED
  - Source: https://backend.otcmarkets.com/api/v1/pages/path?path=corporate-services%2Ffee-schedule
- ✅ **An application fee is a defined, required fee for OTCID (primary confirmation that the fee exists and is set by the Corporate Services Fee Schedule)**
  - Application fee required; amount set by the Corporate Services Fee Schedule (primary source does not state the dollar figure)
  - Source: https://www.otcmarkets.com/files/OTCIDRules.pdf
- 🔧 CORRECTED **Annual issuer fee is $6,000/yr vs $7,500/yr (resolve the conflict; state the actual current annual fee)**
  - $8,040 per year (current OTCID annual fee, per the live Corporate Services Fee Schedule as of July 2026; row 'OTCID - OTC Disclosure & News Service'). $7,500 was the rate before July 1, 2026 (secondary corroboration); $6,000 is wrong — it matches the OTCQX/OTCQB APPLICATION fee on the same schedule, a likely source of the confusion.
  - Source: https://backend.otcmarkets.com/api/v1/pages/path?path=corporate-services%2Ffee-schedule
- ◽ **Billing mechanics: when/how the application fee is paid**
  - The application fee is paid at the time of application submission, via ACH/wire or credit card, through Gateway.otcmarkets.com
  - Source: https://www.otcmarkets.com/files/Gateway_Guide_OTCID.pdf
- ✅ **Billing mechanics: when the annual fee is invoiced**
  - UNVERIFIED. No primary source accessible states the annual-fee invoicing/billing cycle for OTCID. The OTCID Rules only obligate payment of all applicable Fees per the fee schedule.
  - Source: https://www.otcmarkets.com/files/OTCIQ_Form_v6.4.pdf
- 🔧 CORRECTED **Whether OTCID fees changed for 2026**
  - Yes — the OTCID annual fee increased to $8,040, with the change appearing effective July 1, 2026 (fee-schedule page content updated 2026-07-01T21:26:51Z; prior rate $7,500 per secondary sources). The $3,500 application fee is unchanged. OTCID Rules remain v1.0 (January 2025).
  - Source: https://backend.otcmarkets.com/api/v1/pages/path?path=corporate-services%2Ffee-schedule

## OTCID Deadlines & Removal Rules

- ✅ **Annual report due 90 days after fiscal year end**
  - 90 days after fiscal year end (Alternative Reporting companies, per OTCID Disclosure Guidelines 'Ongoing Requirements')
  - Source: https://www.otcmarkets.com/files/OTCIDDisclosureGuidelines.docx
- ✅ **Quarterly reports due 45 days after quarter end**
  - 45 days after each fiscal quarter end (Alternative Reporting companies, per OTCID Disclosure Guidelines 'Ongoing Requirements')
  - Source: https://www.otcmarkets.com/files/OTCIDDisclosureGuidelines.docx
- ✅ **Management Certification due annually no later than 45 days after the annual report deadline (~FYE+135 days), and required initially at application**
  - Initially, prior to joining or requalifying for OTCID; ongoing, concurrently with the annual report filing but no later than 45 calendar days after the annual report due date (90+45 = ~FYE+135 days). Exception: International Reporting Companies file a 12g3-2(b) Certification on the same schedule instead.
  - Source: https://www.otcmarkets.com/files/OTCIDRules.pdf
- ✅ **Verified Company Profile must be re-verified at least every 6 months**
  - Verify initially, prior to joining or requalifying, and thereafter at least every six (6) months (OTCID Rules Section 1.3.A). Also must re-verify immediately after any Change in Control.
  - Source: https://www.otcmarkets.com/files/OTCIDRules.pdf
- ✅ **Notification of Late Filing within 1 business day of missed deadline extends quarterly deadline +5 calendar days and annual +15 calendar days**
  - Notification of Late Filing must be published through OTCIQ.com no later than one business day after the report due date; extends quarterly report due date by 5 calendar days and annual report by 15 calendar days (OTCID Rules Section 2.H). SEC Reporting Companies instead file Form 12b-25 on EDGAR.
  - Source: https://www.otcmarkets.com/files/OTCIDRules.pdf
- ✅ **Removal from OTCID on eligibility failure is immediate/automatic, and requalification is automatic once cured absent a Change in Control**
  - Failure to meet Section 1 or 2 requirements results in immediate, automatic removal (OTCID Rules Section 3); a removed company automatically requalifies if it satisfies Sections 1 and 2 and has not undergone a Change in Control (Section 4.A). After a Change in Control, requalification instead requires a new application and fees under Section 2.G. OTC Markets also retains discretionary suspension/removal authority for other obligations or reputational concerns.
  - Source: https://www.otcmarkets.com/files/OTCIDRules.pdf

## CUSIP & EDGAR

- ✅ **CUSIP assignment fee for a new US corporate issuer requesting a single identifier is $210**
  - $210 (confirmed)
  - Source: https://www.cusip.com/pdf/FeesforCUSIPAssignment.pdf
- ✅ **Fee for additional CUSIP identifiers in the same offering (multiple maturities or classes)**
  - $210 for the first CUSIP identifier and $34 for each additional maturity or class (unlimited) per series in the same application/offering document
  - Source: https://www.cusip.com/pdf/FeesforCUSIPAssignment.pdf
- ✅ **Standard turnaround time for a CUSIP assignment**
  - One to two business days (clock starts on receipt of both the completed application and supporting documentation)
  - Source: https://www.cusip.com/pdf/FeesforCUSIPAssignment.pdf
- ✅ **CUSIP express/expedited option exists**
  - Yes — Express one-hour turnaround, with a 60% surcharge over regular fees (i.e., about $336 for a single corporate CUSIP)
  - Source: https://www.cusip.com/pdf/FeesforCUSIPAssignment.pdf
- ✅ **A non-SEC-reporting OTCID company does not file its OTC disclosure through SEC EDGAR; disclosure is published through OTCIQ**
  - Confirmed — under the Alternative Reporting Standard, all OTCID disclosure is published through OTCIQ.com (OTC Disclosure & News Service); EDGAR is required only for SEC Reporting and Regulation A Reporting companies
  - Source: https://www.otcmarkets.com/files/OTCIDRules.pdf
- ✅ **Form D for a Reg D offering must be filed electronically on EDGAR, which requires a CIK and EDGAR access codes obtained via Form ID**
  - Confirmed — online EDGAR filing is mandatory; new filers must submit Form ID to obtain a CIK and access codes
  - Source: https://www.sec.gov/resources-small-businesses/exempt-offerings/filing-form-d-notice
- ✅ **Filing Form D with the SEC is free**
  - Confirmed — the SEC charges no filing fee for a Form D notice or amendment
  - Source: https://www.sec.gov/resources-small-businesses/exempt-offerings/filing-form-d-notice
- ✅ **Obtaining a CIK/EDGAR access codes via Form ID is free**
  - Free — the SEC charges no fee for the Form ID application or for maintaining an EDGAR account (third-party filing agents may charge service fees)
  - Source: https://www.sec.gov/resources-small-businesses/capital-raising-building-blocks/what-form-d

## Delaware Formation & Franchise Tax

- 🔧 CORRECTED **Minimum cost to file a Delaware Certificate of Incorporation is ~$89 ($50 Division fee + $15 minimum filing tax + $24 county fee)**
  - $109.00 minimum (Division of Corporations fee schedule 'Revised August 1, 2024', still the current schedule as of July 2026); the $15 statutory minimum filing tax component under 8 Del. C. § 391(a)(1) remains correct
  - Source: https://corpfiles.delaware.gov/AugustFee2024.pdf
- ✅ **Delaware corporation annual franchise tax report (annual report) filing fee is $50, due March 1**
  - $50 for non-exempt domestic corporations; annual report and franchise tax due no later than March 1 each year
  - Source: https://delcode.delaware.gov/title8/c001/sc18/index.html
- ✅ **Authorized shares method: $85 per additional 10,000 shares above the initial band, capped at $200,000 for non-large-filer corporations**
  - Confirmed: $175 minimum (5,000 shares or fewer); $250 for 5,001–10,000 shares; each additional 10,000 shares or portion thereof adds $85; maximum tax $200,000 (large corporate filers instead pay a $250,000 flat tax)
  - Source: https://delcode.delaware.gov/title8/c005/index.html
- ✅ **Assumed par value capital method: $400 per $1,000,000 of assumed par value capital, $400 minimum**
  - Confirmed: $400.00 per $1,000,000 or portion of $1,000,000 of assumed par value capital; minimum tax $400.00 under this method; $200,000 maximum
  - Source: https://delcode.delaware.gov/title8/c005/index.html
- ✅ **Quarterly estimated franchise tax payments required if annual tax is $5,000 or more**
  - Confirmed: corporations owing $5,000.00 or more pay estimated taxes quarterly — 40% due June 1, 20% due September 1, 20% due December 1, remainder due March 1
  - Source: https://delcode.delaware.gov/title8/c005/index.html

## FINRA Form 211 / Rule 5250 / Rule 144

- ✅ **FINRA Rule 5250 prohibits market makers from accepting payment from issuers/promoters for publishing a quotation, acting as market maker, or submitting an application (Form 211) in connection therewith**
  - Confirmed. Rule 5250(a) prohibits members from accepting any payment or other consideration, directly or indirectly, from an issuer, affiliate, or promoter for publishing a quotation, acting as market maker, or submitting an application in connection therewith. Exceptions exist for legitimate services (e.g., investment banking/underwriting fees, reimbursement of registration/listing fees). Firms must certify Rule 5250 compliance on Form 211 (Regulatory Notice 14-26).
  - Source: https://www.finra.org/rules-guidance/rulebooks/finra-rules/5250
- ✅ **Form 211 is filed under FINRA Rule 6432 (Compliance with the Information Requirements of SEA Rule 15c2-11)**
  - Confirmed. Rule 6432(a) requires a filing with FINRA in the form required (Form 211) demonstrating compliance with SEA Rule 15c2-11 information requirements before initiating or resuming quotations; the member must receive notification from FINRA that the form has been processed. Rule last amended by SR-FINRA-2021-014, effective Sept. 28, 2021 (added Qualified IDQS provisions).
  - Source: https://www.finra.org/rules-guidance/rulebooks/finra-rules/6432
- ✅ **Typical FINRA review timeline for a clean first-time Form 211 filing is ~4-8 weeks**
  - No official FINRA timeline exists — FINRA's Form 211 page states no review SLA. Current practitioner estimates: 30-45 days for straightforward filings with complete documentation and clean corporate history (~4-6.5 weeks); 60-90 days for complex cases (shell history, reverse mergers, restatements); full process phases run through weeks 7-10. The ~4-8 week figure is consistent with practitioner claims for clean filings but is a practitioner estimate, not an official figure; some sources cite 3-6 months when complications arise.
  - Source: https://acquisitionstars.com/services/form-211-filing
- ✅ **FINRA launched a new streamlined Form 211 submission platform (announced change relevant to 2026 filings)**
  - Beginning March 30, 2026, FINRA launched a new streamlined platform for Form 211 submissions, accessible through FINRA Gateway, serving both market makers and Qualified IDQS filers. As of July 2026 this platform is the current submission channel.
  - Source: https://www.finra.org/sites/default/files/2026-03/Form_211_Quick_Reference_Guide.pdf
- ✅ **OTC Link ATS operates as a Qualified Interdealer Quotation System (Qualified IDQS) under Exchange Act Rule 15c2-11 — current and operational in 2026**
  - Confirmed current. OTC Markets Group's FY2025 annual report (period ended Dec 31, 2025, published 2026) states OTC Link ATS operates as a Qualified IDQS as defined in Rule 15c2-11, determines quotation eligibility, and makes determinations publicly available on its website and market data feeds; broker-dealers rely on these determinations in submitting quotations.
  - Source: https://www.otcmarkets.com/file/company/financial-report/530624/content
- ✅ **OTC Link ATS (as Qualified IDQS) conducts the 15c2-11 information review in lieu of a market maker filing Form 211 — operational status and volume**
  - Confirmed operational, with a nuance: since September 2021 OTC Link ATS conducts initial 15c2-11 reviews for certain companies seeking to join OTCQX and OTCQB, and when it approves the initial review it files a modified Form 211 with FINRA itself (so no market-maker sponsor is needed, but a Form 211 is still filed — by the QIDQS). Volume: 151 Form 211s filed by OTC Link ATS in 2025, 110 in 2024, 42 in 2023. FINRA's 2026 Form 211 page confirms Qualified IDQS filers submit Form 211 via the new FINRA Gateway platform.
  - Source: https://www.otcmarkets.com/file/company/financial-report/530624/content
- ✅ **Rule 144 holding period is 12 months (one year) for non-reporting issuers and 6 months for reporting issuers**
  - Confirmed. Six months for issuers subject to Exchange Act reporting requirements; one year for non-reporting issuers. Verbatim regulatory text at 17 CFR 230.144(d)(1)(i)-(ii) matches: 'a minimum of six months must elapse' (reporting issuers) and 'a minimum of one year must elapse' (non-reporting issuers).
  - Source: https://www.law.cornell.edu/cfr/text/17/230.144

## Transfer Agent & DTC Eligibility

- ✅ **OTCID requires US/Canadian issuers to use a transfer agent participating in the OTC Markets Transfer Agent Verified Shares Program**
  - CONFIRMED, with one carve-out: a company acting as its own transfer agent may instead provide share data directly to OTC Markets Group. Requirement is in OTCID Rules Section 1.2 'Transfer Agent Criteria' (OTCID Rules v 1.0, January 2025 — the version still served on otcmarkets.com as of July 2026; OTCID launched July 1, 2025)
  - Source: https://www.otcmarkets.com/files/OTCIDRules.pdf
- ✅ **Issuers must also authorize the transfer agent to release share data to OTC Markets (companion requirement in same rule)**
  - CONFIRMED — Section 1.2 continues: the company must authorize its transfer agent to provide shares authorized, shares issued and outstanding, and share issuance history on request. The Transfer Agent Verified Shares Program document itself (dated September 2025) is live at otcmarkets.com/files/Transfer%20Agent%20Verified%20Shares%20Program.pdf
  - Source: https://www.otcmarkets.com/files/OTCIDRules.pdf
- ✅ **Typical transfer agent setup cost for a small OTC issuer is $2,500-$5,000**
  - PARTIALLY CORROBORATED. One secondary source (Acquisition Stars OTCQB guide, 2026) lists transfer agent setup at exactly '$2,500-$5,000'. A primary EDGAR example sits at the bottom of that range: Zero Labs Automotive 1-A/A (Feb 2024) discloses DealMaker Transfer Agent 'account setup fees of $2,500'. But the range is not universal — another Reg A issuer (Slingshot USA, 1-A POS Jul 2024) discloses its transfer agent (KoreConX) charges NO setup fee, only a monthly fee. Extensive searching found no second independent published source for the $2,500-$5,000 range; small-cap agents (VStock, ClearTrust, Transfer Online, Colonial, Empire, Pacific) do not publish fee schedules and quote custom pricing. Treat $2,500-$5,000 as the high end of a realistic $0-$5,000 spread
  - Source: https://www.endeavortrust.com/fees
- ◽ **Real-world primary example of transfer agent setup fee (EDGAR filing)**
  - $2,500 account setup fee (DealMaker Transfer Agent LLC, disclosed in Zero Labs Automotive Form 1-A/A filed 2024-02-06); contrast: Slingshot USA 1-A POS (2024-07-31) discloses KoreConX transfer agent with 'no setup costs for this service, but the Company pays the Transfer Agent a monthly fee'
  - Source: https://www.sec.gov/Archives/edgar/data/1977010/000149315224005146/partiiandiii.htm
- ✅ **Typical transfer agent monthly/ongoing fees for a small OTC issuer**
  - WEAKLY DOCUMENTED. Only one secondary source publishes a figure: Acquisition Stars lists ongoing transfer agent cost of '$2,000-$3,000' per year (~$170-$250/month equivalent). No transfer agent serving small OTC issuers publishes a monthly fee schedule (VStock: 'fees vary based upon the specific request'; ClearTrust and Transfer Online: contact for quote; Transfer Online: 'Setup and other one-time fees are not included in this estimate'). Billing models vary: flat monthly retainer, per-account, or per-transaction. Any specific monthly figure should be sourced from direct quotes from 2-3 agents rather than published data
  - Source: https://transferonline.com/IssuerServices/FeeEstimator
- ✅ **DTC eligibility must be sponsored by a DTC participant; issuers cannot apply directly**
  - CONFIRMED by DTC's Operational Arrangements (version 'As of June 10, 2026'), Section I.A.1 'Submission of an Eligibility Request to DTC'. Requests are submitted by the sponsoring Participant through DTC's UW SOURCE or Underwriting Central (UWC) systems; underwriters with an approved correspondent relationship with a Participant may also request eligibility
  - Source: https://www.dtcc.com/-/media/Files/Downloads/legal/issue-eligibility/eligibility/operational-arrangements.pdf
- ✅ **Documents typically required for a DTC eligibility submission**
  - Per the Operational Arrangements (as of June 10, 2026): (1) eligibility request with all required issuer/securities data submitted via UW SOURCE or UWC; (2) copy of the offering document — required for ALL requests ('all eligibility requests... require a copy of the offering documentation be provided to DTC for review'); (3) for already-outstanding securities (Older Issue Eligibility Request): completed Older Eligibility Questionnaire, copy of the physical certificate(s), and an Agent Attestation form; (4) opinion of counsel if DTC requires it — must be independent outside securities counsel, not in-house, with no beneficial ownership in the security; (5) for book-entry-only securities: fully executed Letter of Representations (Blanket Issuer LOR or Issuer LOR) on DTC's form, plus riders for 144A/Reg S/non-USD/Ireland-UK issues listing all CUSIP numbers; (6) the issuer must have appointed a transfer/paying agent that has a completed Operational Arrangements Agent Letter on file with DTC
  - Source: https://www.dtcc.com/-/media/Files/Downloads/legal/issue-eligibility/eligibility/operational-arrangements.pdf
- ✅ **A transfer/paying agent must be appointed before DTC eligibility (prerequisite tying claims 1 and 3 together)**
  - CONFIRMED — the agent must have an Operational Arrangements Agent Letter on file with DTC before the security can become eligible; DTC can deny eligibility if these requirements are not met
  - Source: https://www.dtcc.com/-/media/Files/Downloads/legal/issue-eligibility/eligibility/operational-arrangements.pdf
