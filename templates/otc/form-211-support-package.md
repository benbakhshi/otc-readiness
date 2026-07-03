<!-- TEMPLATE: Form 211 Support Package (information the sponsoring market maker / OTC Markets needs) -->
<!-- The company does not file Form 211 itself — a FINRA member market maker (or OTC Markets as a qualified IDQS) does. -->
<!-- This package assembles everything they will ask for, generated from the master file. -->

# FORM 211 SUPPORT PACKAGE — {{company.legal_name}}

**Prepared:** {{today}}
**Target tier:** {{otc.tier_target}}
**Desired symbol:** {{securities.desired_ticker}} | **CUSIP:** {{securities.cusip}}

## A. Issuer Information (Rule 15c2-11(b) items)

1. **Exact name of issuer and predecessors:** {{company.legal_name}}{{#if company.predecessor_names.length}} (predecessors: {{company.predecessor_names}}){{/if}}
2. **Address of principal executive offices:** {{company.address_street}}, {{company.address_city}}, {{company.address_state}} {{company.address_zip}}
3. **State of incorporation:** {{company.state_of_incorporation}} ({{company.date_of_incorporation}})
4. **Exact title and class of the security:** {{securities.common.class_name}}, par ${{securities.common.par_value}}
5. **Transfer agent:** {{service_providers.transfer_agent.name}} (SEC-registered: {{service_providers.transfer_agent.sec_registered}})
6. **Issuer's business, products, services:** {{company.business_description}}
7. **Nature and extent of facilities:** [see Disclosure Statement §5]
8. **Officers and directors:** [see Disclosure Statement §6]
9. **Total shares outstanding:** {{securities.common.outstanding_shares|num}} | **Public float:** {{securities.free_trading_shares|num}} | **Holders of record:** {{securities.common.holders_of_record|num}}
10. **Recent financial statements:** balance sheet, income statement, cash flow, changes in equity + notes (US GAAP) for the two most recent fiscal years (or since inception) and any interim period — attached
11. **Whether the issuer or its predecessor was a shell:** {{company.is_shell}}

## B. Supporting Documents Checklist

- [ ] Certificate of Incorporation (certified copy) and all amendments
- [ ] Bylaws
- [ ] Current Disclosure Statement posted on OTCIQ
- [ ] Financial statements (2 fiscal years or since inception + interim)
- [ ] Shareholder list from transfer agent (certified, showing holders of record and share ranges)
- [ ] Issuance history with board consents and subscription agreements for EVERY issuance
- [ ] Evidence of consideration paid for shares (bank records, invoices for services)
- [ ] Rule 144 / tradability analysis from securities counsel for the float
- [ ] CUSIP confirmation from CUSIP Global Services
- [ ] Officer/director questionnaires (background, disciplinary history)
- [ ] Transfer agent contact authorization

## C. Frequently Asked Market-Maker Diligence Questions

Prepare written answers before approaching a market maker:

1. How did each holder of free-trading shares acquire them, and what is the Rule 144 analysis for each block?
2. Is any officer, director, control person or promoter subject to a bad-actor disqualification (Rule 506(d))?
3. Who paid for the company's formation and operating costs, and are there undisclosed control persons?
4. Are there any consultants/promoters with share compensation? (Disclose — this is a focus area.)
5. Is the shareholder base genuinely dispersed (typically 30–50+ round-lot unaffiliated holders expected)?
