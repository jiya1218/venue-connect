'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { StepOne } from '@/components/forms/StepOne';
import { StepTwo } from '@/components/forms/StepTwo';
import { StepThree } from '@/components/forms/StepThree';
import {
  vendorStep1Schema,
  vendorStep2Schema,
  vendorStep3Schema,
  vendorFormSchema,
  type VendorFormData,
} from '@/lib/forms/schemas';

const STEPS = [
  { title: 'Basic Info', description: 'Name, service type & location' },
  { title: 'Details', description: 'Description & contact info' },
  { title: 'Portfolio', description: 'Upload your work samples' },
];

const STEP_SCHEMAS = [vendorStep1Schema, vendorStep2Schema, vendorStep3Schema];

export default function ListYourServicePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<VendorFormData>({
    resolver: zodResolver(vendorFormSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      category_id: '',
      city_id: '',
      area_id: '',
      price_range: undefined,
      experience_years: undefined,
      description: '',
      specialities: [],
      contact_name: '',
      contact_phone: '',
      contact_email: '',
      website: '',
      images: [],
    },
  });

  const nextStep = async () => {
    const schema = STEP_SCHEMAS[currentStep];
    const values = form.getValues();
    const result = await schema.safeParseAsync(values);

    if (!result.success) {
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof VendorFormData;
        form.setError(field, { message: err.message });
      });
      return;
    }
    setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    setCurrentStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = async (data: VendorFormData) => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/submit-vendor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? 'Submission failed');
      }
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) return <SuccessScreen />;

  const progress = (currentStep / (STEPS.length - 1)) * 100;

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-orange-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            List Your Service
          </h1>
          <p className="text-gray-500 text-sm">
            Photographers, caterers, decorators and more — grow your business with VenueConnect
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {STEPS.map((step, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-2 text-xs font-medium transition-colors
                  ${idx <= currentStep ? 'text-rose-600' : 'text-gray-400'}`}
              >
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all
                    ${idx < currentStep
                      ? 'bg-rose-500 border-rose-500 text-white'
                      : idx === currentStep
                        ? 'border-rose-500 text-rose-600'
                        : 'border-gray-200 text-gray-400'
                    }`}
                >
                  {idx < currentStep ? '✓' : idx + 1}
                </span>
                <span className="hidden sm:block">{step.title}</span>
              </div>
            ))}
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-rose-500 to-orange-400 rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1.5 text-right">
            Step {currentStep + 1} of {STEPS.length} — {STEPS[currentStep].description}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                {currentStep === 0 && <StepOne form={form} type="vendor" />}
                {currentStep === 1 && <StepTwo form={form} type="vendor" />}
                {currentStep === 2 && <StepThree form={form} type="vendor" />}
              </motion.div>
            </AnimatePresence>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} /> Back
              </button>

              {currentStep < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-rose-500 text-white text-sm font-semibold hover:bg-rose-600 transition-colors"
                >
                  Continue <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {submitting ? (
                    <><Loader2 size={16} className="animate-spin" /> Submitting...</>
                  ) : (
                    <><CheckCircle2 size={16} /> Submit Service</>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

function SuccessScreen() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-orange-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-lg border border-gray-100 p-10 text-center"
      >
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} className="text-emerald-500" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
          🎉 Service Listed!
        </h2>
        <p className="text-gray-500 mb-6 text-sm leading-relaxed">
          Your service has been submitted for review. Our team will verify the details
          and make it live within <strong>24–48 hours</strong>. You&apos;ll receive a
          confirmation on your registered email.
        </p>
        <a
          href="/"
          className="inline-block bg-rose-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-rose-600 transition-colors text-sm"
        >
          Back to Home
        </a>
      </motion.div>
    </main>
  );
}
