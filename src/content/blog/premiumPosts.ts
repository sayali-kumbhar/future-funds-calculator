import { post as howMuchMoneyToRetire } from './posts/how-much-money-to-retire';
import { post as fireMovementExplained } from './posts/fire-movement-explained';
import { post as bestSipStrategyWealth } from './posts/best-sip-strategy-wealth';
import { post as financialFreedomBeginnersGuide } from './posts/financial-freedom-beginners-guide';
import { post as commonRetirementMistakesToAvoid } from './posts/common-retirement-mistakes-to-avoid';
import { post as howCompoundInterestBuildsWealth } from './posts/how-compound-interest-builds-wealth';
import { post as howToIncreaseSavingsRateFast } from './posts/how-to-increase-savings-rate-fast';
import { post as bestInvestmentOptionsInIndia } from './posts/best-investment-options-in-india';
import { post as burnedOutCoastFireStrategy } from './posts/burned-out-coast-fire-strategy';
import { post as latteFactorVersusBigWins } from './posts/latte-factor-versus-big-wins';
import { post as moneyAnxietyExpensiveWorld } from './posts/money-anxiety-expensive-world';
import { post as moneyFightsRelationshipsCompromise } from './posts/money-fights-relationships-compromise';
import { additionalPremiumPosts } from './posts/additionalPremiumPosts';
import { newCalculatorsBlogs } from './posts/newCalculatorsBlogs';
import { indianFinanceGuidePosts } from './posts/indianFinanceGuidePosts';

export const PRECOMPUTED_CONTENT_MAP: Record<string, {
  sections: { heading: string; content: string }[];
  title?: string;
  metaTitle?: string;
  readTime?: string;
  date?: string;
  summary?: string;
  category?: string;
  tags?: string[];
  primaryKeyword?: string;
  secondaryKeywords?: string[];
  metaDescription?: string;
  faqs?: { question: string; answer: string }[];
}> = {
  'how-much-money-to-retire': howMuchMoneyToRetire,
  'fire-movement-explained': fireMovementExplained,
  'best-sip-strategy-wealth': bestSipStrategyWealth,
  'financial-freedom-beginners-guide': financialFreedomBeginnersGuide,
  'common-retirement-mistakes-to-avoid': commonRetirementMistakesToAvoid,
  'how-compound-interest-builds-wealth': howCompoundInterestBuildsWealth,
  'how-to-increase-savings-rate-fast': howToIncreaseSavingsRateFast,
  'best-investment-options-in-india': bestInvestmentOptionsInIndia,
  'burned-out-coast-fire-strategy': burnedOutCoastFireStrategy,
  'latte-factor-versus-big-wins': latteFactorVersusBigWins,
  'money-anxiety-expensive-world': moneyAnxietyExpensiveWorld,
  'money-fights-relationships-compromise': moneyFightsRelationshipsCompromise,
  ...additionalPremiumPosts,
  ...newCalculatorsBlogs,
  ...indianFinanceGuidePosts
};
