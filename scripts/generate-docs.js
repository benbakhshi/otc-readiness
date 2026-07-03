#!/usr/bin/env node
// generate-docs.js — fills every template in templates/ with values from master/company-master.json
// and writes the results to generated/, preserving folder structure.
//
// Template syntax:
//   {{path.to.value}}            insert value (dot path into master data)
//   {{path|num}}                 format number with thousands separators
//   {{path|upper}}               uppercase
//   {{today}}                    today's date (long form)
//   {{#each path.to.array}}...{{/each}}   repeat block per item; inside, {{field}} resolves
//                                          against the item first, then the root. {{@index1}} = 1-based row number.
//   {{#if path}}...{{/if}}       include block only if value is truthy (empty string/0/false/[] are falsy)
//
// Usage: node scripts/generate-docs.js [--check]
//   --check  validate only (report unresolved placeholders and reconciliation issues, write nothing)

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TEMPLATES = path.join(ROOT, 'templates');
const OUT = path.join(ROOT, 'generated');
const MASTER = path.join(ROOT, 'master', 'company-master.json');

function loadMaster() {
  const data = JSON.parse(fs.readFileSync(MASTER, 'utf8'));
  // Derived values available to all templates
  data.today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  data.directors_count = (data.directors || []).length;
  if (data.securities) {
    data.securities.total_authorized =
      Number(data.securities.common?.authorized_shares || 0) +
      Number(data.securities.preferred?.authorized_shares || 0);
  }
  return data;
}

function get(obj, dotPath) {
  return dotPath.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

function resolve(expr, scopes) {
  // scopes: array of objects, innermost first
  const [rawPath, filter] = expr.split('|').map(s => s.trim());
  let val;
  for (const scope of scopes) {
    val = get(scope, rawPath);
    if (val !== undefined) break;
  }
  if (val === undefined || val === null) return undefined;
  if (Array.isArray(val)) val = val.join(', ');
  if (filter === 'num' && val !== '' && !isNaN(Number(val))) val = Number(val).toLocaleString('en-US');
  if (filter === 'upper') val = String(val).toUpperCase();
  if (typeof val === 'boolean') val = val ? 'Yes' : 'No';
  return String(val);
}

function truthy(val) {
  if (val === undefined || val === null || val === false || val === 0 || val === '') return false;
  if (Array.isArray(val)) return val.length > 0;
  return true;
}

function render(tpl, scopes, unresolved) {
  // #each blocks (innermost first via non-greedy match, iterate until stable)
  let out = tpl;
  const blockRe = /\{\{#(each|if) ([^}]+)\}\}([\s\S]*?)\{\{\/\1\}\}/;
  let m;
  while ((m = blockRe.exec(out))) {
    const [whole, kind, arg, body] = m;
    let replacement = '';
    if (kind === 'each') {
      let arr;
      for (const scope of scopes) { arr = get(scope, arg.trim()); if (arr !== undefined) break; }
      if (Array.isArray(arr)) {
        replacement = arr.map((item, i) => {
          const itemScope = typeof item === 'object' && item !== null ? { ...item } : { this: item };
          itemScope['@index1'] = i + 1;
          return render(body.replace(/^\n/, ''), [itemScope, ...scopes], unresolved);
        }).join('');
      }
    } else { // #if
      let val;
      for (const scope of scopes) { val = get(scope, arg.trim()); if (val !== undefined) break; }
      replacement = truthy(val) ? render(body, scopes, unresolved) : '';
    }
    out = out.slice(0, m.index) + replacement + out.slice(m.index + whole.length);
  }
  // simple placeholders
  out = out.replace(/\{\{([^#/][^}]*)\}\}/g, (whole, expr) => {
    const val = resolve(expr.trim(), scopes);
    if (val === undefined) { unresolved.push(expr.trim()); return `[[MISSING: ${expr.trim()}]]`; }
    return val;
  });
  return out;
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : (e.name.endsWith('.md') ? [p] : []);
  });
}

function reconcile(master) {
  const issues = [];
  const ledgerTotal = (master.issuance_history || []).reduce((s, r) => s + Number(r.shares || 0), 0);
  const outstanding = Number(master.securities?.common?.outstanding_shares || 0);
  if (ledgerTotal !== outstanding) {
    issues.push(`Issuance history totals ${ledgerTotal.toLocaleString()} shares but outstanding_shares is ${outstanding.toLocaleString()} — these must reconcile.`);
  }
  const rf = Number(master.securities?.restricted_shares || 0) + Number(master.securities?.free_trading_shares || 0);
  if (rf !== outstanding && rf !== 0) {
    issues.push(`restricted + free_trading (${rf.toLocaleString()}) does not equal outstanding (${outstanding.toLocaleString()}).`);
  }
  const auth = Number(master.securities?.common?.authorized_shares || 0);
  if (outstanding > auth) issues.push(`Outstanding shares exceed authorized shares.`);
  return issues;
}

function main() {
  const checkOnly = process.argv.includes('--check');
  const master = loadMaster();
  const issues = reconcile(master);
  const results = [];

  for (const file of walk(TEMPLATES)) {
    const rel = path.relative(TEMPLATES, file);
    const unresolved = [];
    const rendered = render(fs.readFileSync(file, 'utf8'), [master], unresolved);
    results.push({ template: rel, unresolved: [...new Set(unresolved)] });
    if (!checkOnly) {
      const dest = path.join(OUT, rel);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, rendered);
    }
  }

  const report = { generated_at: new Date().toISOString(), check_only: checkOnly, reconciliation_issues: issues, files: results };
  if (!checkOnly) fs.writeFileSync(path.join(OUT, '_generation-report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  return report;
}

if (require.main === module) main();
module.exports = { main, loadMaster, render, reconcile };
