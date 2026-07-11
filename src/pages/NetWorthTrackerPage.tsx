import { useState, useEffect } from 'react';
import { ShieldCheck, Save, CheckCircle, Plus, Trash2, Coins, Briefcase } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SUPPORTED_CURRENCIES } from '../data/currenciesData';

interface TrackerItem {
  id: string;
  name: string;
  amount: number;
}

export default function NetWorthTrackerPage() {
  const { currency, setCurrency, formatCurrency } = useApp();

  const [assets, setAssets] = useState<TrackerItem[]>([
    { id: 'a1', name: "Cash & Emergency Fund", amount: 15000 },
    { id: 'a2', name: "Brokerage Investments", amount: 45000 },
    { id: 'a3', name: "Home Equity Value", amount: 120000 }
  ]);

  const [liabilities, setLiabilities] = useState<TrackerItem[]>([
    { id: 'l1', name: "Credit Card Balance", amount: 2000 },
    { id: 'l2', name: "Car Loan Balance", amount: 12000 },
    { id: 'l3', name: "Remaining Mortgage Principal", amount: 80000 }
  ]);

  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetAmount, setNewAssetAmount] = useState('');
  const [newLiabName, setNewLiabName] = useState('');
  const [newLiabAmount, setNewLiabAmount] = useState('');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load from local storage
  useEffect(() => {
    const savedAssets = localStorage.getItem('net_worth_assets');
    const savedLiabilities = localStorage.getItem('net_worth_liabilities');
    
    if (savedAssets) setAssets(JSON.parse(savedAssets));
    if (savedLiabilities) setLiabilities(JSON.parse(savedLiabilities));
  }, []);

  const handleSave = () => {
    localStorage.setItem('net_worth_assets', JSON.stringify(assets));
    localStorage.setItem('net_worth_liabilities', JSON.stringify(liabilities));

    setToastMessage("Net Worth balances saved securely to local memory!");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetName || !newAssetAmount) return;
    setAssets(prev => [...prev, {
      id: `a-${Date.now()}`,
      name: newAssetName,
      amount: parseFloat(newAssetAmount) || 0
    }]);
    setNewAssetName('');
    setNewAssetAmount('');
  };

  const handleAddLiability = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLiabName || !newLiabAmount) return;
    setLiabilities(prev => [...prev, {
      id: `l-${Date.now()}`,
      name: newLiabName,
      amount: parseFloat(newLiabAmount) || 0
    }]);
    setNewLiabName('');
    setNewLiabAmount('');
  };

  const handleDeleteAsset = (id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id));
  };

  const handleDeleteLiability = (id: string) => {
    setLiabilities(prev => prev.filter(l => l.id !== id));
  };

  const totalAssets = assets.reduce((acc, a) => acc + a.amount, 0);
  const totalLiabilities = liabilities.reduce((acc, l) => acc + l.amount, 0);
  const netWorth = totalAssets - totalLiabilities;
  
  // Ratio
  const solvensyRatio = totalAssets > 0 ? (netWorth / totalAssets) * 100 : 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 bg-white dark:bg-gray-950 transition-colors">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-bold animate-fade-in">
          <CheckCircle className="h-4.5 w-4.5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="text-center space-y-4 mb-12">
        <span className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          <span>Secured Balance Sheets</span>
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
          Net Worth <span className="text-emerald-600">Tracker</span>
        </h1>
        <p className="text-sm text-gray-500 max-w-xl mx-auto">
          Audit your absolute financial standing. Quantify your liquid assets against long-term liabilities to discover your real wealth solvency ratio.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Assets & Liabilities editor column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* ASSETS CONTAINER */}
          <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-850 bg-white dark:bg-gray-900 space-y-4">
            <h3 className="text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <Coins className="h-5 w-5 text-emerald-500" />
              <span>Asset Reserves (What You Own)</span>
            </h3>

            {/* List */}
            <div className="space-y-2">
              {assets.map((asset) => (
                <div key={asset.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800">
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{asset.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(asset.amount)}</span>
                    <button
                      onClick={() => handleDeleteAsset(asset.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Asset Form */}
            <form onSubmit={handleAddAsset} className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-3 border-t border-gray-100 dark:border-gray-850">
              <input
                type="text"
                value={newAssetName}
                onChange={(e) => setNewAssetName(e.target.value)}
                placeholder="Asset name (e.g., Roth IRA)"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-xs font-bold text-gray-900 dark:text-white focus:outline-none"
              />
              <input
                type="number"
                value={newAssetAmount}
                onChange={(e) => setNewAssetAmount(e.target.value)}
                placeholder={`Value (${SUPPORTED_CURRENCIES[currency]?.symbol || '$'})`}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-xs font-bold text-gray-900 dark:text-white focus:outline-none"
              />
              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Asset</span>
              </button>
            </form>
          </div>

          {/* LIABILITIES CONTAINER */}
          <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-850 bg-white dark:bg-gray-900 space-y-4">
            <h3 className="text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-red-500" />
              <span>Liabilities & Debts (What You Owe)</span>
            </h3>

            {/* List */}
            <div className="space-y-2">
              {liabilities.map((liab) => (
                <div key={liab.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800">
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{liab.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-red-600 dark:text-red-400">{formatCurrency(liab.amount)}</span>
                    <button
                      onClick={() => handleDeleteLiability(liab.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Liability Form */}
            <form onSubmit={handleAddLiability} className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-3 border-t border-gray-100 dark:border-gray-850">
              <input
                type="text"
                value={newLiabName}
                onChange={(e) => setNewLiabName(e.target.value)}
                placeholder="Liability name (e.g., Car Loan)"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-xs font-bold text-gray-900 dark:text-white focus:outline-none"
              />
              <input
                type="number"
                value={newLiabAmount}
                onChange={(e) => setNewLiabAmount(e.target.value)}
                placeholder={`Value (${SUPPORTED_CURRENCIES[currency]?.symbol || '$'})`}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-xs font-bold text-gray-900 dark:text-white focus:outline-none"
              />
              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-red-600 dark:bg-red-950/40 hover:bg-red-750 dark:hover:bg-red-900 text-white text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer border border-red-300 dark:border-red-900/10 shadow-sm"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Debt</span>
              </button>
            </form>
          </div>

        </div>

        {/* Dashboard visualizer card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-850 bg-white dark:bg-gray-900 space-y-6 sticky top-6">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-extrabold text-gray-900 dark:text-white">Audit Summary</h3>
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save Balances</span>
              </button>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-850">
              <div className="space-y-1">
                <span className="text-xs text-gray-500">Your Net Worth</span>
                <div className={`text-3xl font-black ${netWorth >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600"}`}>
                  {formatCurrency(netWorth)}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-gray-500">Total Asset Pool</span>
                  <span className="text-gray-900 dark:text-white">{formatCurrency(totalAssets)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-gray-500">Total Liability Pool</span>
                  <span className="text-red-600">{formatCurrency(totalLiabilities)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold border-t border-gray-100 dark:border-gray-850 pt-2">
                  <span className="text-gray-500">Solvensy Ratio</span>
                  <span className="text-gray-900 dark:text-white">{solvensyRatio.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
