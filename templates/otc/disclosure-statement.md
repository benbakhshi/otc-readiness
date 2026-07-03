<!-- TEMPLATE: OTC Markets Disclosure Statement (OTCID Disclosure Guidelines, Alternative Reporting Standard) -->
<!-- Used for: Initial Disclosure, Annual Report, and Quarterly Report on the OTCID Basic Market. -->
<!-- Structure follows the OTCID Disclosure Guidelines v5 (July 1, 2025), successor to the Pink Basic Disclosure -->
<!-- Guidelines. Confirm against the current guidelines document at otcmarkets.com before each filing. -->
<!-- Financial statements must be included in the SAME document and be machine-readable (no scanned images). -->

# {{company.legal_name|upper}}
## DISCLOSURE STATEMENT — [INITIAL / ANNUAL / QUARTERLY] REPORT
### For the period ended **[PERIOD END DATE]**

*Prepared in accordance with the OTCID Disclosure Guidelines (Alternative Reporting Standard).*

**Shares of {{securities.common.class_name}} outstanding as of [CURRENT PERIOD END]:** {{securities.common.outstanding_shares|num}}
**Shares outstanding as of prior fiscal year end [PRIOR FYE DATE]:** [NUMBER]
**Is the issuer a shell company (Rule 405 / Rule 12b-2 / Rule 15c2-11)?** {{company.is_shell}} — **Has shell status changed since the prior period?** [No / Yes]
**Has there been a Change in Control (50% voting power, sale of substantially all assets, board majority turnover within 2 years, or merger) during the period?** [No / Yes — describe]

---

## 1) Name and Address of the Issuer and Its Predecessors

**Exact name:** {{company.legal_name}}
**Prior names (past five years):** {{company.predecessor_names}}
**Address of principal executive offices:** {{company.address_street}}, {{company.address_city}}, {{company.address_state}} {{company.address_zip}}
**Phone:** {{company.phone}} | **Email:** {{company.email}} | **Website:** {{company.website}}
**State of incorporation:** {{company.state_of_incorporation}} (incorporated {{company.date_of_incorporation}})
**Fiscal year end:** {{company.fiscal_year_end}}
**Has the issuer or any predecessor been in bankruptcy, receivership or similar proceeding?** [No / describe]
**Has there been a change of control, name change, or material reclassification in the past 12 months?** [No / describe]
**SIC code:** {{company.sic_code}}

## 2) Security Information

**Transfer agent:** {{service_providers.transfer_agent.name}}, {{service_providers.transfer_agent.address}}, {{service_providers.transfer_agent.phone}}
**Is the transfer agent registered under the Exchange Act?** {{service_providers.transfer_agent.sec_registered}}

**Publicly quoted or traded securities:**

| Item | Value |
|------|-------|
| Trading symbol | {{securities.desired_ticker}} |
| CUSIP | {{securities.cusip}} |
| Class | {{securities.common.class_name}} |
| Par value | ${{securities.common.par_value}} |
| Shares authorized | {{securities.common.authorized_shares|num}} |
| Shares outstanding | {{securities.common.outstanding_shares|num}} |
| Freely tradable shares (public float) | {{securities.free_trading_shares|num}} |
| Restricted shares | {{securities.restricted_shares|num}} |
| Total shareholders of record | {{securities.common.holders_of_record|num}} |
| *(as of date)* | [DATE] |

**Other classes authorized but not publicly traded:** {{securities.preferred.class_name}} — {{securities.preferred.authorized_shares|num}} authorized, {{securities.preferred.outstanding_shares|num}} outstanding.

**Security description (rights/preferences):** One vote per share of Common Stock; no preemptive, conversion or redemption rights; dividends when and as declared by the Board. Preferred Stock issuable in series with terms fixed by the Board ("blank check").

## 3) Issuance History

*All events resulting in changes to total shares outstanding of any class in the past two completed fiscal years and any subsequent interim period:*

