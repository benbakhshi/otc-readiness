<!-- TEMPLATE: Stock Ledger / Issuance Register -->
<!-- Auto-generated from issuance_history in the master file. This is the record your transfer agent and sponsoring market maker will reconcile against. -->

# STOCK LEDGER — {{company.legal_name}}

**State of incorporation:** {{company.state_of_incorporation}}
**Authorized:** {{securities.common.authorized_shares|num}} shares of {{securities.common.class_name}} (par ${{securities.common.par_value}}); {{securities.preferred.authorized_shares|num}} shares of {{securities.preferred.class_name}} (par ${{securities.preferred.par_value}})
**Outstanding ({{securities.common.class_name}}):** {{securities.common.outstanding_shares|num}}
**Holders of record:** {{securities.common.holders_of_record|num}}
**Ledger generated:** {{today}}

## Issuance History

| # | Date | Holder | Class | Shares | Price/Share | Consideration | Exemption | Restricted |
|---|------|--------|-------|--------|-------------|---------------|-----------|------------|
{{#each issuance_history}}
| {{@index1}} | {{date}} | {{holder}} | {{class}} | {{shares|num}} | {{price_per_share}} | {{consideration}} | {{exemption}} | {{restricted}} |
{{/each}}

## Reconciliation Note

Total shares in the issuance history above must equal outstanding shares stated in the master file. The web app dashboard flags any mismatch. Every row must be supported in the corporate records by: (1) a board consent authorizing the issuance, (2) an executed purchase/subscription agreement, and (3) evidence of consideration received.
