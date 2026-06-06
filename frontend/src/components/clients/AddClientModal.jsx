import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, CheckCheck } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { addClient } from '../../services/api.js';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

const stepLabels = ['Personal', 'Cultural', 'Lifestyle', 'Professional'];

const inputClass = "w-full rounded-xl px-4 py-2.5 text-sm font-sans outline-none transition-all";
const inputStyle = { border: '1px solid #E8E1D6', background: '#FAF8F4', color: '#2C2420' };
const labelClass = "font-sans text-[10px] font-semibold uppercase mb-1.5 block";
const labelStyle = { letterSpacing: '0.12em', color: '#9A9088' };

function FormField({ label, required, children, full }) {
  return (
    <div className={full ? 'col-span-2' : 'col-span-1'}>
      <label className={labelClass} style={labelStyle}>
        {label}{required && <span className="ml-0.5" style={{ color: '#DC2626' }}>*</span>}
      </label>
      {children}
    </div>
  );
}

export default function AddClientModal({ onClose }) {
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    firstName: '', lastName: '', age: '', dateOfBirth: '', gender: '', maritalStatus: '',
    wantKids: '', about: '',
    religion: '', varna: '', jati: '', motherTongue: '', languageFamily: '', gotra: '',
    horoscopeMatchingRequired: false, isManglik: false,
    diet: '', drinking: '', smoking: '', familyValues: '', livingArrangement: '',
    timelineToMarry: '', openToPets: false,
    heightCm: '', educationTier: '', income: '', workPostMarriageIntent: '',
    city: '', metroRegion: '', state: '', zone: '', country: 'India', openToRelocation: false,
    contactEmail: '', contactPhone: '',
  });

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const goNext = () => { setDirection(1); setStep((s) => Math.min(3, s + 1)); };
  const goBack = () => { setDirection(-1); setStep((s) => Math.max(0, s - 1)); };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        firstName: form.firstName, lastName: form.lastName,
        age: Number(form.age), dateOfBirth: form.dateOfBirth,
        gender: form.gender, maritalStatus: form.maritalStatus,
        wantKids: form.wantKids, about: form.about,
        contact: { email: form.contactEmail, phone: form.contactPhone },
        religion: form.religion, varna: form.varna, jati: form.jati,
        motherTongue: form.motherTongue, languageFamily: form.languageFamily,
        gotra: form.gotra, horoscopeMatchingRequired: form.horoscopeMatchingRequired,
        isManglik: form.isManglik,
        diet: form.diet, drinking: form.drinking, smoking: form.smoking,
        familyValues: form.familyValues, livingArrangement: form.livingArrangement,
        timelineToMarry: form.timelineToMarry, openToPets: form.openToPets,
        heightCm: form.heightCm, educationTier: form.educationTier,
        income: form.income, workPostMarriageIntent: form.workPostMarriageIntent,
        city: form.city, metroRegion: form.metroRegion, state: form.state,
        zone: form.zone, country: form.country, openToRelocation: form.openToRelocation,
      };
      await addClient(payload);
      toast.success('Client added successfully ✓');
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      onClose();
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error('A client with this email already exists.');
      } else {
        toast.error(err.response?.data?.message || 'Failed to add client.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const variants = {
    enter: { x: direction > 0 ? 24 : -24, opacity: 0 },
    center: { x: 0, opacity: 1, transition: { duration: 0.22 } },
    exit: { x: direction > 0 ? -24 : 24, opacity: 0, transition: { duration: 0.15 } },
  };

  const focusStyle = (e) => { e.target.style.boxShadow = '0 0 0 2px #C8973F'; e.target.style.borderColor = 'transparent'; };
  const blurStyle = (e) => { e.target.style.boxShadow = 'none'; e.target.style.borderColor = '#E8E1D6'; };

  const renderInput = (key, placeholder, type = 'text') => (
    <input type={type} value={form[key]} onChange={(e) => update(key, e.target.value)}
      placeholder={placeholder} className={inputClass} style={inputStyle}
      onFocus={focusStyle} onBlur={blurStyle} />
  );

  const renderSelect = (key, placeholder, options) => (
    <Select value={form[key]} onValueChange={(v) => update(key, v)}>
      <SelectTrigger className="w-full rounded-xl text-sm font-sans h-10" style={inputStyle}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
      </SelectContent>
    </Select>
  );

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-3xl w-full max-w-2xl flex flex-col overflow-hidden"
        style={{ maxHeight: '92vh', boxShadow: '0 16px 48px rgba(44,36,32,0.13)' }}
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 pt-7 pb-0 flex-shrink-0 relative">
          <h2 className="font-serif text-2xl font-semibold" style={{ color: '#2C2420' }}>Add New Client</h2>
          <p className="font-sans text-sm mt-1" style={{ color: '#9A9088' }}>Fill in the client details across all steps</p>
          <button onClick={onClose} className="absolute top-6 right-6 w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ color: '#9A9088' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#F5F0E8'; e.currentTarget.style.color = '#2C2420'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9A9088'; }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Step indicator */}
        <div className="px-8 pt-5 pb-4 flex-shrink-0">
          <div className="flex items-center">
            {stepLabels.map((label, i) => (
              <div key={label} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-sans font-semibold"
                    style={
                      i < step ? { background: '#C8973F', color: '#FFFFFF' }
                      : i === step ? { background: '#1B3A2C', color: '#FFFFFF' }
                      : { background: '#F0E8DC', color: '#9A9088' }
                    }
                  >
                    {i < step ? <CheckCheck size={12} /> : i + 1}
                  </div>
                  <span className="font-sans text-[10px] font-medium mt-1.5 text-center"
                    style={{ color: i === step ? '#1B3A2C' : '#9A9088' }}>
                    {label}
                  </span>
                </div>
                {i < 3 && <div className="flex-1 h-px mx-2 mt-[-14px]" style={{ background: '#E8E1D6' }} />}
              </div>
            ))}
          </div>
        </div>

        {/* Form area */}
        <div className="flex-1 overflow-y-auto px-8 py-4">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div key={step} variants={variants} initial="enter" animate="center" exit="exit" custom={direction}>
              {step === 0 && (
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="First Name" required>{renderInput('firstName', 'First name')}</FormField>
                  <FormField label="Last Name" required>{renderInput('lastName', 'Last name')}</FormField>
                  <FormField label="Age" required>{renderInput('age', '25', 'number')}</FormField>
                  <FormField label="Date of Birth" required>{renderInput('dateOfBirth', 'e.g. 12 Jan 1997')}</FormField>
                  <FormField label="Gender" required>{renderSelect('gender', 'Select', ['Male', 'Female', 'Other'])}</FormField>
                  <FormField label="Marital Status" required>{renderSelect('maritalStatus', 'Select', ['Never Married', 'Divorced', 'Widowed', 'Separated'])}</FormField>
                  <FormField label="Want Kids">{renderSelect('wantKids', 'Select', ['Yes', 'No', 'Maybe'])}</FormField>
                  <div />
                  <FormField label="About" full>
                    <textarea value={form.about} onChange={(e) => update('about', e.target.value)}
                      placeholder="A brief description of the client..."
                      className={inputClass + ' min-h-[80px] resize-none'} style={inputStyle}
                      onFocus={focusStyle} onBlur={blurStyle} />
                  </FormField>
                </div>
              )}

              {step === 1 && (
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Religion">{renderSelect('religion', 'Select', ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain', 'Buddhist', 'Parsi', 'Other'])}</FormField>
                  <FormField label="Varna / Caste Category">{renderInput('varna', 'e.g. Brahmin')}</FormField>
                  <FormField label="Jati / Sub-community">{renderInput('jati', 'e.g. Saraswat')}</FormField>
                  <FormField label="Mother Tongue">{renderInput('motherTongue', 'e.g. Hindi')}</FormField>
                  <FormField label="Language Family">{renderInput('languageFamily', 'e.g. Indo-Aryan')}</FormField>
                  <FormField label="Gotra">{renderInput('gotra', 'e.g. Bharadwaj')}</FormField>
                  <div className="col-span-2 flex gap-8 py-2">
                    <label className="flex items-center gap-3 font-sans text-sm" style={{ color: '#5C5248' }}>
                      <Switch checked={form.horoscopeMatchingRequired} onCheckedChange={(v) => update('horoscopeMatchingRequired', v)} />
                      Horoscope Matching Required
                    </label>
                    <label className="flex items-center gap-3 font-sans text-sm" style={{ color: '#5C5248' }}>
                      <Switch checked={form.isManglik} onCheckedChange={(v) => update('isManglik', v)} />
                      Manglik
                    </label>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Dietary Preference">{renderSelect('diet', 'Select', ['Pure Veg', 'Vegetarian', 'Eggetarian', 'Non-Veg', 'Jain', 'Vegan'])}</FormField>
                  <FormField label="Drinking">{renderSelect('drinking', 'Select', ['Abstain', 'Occasionally', 'Socially', 'Regularly'])}</FormField>
                  <FormField label="Smoking">{renderSelect('smoking', 'Select', ['Non-smoker', 'Occasionally', 'Regularly'])}</FormField>
                  <FormField label="Family Values">{renderSelect('familyValues', 'Select', ['Traditional', 'Moderate', 'Progressive'])}</FormField>
                  <FormField label="Preferred Living">{renderSelect('livingArrangement', 'Select', ['Nuclear', 'Joint', 'Flexible'])}</FormField>
                  <FormField label="Timeline to Marry">{renderSelect('timelineToMarry', 'Select', ['Less than 6 months', '6-12 months', '1-2 years', 'Not in a rush'])}</FormField>
                  <div className="col-span-2 flex gap-8 py-2">
                    <label className="flex items-center gap-3 font-sans text-sm" style={{ color: '#5C5248' }}>
                      <Switch checked={form.openToPets} onCheckedChange={(v) => update('openToPets', v)} />
                      Open to Pets
                    </label>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Height">{renderInput('heightCm', "e.g. 5'10\" / 178 cm")}</FormField>
                  <FormField label="Education Level">{renderSelect('educationTier', 'Select', ['High School', 'Graduate', 'Post Graduate', 'Doctorate'])}</FormField>
                  <FormField label="Annual Income">{renderInput('income', 'e.g. ₹20 LPA')}</FormField>
                  <FormField label="Work Intent After Marriage">{renderSelect('workPostMarriageIntent', 'Select', ['Supports partner working', 'Expects partner to not work', 'Would like to take a break', 'Will continue working'])}</FormField>
                  <FormField label="City">{renderInput('city', 'City')}</FormField>
                  <FormField label="Metro Region">{renderInput('metroRegion', 'e.g. Mumbai')}</FormField>
                  <FormField label="State">{renderInput('state', 'State')}</FormField>
                  <FormField label="Zone">{renderSelect('zone', 'Select', ['North', 'South', 'East', 'West', 'Central', 'Northeast'])}</FormField>
                  <FormField label="Country">{renderInput('country', 'India')}</FormField>
                  <div />
                  <div className="col-span-2 flex gap-8 py-2">
                    <label className="flex items-center gap-3 font-sans text-sm" style={{ color: '#5C5248' }}>
                      <Switch checked={form.openToRelocation} onCheckedChange={(v) => update('openToRelocation', v)} />
                      Open to Relocation
                    </label>
                  </div>

                  {/* Contact section */}
                  <div className="col-span-2 pt-2" style={{ borderTop: '1px solid #F0E8DC' }}>
                    <p className="font-sans text-[9px] font-bold uppercase" style={{ letterSpacing: '0.15em', color: '#9A9088' }}>
                      CONTACT INFORMATION
                    </p>
                  </div>
                  <FormField label="Email Address">{renderInput('contactEmail', 'client@example.com', 'email')}</FormField>
                  <FormField label="Phone Number">{renderInput('contactPhone', '+91 9876543210', 'tel')}</FormField>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 flex items-center justify-between flex-shrink-0" style={{ borderTop: '1px solid #E8E1D6' }}>
          <div>
            {step > 0 && (
              <button onClick={goBack}
                className="rounded-xl px-5 py-2.5 text-sm font-medium"
                style={{ background: '#F5F0E8', color: '#5C5248' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#EDE5DC'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#F5F0E8'}
              >
                Back
              </button>
            )}
          </div>
          <div>
            {step < 3 ? (
              <button onClick={goNext}
                className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
                style={{ background: '#1B3A2C' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#22503D'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#1B3A2C'}
              >
                Next
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={isSubmitting}
                className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white flex items-center gap-2 disabled:opacity-60"
                style={{ background: '#1B3A2C' }}
                onMouseEnter={(e) => { if (!isSubmitting) e.currentTarget.style.background = '#22503D'; }}
                onMouseLeave={(e) => e.currentTarget.style.background = '#1B3A2C'}
              >
                {isSubmitting ? <><Loader2 className="animate-spin" size={14} /> Adding...</> : 'Add Client'}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
