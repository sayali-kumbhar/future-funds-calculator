import { CALCULATORS_LIST } from '../src/calculators/index';

interface Issue {
  slug: string;
  name: string;
  type: string;
  message: string;
}

const issues: Issue[] = [];
let totalCalculators = CALCULATORS_LIST.length;
let passedCalculators = 0;

console.log(`[AUDIT] Starting automated calculation check across all ${totalCalculators} calculators...\n`);

CALCULATORS_LIST.forEach((calc, idx) => {
  const slug = calc.slug;
  const name = calc.name;

  if (!calc.calculate) {
    issues.push({ slug, name, type: 'MISSING_CALCULATE', message: 'No calculate function defined' });
    return;
  }

  // 1. Check Fields
  if (!calc.fields || calc.fields.length === 0) {
    issues.push({ slug, name, type: 'NO_FIELDS', message: 'No input fields defined' });
  }

  // Build default inputs from fields
  const defaultInputs: Record<string, any> = {};
  calc.fields.forEach(f => {
    defaultInputs[f.key] = f.defaultValue;
  });

  // 2. Test calculate with default inputs
  try {
    const result = calc.calculate(defaultInputs, '$');
    if (!result) {
      issues.push({ slug, name, type: 'NULL_RESULT', message: 'Returned null or undefined with default inputs' });
      return;
    }

    // Check metrics
    if (!result.metrics || !Array.isArray(result.metrics) || result.metrics.length === 0) {
      issues.push({ slug, name, type: 'NO_METRICS', message: 'Result metrics array is empty' });
    } else {
      result.metrics.forEach(m => {
        if (typeof m.value === 'number') {
          if (isNaN(m.value) || !isFinite(m.value)) {
            issues.push({ slug, name, type: 'NAN_METRIC', message: `Metric ${m.label} produced ${m.value}` });
          }
        } else if (typeof m.value === 'string') {
          if (m.value.includes('NaN') || m.value.includes('Infinity') || m.value.includes('undefined')) {
            issues.push({ slug, name, type: 'NAN_STRING_METRIC', message: `Metric ${m.label} produced string "${m.value}"` });
          }
        }
      });
    }

    // Check chartData
    if (result.chartData) {
      if (!Array.isArray(result.chartData)) {
        issues.push({ slug, name, type: 'INVALID_CHART', message: 'chartData is not an array' });
      } else {
        result.chartData.forEach((item, cIdx) => {
          if (typeof item.value === 'number') {
            if (isNaN(item.value) || !isFinite(item.value)) {
              issues.push({ slug, name, type: 'NAN_CHART_VALUE', message: `chartData[${cIdx}] (${item.name}) has value ${item.value}` });
            }
          }
        });
      }
    }
  } catch (err: any) {
    issues.push({ slug, name, type: 'RUNTIME_ERROR_DEFAULT', message: `Crashed on default inputs: ${err?.message || err}` });
  }

  // 3. Test calculate with zeros / boundary inputs
  try {
    const zeroInputs: Record<string, any> = {};
    calc.fields.forEach(f => {
      zeroInputs[f.key] = 0;
    });
    const zeroResult = calc.calculate(zeroInputs, '$');
    if (zeroResult && zeroResult.metrics) {
      zeroResult.metrics.forEach(m => {
        if (typeof m.value === 'number' && (isNaN(m.value) || !isFinite(m.value))) {
          issues.push({ slug, name, type: 'ZERO_INPUT_NAN', message: `Zero inputs produced ${m.value} for ${m.label}` });
        } else if (typeof m.value === 'string' && (m.value.includes('NaN') || m.value.includes('Infinity'))) {
          issues.push({ slug, name, type: 'ZERO_INPUT_NAN_STR', message: `Zero inputs produced ${m.value} for ${m.label}` });
        }
      });
    }
  } catch (err: any) {
    issues.push({ slug, name, type: 'RUNTIME_ERROR_ZEROS', message: `Crashed on zero inputs: ${err?.message || err}` });
  }

  // 4. Test calculate with empty inputs object {}
  try {
    const emptyResult = calc.calculate({}, '$');
    if (emptyResult && emptyResult.metrics) {
      emptyResult.metrics.forEach(m => {
        if (typeof m.value === 'number' && (isNaN(m.value) || !isFinite(m.value))) {
          issues.push({ slug, name, type: 'EMPTY_INPUT_NAN', message: `Empty inputs {} produced ${m.value} for ${m.label}` });
        } else if (typeof m.value === 'string' && (m.value.includes('NaN') || m.value.includes('Infinity'))) {
          issues.push({ slug, name, type: 'EMPTY_INPUT_NAN_STR', message: `Empty inputs {} produced ${m.value} for ${m.label}` });
        }
      });
    }
  } catch (err: any) {
    issues.push({ slug, name, type: 'RUNTIME_ERROR_EMPTY', message: `Crashed on empty inputs {}: ${err?.message || err}` });
  }

  const calcIssues = issues.filter(i => i.slug === slug);
  if (calcIssues.length === 0) {
    passedCalculators++;
  }
});

console.log(`[RESULTS] Audited ${totalCalculators} calculators:`);
console.log(`  Passed cleanly: ${passedCalculators}`);
console.log(`  Calculators with issues: ${totalCalculators - passedCalculators}`);

if (issues.length > 0) {
  console.log(`\n[DETAILED ISSUES FOUND: ${issues.length} total]`);
  issues.forEach(iss => {
    console.log(`- [${iss.slug}] (${iss.type}): ${iss.message}`);
  });
} else {
  console.log(`\nALL CALCULATOR CALCULATIONS PASSED PERFECTLY! 100% HEALTHY.`);
}
