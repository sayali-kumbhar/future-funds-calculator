import { useState } from 'react';
import { HelpCircle, CheckCircle, XCircle, Award, RefreshCw, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface Quiz {
  title: string;
  desc: string;
  questions: QuizQuestion[];
  recommendation: { score: number; text: string; calcSlug: string }[];
}

const QUIZZES: Quiz[] = [
  {
    title: "FIRE Movement & Safe Withdrawals",
    desc: "Test your understanding of safe withdrawal rates, early retirement rules, and the Trinity Study.",
    questions: [
      {
        question: "According to the famous Trinity Study, what is the default Safe Withdrawal Rate (SWR) for a 30-year retirement?",
        options: ["3%", "4%", "5%", "6%"],
        correct: 1,
        explanation: "The Trinity Study found that a 4% initial withdrawal rate, adjusted annually for inflation, has a 95%+ success rate over a 30-year horizon."
      },
      {
        question: "What defining concept describes 'Coast FIRE'?",
        options: [
          "Retiring near a coastal area with lower property taxes.",
          "Saving enough in early stages so that your current corpus compounds to your retirement target without any further contributions.",
          "Working part-time as a barista solely to cover healthcare premiums.",
          "Withdrawing only 2% annually from a very large investment corpus."
        ],
        correct: 1,
        explanation: "Coast FIRE is when you frontload retirement accounts early, enabling compound interest to carry you to your target without adding another dollar of savings."
      },
      {
        question: "If your annual household expense is $60,000, what is your standard FIRE nest egg corpus target under the 4% rule?",
        options: ["$1,000,000", "$1,200,000", "$1,500,000", "$2,000,000"],
        correct: 2,
        explanation: "Under the 4% rule, your target corpus is your annual expenses multiplied by 25 (or divided by 0.04). $60,000 * 25 = $1,500,000."
      }
    ],
    recommendation: [
      { score: 3, text: "You've fully mastered SWR math! Model your custom Coast or Lean targets using our simulators.", calcSlug: "fire" },
      { score: 1, text: "We recommend adjusting your active expenses and simulating retirement multipliers.", calcSlug: "coast-fire" }
    ]
  },
  {
    title: "Investment Math & Compounding",
    desc: "Test your knowledge on compound interest formulas, CAGR, index funds, and expense ratio fees.",
    questions: [
      {
        question: "Using the Rule of 72, roughly how many years does it take to double an investment yielding an 8% annual return?",
        options: ["6 years", "9 years", "12 years", "15 years"],
        correct: 1,
        explanation: "The Rule of 72 calculates doubling time by dividing 72 by the annual return rate. 72 / 8 = 9 years."
      },
      {
        question: "Why do low-cost Index Funds generally outperform active mutual funds over long periods?",
        options: [
          "They only buy high-yield tech stocks.",
          "They avoid trading fees and maintain ultra-low expense ratios.",
          "They guarantee positive returns even during recessions.",
          "They are backed directly by federal cash reserves."
        ],
        correct: 1,
        explanation: "Because active funds charge high fees and struggle to time the market, low-cost index funds capture market growth while bypassing fee drag."
      },
      {
        question: "What is the primary difference between a stock's CAGR and average annual return?",
        options: [
          "CAGR measures nominal returns; average return accounts for taxes.",
          "CAGR measures the real compound geometric growth rate; average return is a simple arithmetic mean that ignores volatility drag.",
          "Average returns are always higher than CAGR for negative years.",
          "There is no difference; both metrics calculate identical returns."
        ],
        correct: 1,
        explanation: "Arithmetic average return ignores the compounding sequence. CAGR provides the true geometric rate of return over multiple cycles."
      }
    ],
    recommendation: [
      { score: 3, text: "Perfect score! Put compounding formulas to work using our compound simulator.", calcSlug: "compound-interest" },
      { score: 1, text: "Review how fee drag or inflation affects your long-term compounding speeds.", calcSlug: "expense-ratio-calc" }
    ]
  },
  {
    title: "Tax Optimization & Account Rules",
    desc: "Evaluate your understanding of tax-advantaged accounts, Roth conversions, and tax brackets.",
    questions: [
      {
        question: "What are the three tax advantages of a Health Savings Account (HSA)?",
        options: [
          "Pre-tax contributions, tax-free growth, and tax-free withdrawals for qualified medical expenses.",
          "No contribution limits, employer matches, and zero state income tax liabilities.",
          "No lock-in periods, mortgage rate deductions, and compound interest bonuses.",
          "Tax deductions on stock losses, dividend waivers, and tax-free inheritance."
        ],
        correct: 0,
        explanation: "HSAs are unique in offering triple tax benefits: contributions reduce income tax, capital gains grow completely tax-free, and medical withdrawals are tax-free."
      },
      {
        question: "What is a 'Backdoor Roth IRA'?",
        options: [
          "A sneaky way to withdraw retirement money early without standard penalties.",
          "A tax-planning technique high-earners use to contribute to a Roth IRA by converting traditional pre-tax contributions.",
          "An offshore tax shelter designed to protect global stock dividends.",
          "A salary sacrifice mechanism arranged directly through standard employer payroll."
        ],
        correct: 1,
        explanation: "When high earners exceed Roth income limits, they can make non-deductible traditional contributions and immediately convert them into a Roth IRA."
      }
    ],
    recommendation: [
      { score: 2, text: "Incredible tax awareness! Calculate your exact marginal brackets and tax savings.", calcSlug: "tax-bracket-calc" },
      { score: 0, text: "Explore how HSA contributions or retirement matches reduce taxable income.", calcSlug: "hsa-tax-savings" }
    ]
  }
];

export default function QuizzesPage() {
  const [activeQuizIdx, setActiveQuizIdx] = useState<number | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const activeQuiz = activeQuizIdx !== null ? QUIZZES[activeQuizIdx] : null;

  const handleStartQuiz = (idx: number) => {
    setActiveQuizIdx(idx);
    setCurrentQuestionIdx(0);
    setSelectedOptionIdx(null);
    setIsAnswered(false);
    setCorrectCount(0);
    setQuizFinished(false);
  };

  const handleSelectOption = (optIdx: number) => {
    if (isAnswered) return;
    setSelectedOptionIdx(optIdx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOptionIdx === null || isAnswered) return;
    setIsAnswered(true);
    if (selectedOptionIdx === activeQuiz!.questions[currentQuestionIdx].correct) {
      setCorrectCount(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    const nextIdx = currentQuestionIdx + 1;
    if (nextIdx < activeQuiz!.questions.length) {
      setCurrentQuestionIdx(nextIdx);
      setSelectedOptionIdx(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleResetQuiz = () => {
    setActiveQuizIdx(null);
  };

  const activeRecommendation = quizFinished && activeQuiz
    ? activeQuiz.recommendation.find(r => correctCount >= r.score) || activeQuiz.recommendation[activeQuiz.recommendation.length - 1]
    : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 bg-white dark:bg-gray-950 transition-colors">
      
      {/* Back button */}
      {activeQuizIdx !== null && (
        <button
          onClick={handleResetQuiz}
          className="text-xs font-bold text-gray-500 hover:text-emerald-600 mb-6 flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Exit Quiz & View All Topics</span>
        </button>
      )}

      {activeQuizIdx === null ? (
        <div className="space-y-8 animate-fade-in">
          {/* Header */}
          <div className="text-center space-y-4">
            <span className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
              <HelpCircle className="h-3.5 w-3.5 text-emerald-500" />
              <span>Interactive Quizzes</span>
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
              Test Your <span className="text-emerald-600">Finance IQ</span>
            </h1>
            <p className="text-sm text-gray-500 max-w-lg mx-auto">
              Challenge yourself with our interactive questionnaires. Build confidence, clear tax and investing misconceptions, and get matched to custom calculator tools.
            </p>
          </div>

          {/* Grid of Quizzes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {QUIZZES.map((quiz, idx) => (
              <div key={idx} className="p-6 rounded-2xl border border-gray-200 dark:border-gray-850 bg-white dark:bg-gray-900 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
                <div className="space-y-3">
                  <h3 className="text-base font-extrabold text-gray-900 dark:text-white">{quiz.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{quiz.desc}</p>
                  <span className="text-[10px] inline-block font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-md">
                    {quiz.questions.length} Questions
                  </span>
                </div>
                <button
                  onClick={() => handleStartQuiz(idx)}
                  className="w-full mt-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all cursor-pointer shadow-sm"
                >
                  Start Quiz
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-2xl border border-gray-250 dark:border-gray-850 bg-white dark:bg-gray-900 space-y-6 shadow-md animate-fade-in">
          {!quizFinished ? (
            <div className="space-y-6">
              {/* Question progress */}
              <div className="flex justify-between items-center text-xs text-gray-400 border-b border-gray-100 dark:border-gray-850 pb-4">
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {activeQuiz.title}
                </span>
                <span>
                  Question {currentQuestionIdx + 1} of {activeQuiz.questions.length}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIdx) / activeQuiz.questions.length) * 100}%` }}
                ></div>
              </div>

              {/* Question Text */}
              <h2 className="text-lg font-extrabold text-gray-900 dark:text-white">
                {activeQuiz.questions[currentQuestionIdx].question}
              </h2>

              {/* Options */}
              <div className="grid grid-cols-1 gap-3">
                {activeQuiz.questions[currentQuestionIdx].options.map((opt, i) => {
                  const isSelected = selectedOptionIdx === i;
                  const isCorrect = i === activeQuiz.questions[currentQuestionIdx].correct;
                  let optStyle = "border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-850";
                  
                  if (isAnswered) {
                    if (isCorrect) optStyle = "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold";
                    else if (isSelected) optStyle = "bg-red-50 dark:bg-red-950/20 border-red-500 text-red-600 dark:text-red-400";
                  } else if (isSelected) {
                    optStyle = "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/10 text-emerald-600 dark:text-emerald-400";
                  }

                  return (
                    <button
                      key={i}
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(i)}
                      className={`w-full p-4 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${optStyle}`}
                    >
                      <span>{opt}</span>
                      {isAnswered && isCorrect && <CheckCircle className="h-4.5 w-4.5 text-emerald-500 shrink-0" />}
                      {isAnswered && isSelected && !isCorrect && <XCircle className="h-4.5 w-4.5 text-red-500 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Action Button */}
              <div className="pt-4 flex justify-end">
                {!isAnswered ? (
                  <button
                    disabled={selectedOptionIdx === null}
                    onClick={handleSubmitAnswer}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 transition-all cursor-pointer"
                  >
                    Check Answer
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{currentQuestionIdx + 1 === activeQuiz.questions.length ? "Finish Quiz" : "Next Question"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Explanation block */}
              {isAnswered && (
                <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/30 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Financial Explanation</span>
                  </span>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    {activeQuiz.questions[currentQuestionIdx].explanation}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 space-y-6">
              <Award className="h-16 w-16 text-emerald-500 mx-auto animate-bounce" />
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white">Quiz Completed!</h2>
                <p className="text-sm text-gray-400">
                  You scored <strong className="text-emerald-500">{correctCount}</strong> out of <strong className="text-gray-900 dark:text-white">{activeQuiz.questions.length}</strong> questions correct.
                </p>
              </div>

              {activeRecommendation && (
                <div className="max-w-md mx-auto p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/30 dark:bg-emerald-950/10 space-y-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Personalized Match Recommendation</span>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                    {activeRecommendation.text}
                  </p>
                  <Link
                    to={`/calculators/${activeRecommendation.calcSlug}`}
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    <span>Launch matched calculator tool</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}

              <div className="flex gap-4 justify-center pt-4">
                <button
                  onClick={() => handleStartQuiz(activeQuizIdx)}
                  className="px-5 py-2.5 rounded-xl border border-gray-250 dark:border-gray-800 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer"
                >
                  Try Again
                </button>
                <button
                  onClick={handleResetQuiz}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white transition-all cursor-pointer"
                >
                  View All Quizzes
                </button>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
