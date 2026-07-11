import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, MessageSquare, ArrowRight, CheckCircle2, Heart, Sparkles, Info } from 'lucide-react';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const accessKey = (import.meta as any).env?.VITE_WEB3FORMS_ACCESS_KEY || '19ca33dc-ca75-45fc-b7c2-ce45ae39f7f9';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;

    setIsSubmitting(true);
    setSubmitError(null);

    if (accessKey) {
      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            access_key: accessKey,
            name: formState.name,
            email: formState.email,
            subject: `[Contact Form] ${formState.subject} - from ${formState.name}`,
            message: formState.message,
          }),
        });

        const data = await response.json();
        if (data.success) {
          setSubmitted(true);
          setFormState({
            name: '',
            email: '',
            subject: 'feedback',
            message: '',
          });
        } else {
          setSubmitError(data.message || 'Failed to submit form. Please try again.');
        }
      } catch (err) {
        setSubmitError('An error occurred while sending your message. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Direct send fallback using FormSubmit.co without needing an API key
      try {
        const response = await fetch('https://formsubmit.co/ajax/investnowithme@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            name: formState.name,
            email: formState.email,
            _subject: `[Contact Form] ${formState.subject} - from ${formState.name}`,
            message: formState.message,
            _captcha: 'false', // Disable reCAPTCHA for seamless background AJAX submission
          }),
        });

        const data = await response.json();
        if (data.success === 'true' || data.success === true) {
          setSubmitted(true);
          setFormState({
            name: '',
            email: '',
            subject: 'feedback',
            message: '',
          });
        } else {
          setSubmitError(data.message || 'Failed to submit form. Please try again.');
        }
      } catch (err) {
        setSubmitError('An error occurred while sending your message. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
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
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {accessKey ? 'Message Sent Successfully' : 'Opening Your Email App...'}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-normal max-w-sm mx-auto">
                  {accessKey 
                    ? 'Thank you for your feedback! Our planning team will review your message and respond to your email address within 24-48 business hours.'
                    : 'We have initiated an email to investnowithme@gmail.com. Please make sure to click "Send" in your local email app to complete your message delivery.'
                  }
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

                {!accessKey && (
                  <div className="p-3.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-xl flex gap-3 text-xs text-amber-800 dark:text-amber-300">
                    <Info className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
                    <div>
                      <span className="font-semibold block mb-0.5">Email Client Fallback Active</span>
                      This form currently opens your local email client (using a mailto link). To enable direct background submissions straight to your email, configure a free <a href="https://web3forms.com" target="_blank" rel="noopener noreferrer" className="underline font-bold hover:text-amber-900 dark:hover:text-amber-150">Web3Forms Access Key</a> in your environment variables.
                    </div>
                  </div>
                )}

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

                {submitError && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 text-xs rounded-xl">
                    {submitError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-xl py-3 text-sm shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <span>Send Message</span>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </main>
  );
}
