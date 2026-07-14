import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
  slug: 'rideshare-vs-car',
  name: 'Ride-Sharing vs. Car Ownership Analyzer',
  category: 'loans_debt',
  metaTitle: 'Ride-Sharing (Uber/Lyft) vs Car Ownership Calculator',
  metaDesc: 'Compare the true annual cost of owning, insuring, fueling, and maintaining a vehicle against utilizing ride-sharing services like Uber or Lyft.',
  primaryKeyword: 'Rideshare vs Car Calculator',
  formulaName: 'True vehicle cost vs ridesharing calculation model',
  formulaDesc: 'Car Cost = Depreciation (12%) + Fuel + Maintenance (2%) + Insurance + Parking. Rideshare Cost = Trip Cost * Trips Per Week * 52.',
  explanation: 'Performs a comprehensive cost-per-mile analysis of car ownership (including steep hidden variables like asset depreciation and preventative maintenance) and contrasts it with using on-demand ride services.',
  example: 'Owning a $28,000 car driven 8,000 miles costs roughly $6,900 annually ($575/month) when factoring depreciation, parking, gas, and insurance. If you only take 6 rideshare trips weekly at $22 each ($6,864/year), ridesharing is actually the cheaper path.',
  relatedSlugs: ['car-finance-calc', 'car-depreciation', 'budget-planner-calc'],
  relatedArticleSlugs: ['rideshare-vs-car-guide'],
  fields: [
    { key: 'carPrice', label: 'Car Purchase Price / Value', type: 'number', defaultValue: 28000, isCurrency: true },
    { key: 'annualMiles', label: 'Estimated Annual Miles Driven', type: 'number', defaultValue: 8000, min: 500, max: 50000 },
    { key: 'annualInsurance', label: 'Annual Car Insurance Premium', type: 'number', defaultValue: 1500, isCurrency: true },
    { key: 'parkingFees', label: 'Monthly Parking, Tolls, & Washing', type: 'number', defaultValue: 100, isCurrency: true },
    { key: 'rideshareCost', label: 'Average Rideshare Trip Fare', type: 'number', defaultValue: 22, isCurrency: true },
    { key: 'rideshareTrips', label: 'Weekly Rideshare Trips Needed', type: 'number', defaultValue: 6, min: 1, max: 50 }
  ],
  faqs: [
    { question: 'What is the biggest hidden cost of car ownership?', answer: 'Depreciation. Vehicles lose value continuously. For a typical vehicle, depreciation accounts for 30% to 50% of the total cost of ownership over the first five years, often overshadowing fuel and insurance combined.' },
    { question: 'At what mileage does car ownership become cheaper?', answer: 'For most mid-priced cars, if you drive more than 10,000 miles per year, car ownership is almost always cheaper than ride-sharing because the cost-per-mile of on-demand hailing is exceptionally high.' },
    { question: 'Is using ride-sharing practical for daily commutes?', answer: 'Usually only if you live in dense urban centers with short commutes, do not have dedicated free parking, or can substitute a significant number of trips with mass transit.' }
  ],
  calculate: (inputs, currency) => {
    const price = inputs.carPrice || 28000;
    const miles = inputs.annualMiles || 8000;
    const insurance = inputs.annualInsurance || 1500;
    const parking = inputs.parkingFees || 100;
    const rideshareTrip = inputs.rideshareCost || 22;
    const rideshareFreq = inputs.rideshareTrips || 6;

    // Car ownership costs
    const depreciation = price * 0.12; // 12% average annual depreciation
    const fuel = (miles / 25) * 3.50; // Assume 25 MPG average and $3.50/gallon
    const maintenance = price * 0.02; // 2% of car value annually for tires, oil, repairs
    const parkingAnnual = parking * 12;
    const totalCarCost = depreciation + fuel + maintenance + insurance + parkingAnnual;
    const carCostPerMile = miles > 0 ? totalCarCost / miles : 0;

    // Rideshare costs
    const totalRideshareCost = rideshareTrip * rideshareFreq * 52;

    const diff = totalCarCost - totalRideshareCost;
    const recommendation = diff > 0 ? 'RIDE-SHARING (UBER/LYFT)' : 'CAR OWNERSHIP';

    // Chart Data comparing components
    const chartData = [
      { name: 'Depreciation', Car: Math.round(depreciation), Rideshare: 0 },
      { name: 'Insurance', Car: Math.round(insurance), Rideshare: 0 },
      { name: 'Fuel & Maintenance', Car: Math.round(fuel + maintenance), Rideshare: 0 },
      { name: 'Parking & Tolls', Car: Math.round(parkingAnnual), Rideshare: 0 },
      { name: 'Rideshare Fare Outlays', Car: 0, Rideshare: Math.round(totalRideshareCost) }
    ];

    return {
      metrics: [
        { label: 'Most Economical Path', value: recommendation, isPrimary: true, desc: 'The transportation strategy with the lowest annual expenditure' },
        { label: 'Annual Car Ownership Cost', value: Math.round(totalCarCost), desc: 'Aggregated depreciation, fuel, maintenance, insurance, and parking' },
        { label: 'Annual Rideshare Cost', value: Math.round(totalRideshareCost), desc: 'Total cost of on-demand hail trips over 52 weeks' },
        { label: 'Net Annual Savings', value: Math.abs(Math.round(diff)), desc: 'Total money saved per year with the recommended choice' },
        { label: 'Car Cost Per Mile', value: `${currency}${carCostPerMile.toFixed(2)} / Mi`, desc: 'Your comprehensive per-mile car cost' }
      ],
      chartData,
      explanationText: `Your estimated annual car ownership cost totals ${currency}${Math.round(totalCarCost).toLocaleString()} (representing a staggering ${currency}${carCostPerMile.toFixed(2)}/mile driven, primarily dragged down by ${currency}${Math.round(depreciation).toLocaleString()}/yr in vehicle depreciation). Conversely, utilizing ride-sharing at ${rideshareFreq} trips per week costs ${currency}${Math.round(totalRideshareCost).toLocaleString()} annually. Opting for ${recommendation.toLowerCase()} will save you approximately ${currency}${Math.abs(Math.round(diff)).toLocaleString()} per year.`
    };
  }
};
