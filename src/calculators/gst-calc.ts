import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
  slug: 'gst-calc',
  name: 'GST Calculator',
  category: 'savings_budget',
  metaTitle: 'GST Calculator - Add or Remove Goods and Services Tax',
  metaDesc: 'Quickly calculate Goods and Services Tax (GST) for any price. Add or remove GST with standard slabs (5%, 12%, 18%, 28%) and view Central (CGST) and State (SGST) breakdowns.',
  primaryKeyword: 'GST Calculator',
  formulaName: 'Goods and Services Tax formulas',
  formulaDesc: 'Add GST: Total = Price * (1 + GST%); Remove GST: Original = Price / (1 + GST%)',
  explanation: 'Calculates the net price, GST amount, and gross price. It also displays the intra-state CGST and SGST split (50% each) commonly required for tax bookkeeping.',
  example: 'For a ₹10,000 service exclusive of 18% GST: adding GST gives a total price of ₹11,800, with ₹900 CGST and ₹900 SGST. For a ₹10,000 product inclusive of 18% GST: removing GST yields a pre-tax price of ₹8,474.58 and ₹1,525.42 in GST.',
  relatedSlugs: ['budget', 'net-worth', 'expense-ratio-calc'],
  fields: [
    { key: 'amount', label: 'Amount / Price', type: 'number', defaultValue: 10000, isCurrency: true },
    { 
      key: 'gstRate', 
      label: 'GST Slab (%)', 
      type: 'select', 
      defaultValue: 18,
      options: [
        { label: '5% (Essentials / Apparel)', value: 5 },
        { label: '12% (Electronics / Processed Foods)', value: 12 },
        { label: '18% (Services / IT / General Goods)', value: 18 },
        { label: '28% (Luxury / Automobile / ACs)', value: 28 }
      ]
    },
    {
      key: 'taxAction',
      label: 'Calculation Type',
      type: 'select',
      defaultValue: 'add',
      options: [
        { label: 'Add GST (Amount is Exclusive of GST)', value: 'add' },
        { label: 'Remove GST (Amount is Inclusive of GST)', value: 'remove' }
      ]
    }
  ],
  faqs: [
    { question: 'What is CGST, SGST, and IGST?', answer: 'For transactions within the same state (intra-state), GST is split equally into CGST (Central GST) and SGST (State GST) which go to the central and state governments respectively. For cross-border transactions (inter-state), a single unified IGST (Integrated GST) is charged.' },
    { question: 'How do you calculate inclusive GST back to pre-tax amount?', answer: 'To remove GST, divide the total price by (1 + GST rate / 100). For example, to remove 18% GST from ₹11,800: ₹11,800 / 1.18 = ₹10,000 (pre-tax amount). The difference of ₹1,800 is the GST portion.' },
    { question: 'Is GST tax-deductible for registered businesses?', answer: 'Yes. Businesses with a GST registration can claim "Input Tax Credit" (ITC) to offset the GST they paid on business purchases against the GST they collect from customers, preventing double taxation.' }
  ],
  calculate: (inputs, currency) => {
    const amount = inputs.amount || 0;
    const gstRate = Number(inputs.gstRate) || 18;
    const action = inputs.taxAction || 'add';

    let preTaxAmount = 0;
    let totalGst = 0;
    let postTaxAmount = 0;

    if (action === 'add') {
      preTaxAmount = amount;
      totalGst = amount * (gstRate / 100);
      postTaxAmount = amount + totalGst;
    } else {
      postTaxAmount = amount;
      preTaxAmount = amount / (1 + gstRate / 100);
      totalGst = amount - preTaxAmount;
    }

    const cgst = totalGst / 2;
    const sgst = totalGst / 2;

    const chartData = [
      { name: 'Pre-Tax Value', value: Math.round(preTaxAmount) },
      { name: 'CGST (Central)', value: Math.round(cgst) },
      { name: 'SGST (State)', value: Math.round(sgst) }
    ];

    // Map keys so the chart renders properly in the UI
    const mappedChartData = [
      { year: 'Pre-Tax Cost', balance: Math.round(preTaxAmount), contributions: Math.round(preTaxAmount) },
      { year: 'Tax Portion', balance: Math.round(preTaxAmount + totalGst), contributions: Math.round(preTaxAmount) }
    ];

    return {
      metrics: [
        { label: 'Final Gross Price (Post-Tax)', value: Math.round(postTaxAmount), isPrimary: true, desc: 'Total cost to customer' },
        { label: 'Pre-Tax Net Price', value: Math.round(preTaxAmount), desc: 'Base cost excluding tax' },
        { label: 'Total GST Amount', value: Math.round(totalGst), desc: 'Aggregated tax portion' },
        { label: 'CGST (Central GST - 50%)', value: Math.round(cgst), desc: 'Central Govt share' },
        { label: 'SGST (State GST - 50%)', value: Math.round(sgst), desc: 'State Govt share' }
      ],
      chartData: mappedChartData,
      explanationText: action === 'add' 
        ? `Adding ${gstRate}% GST to a base price of ${preTaxAmount.toLocaleString()} results in ${Math.round(postTaxAmount).toLocaleString()} gross price. This includes ${Math.round(totalGst).toLocaleString()} in total GST, split into ${Math.round(cgst).toLocaleString()} Central GST (CGST) and ${Math.round(sgst).toLocaleString()} State GST (SGST).`
        : `Removing ${gstRate}% GST from an inclusive price of ${postTaxAmount.toLocaleString()} yields a base net price of ${Math.round(preTaxAmount).toLocaleString()} and ${Math.round(totalGst).toLocaleString()} in total taxes (split equally into ${Math.round(cgst).toLocaleString()} CGST and SGST).`
    };
  }
};
