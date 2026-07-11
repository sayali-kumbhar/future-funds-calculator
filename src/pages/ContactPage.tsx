import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, MessageSquare, ArrowRight, CheckCircle2, Heart, Sparkles } from 'lucide-react';
import { Page } from '../types';

interface ContactPageProps {
  setCurrentPage?: (page: Page) => void;
}

export default function ContactPage({}: ContactPageProps) {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: 'feedback',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (formState.name && formState.email && formState.message) {
      const subjectLine = encodeURIComponent(`[Contact Form] ${formState.subject} - from ${formState.name}`);
      const bodyText = encodeURIComponent(
        `Name: ${formState.name}\nEmail: ${formState.email}\nSubject: ${formState.subject}\n\nMessage:\n${formState.message}`
      );
      
      window.location.href = `mailto:investnowithme@gmail.com?subject=${subjectLine}&body=${bodyText}`;

      setSubmitted(true);
      // Clean form fields
      setFormState({
        name: '',
        email: '',
        subject: 'feedback',
        message: '',
      });
    }
  };

  const handleFAQNav = () => {
    navigate('/faq');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main id="contact-page" className="py-16 bg-white dark:bg-gray-950 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title layout */}
        <section className="text-center max-w-2xl mx-auto space-y-4 mb-12">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
            CONNECT WITH PLAN TEAM
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
            We value your perspective
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
            Have questions about our safe withdrawal mathematics, feature requests, or general financial planning feedback? Reach out directly.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto items-start">
          
          {/* Left Block: Narrative, Email & Fast FAQ links */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                Get immediate help or say hello.
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Before sending a manual message, consider searching our FAQ list. Over 90% of technical questions about compounding metrics, interest compounding, and inflation targets are covered in detail.
              </p>
            </div>

            <button
              onClick={handleFAQNav}
              className="inline-flex items-center space-x-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 border border-emerald-100 dark:border-emerald-900/30 px-5 py-3 text-sm font-bold text-emerald-700 dark:text-emerald-400 transition-colors w-full justify-between"
            >
              <span>Explore 20+ Financial FAQs</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            {/* Support metrics */}
          </div>

          {/* Right Block: Message Contact Form */}
          <div className="bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-850 rounded-3xl p-6 sm:p-8">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="h-12 w-12 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Message Sent Successfully</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-normal max-w-sm mx-auto">
                  Thank you for your feedback! Our planning and editorial teams review all messages and will respond to your email address within 24-48 business hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-base font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2">
                  Send a Direct Message
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="w-full bg-white dark:bg-gray-950 border border-gray-250 dark:border-gray-800 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full bg-white dark:bg-gray-950 border border-gray-250 dark:border-gray-800 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Subject Topic
                  </label>
                  <select
                    value={formState.subject}
                    onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                    className="w-full bg-white dark:bg-gray-950 border border-gray-250 dark:border-gray-800 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="feedback">Product Feedback & Calculator Suggestions</option>
                    <option value="press">Press & Media Inquiries</option>
                    <option value="partner">Strategic Partnerships</option>
                    <option value="bug">Report a Calculation Error or Bug</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Your Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className="w-full bg-white dark:bg-gray-950 border border-gray-250 dark:border-gray-800 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Provide detailed comments..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl py-3 text-sm shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </main>
  );
}