| # | Date | Holder | Class | Shares Issued | Price/Share | Nature of Consideration | Exemption Relied Upon | Restricted? |
|---|------|--------|-------|---------------|-------------|-------------------------|------------------------|-------------|
{{#each issuance_history}}
| {{@index1}} | {{date}} | {{holder}} | {{class}} | {{shares|num}} | {{price_per_share}} | {{consideration}} | {{exemption}} | {{restricted}} |
{{/each}}

**Opening balance (start of period covered):** [NUMBER] shares — **Closing balance:** {{securities.common.outstanding_shares|num}} shares

**Outstanding convertible debt** (required table — every note, with the control person named for entity holders):

| Issuance Date | Noteholder (control person if entity) | Principal at Issuance | Outstanding Balance (incl. accrued interest) | Maturity | Conversion Terms / Pricing Mechanism | Reason for Issuance |
|---|---|---|---|---|---|---|
| [None outstanding] | | | | | | |

**Options, warrants or other rights to acquire shares:** [None / describe]

## 4) Issuer's Business, Products and Services

**A. Description of the business:**
{{company.business_description}}

**B. Principal products or services and their markets:**
[Describe]

**C. Subsidiaries:** [None / list]

## 5) Issuer's Facilities

[Describe principal offices/facilities, owned or leased, terms, and state of operations: {{state_of_business_operations}}]

## 6) Officers, Directors, and Control Persons

**A. Officers and Directors:**

| Name | Title(s) | Since | Approx. hours/week | Biography |
|------|----------|-------|--------------------|-----------|
{{#each officers}}
| {{name}} | {{title}} | {{since}} | {{hours_per_week}} | {{bio}} |
{{/each}}
{{#each directors}}
| {{name}} | Director{{#if independent}} (independent){{/if}} | {{since}} |  | {{bio}} |
{{/each}}

**B. Beneficial owners of more than 5% of any class:**

| Holder | Class | Shares | % of Class | Notes |
|--------|-------|--------|------------|-------|
{{#each beneficial_owners_over_5pct}}
| {{holder}} | {{class}} | {{shares|num}} | {{pct}} | {{notes}} |
{{/each}}

**C. Legal/Disciplinary History (past 10 years, for each officer, director and control person):** Has any such person been the subject of: (1) a criminal conviction or pending criminal proceeding; (2) an order/judgment enjoining them from securities, banking or insurance activities; (3) an SEC/CFTC finding of a violation; (4) an SRO disciplinary action? **[No / describe]**

**D. Family relationships among officers/directors/control persons:** [None / describe]

**E. Related-party transactions:** [None / describe]

## 7) Legal Proceedings

{{legal_proceedings}}

## 8) Third-Party Service Providers

| Role | Name | Firm | Address | Phone/Email |
|------|------|------|---------|-------------|
| Securities counsel | {{service_providers.securities_counsel.name}} | {{service_providers.securities_counsel.firm}} | {{service_providers.securities_counsel.address}} | {{service_providers.securities_counsel.email}} |
| Accountant/Auditor | {{service_providers.accountant.name}} | {{service_providers.accountant.firm}} | {{service_providers.accountant.address}} | {{service_providers.accountant.phone}} |
| Investor relations | {{service_providers.investor_relations.name}} | {{service_providers.investor_relations.firm}} | | |

## 9) Financial Statements

**Prepared by:** [Name and qualifications of the person who prepared this disclosure statement]
**Financial statements prepared by:** [Name, firm, qualifications] — in accordance with: ☐ U.S. GAAP ☐ IFRS

The following financial statements are included in this document (machine-readable, presented comparatively against the prior fiscal year end / prior comparable period):

- [ ] Balance Sheet as of [PERIOD END] and [PRIOR FYE]
- [ ] Statement of Income for the [period] then ended (and comparable prior period)
- [ ] Statement of Cash Flows for the [period] then ended (and comparable prior period)
- [ ] Statement of Retained Earnings / Changes in Stockholders' Equity
- [ ] Notes to Financial Statements (including going-concern disclosure if applicable)
- [ ] Audit letter (only if audited)

**Audit status:** [Unaudited — audit not required on OTCID; annual Management Certification submitted via OTCIQ / Audited by {{service_providers.accountant.firm}}]

## 10) Issuer Certification

*(Both the CEO and CFO must certify in every quarterly and annual report. If one person holds both offices, state so and sign once in both capacities.)*

I, **{{officers.0.name}}**, certify that:

1. I have reviewed this disclosure statement of {{company.legal_name}};
2. Based on my knowledge, this disclosure statement does not contain any untrue statement of a material fact or omit to state a material fact necessary to make the statements made, in light of the circumstances under which they were made, not misleading with respect to the period covered by this disclosure statement; and
3. Based on my knowledge, the financial statements, and other financial information included or incorporated by reference in this disclosure statement, fairly present in all material respects the financial condition, results of operations and cash flows of the issuer as of, and for, the periods presented.

**Date:** [DATE]

&nbsp;

_______________________________
{{officers.0.name}}, {{officers.0.title}}

I, **{{officers.1.name}}**, certify the same statements 1–3 above.

**Date:** [DATE]

&nbsp;

_______________________________
{{officers.1.name}}, {{officers.1.title}}
