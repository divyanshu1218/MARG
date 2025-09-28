
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FormInput: React.FC<{ label: string; name: string; type?: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; error?: string; placeholder?: string; }> = 
({ label, name, type = "text", value, onChange, error, placeholder }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-bold text-marg-text-secondary mb-2">{label}</label>
        <input id={name} name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} className={`w-full p-3 border rounded-lg focus:ring-2 focus:outline-none ${error ? 'border-red-500 ring-red-300' : 'border-gray-300 focus:ring-marg-accent'}`} />
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
);

const FormSelect: React.FC<{ label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; error?: string; children: React.ReactNode }> = 
({ label, name, value, onChange, error, children }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-bold text-marg-text-secondary mb-2">{label}</label>
        <select id={name} name={name} value={value} onChange={onChange} className={`w-full p-3 border rounded-lg focus:ring-2 focus:outline-none bg-white ${error ? 'border-red-500 ring-red-300' : 'border-gray-300 focus:ring-marg-accent'}`}>
            {children}
        </select>
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
);

const ProgressBar: React.FC<{ currentStep: number; totalSteps: number; }> = ({ currentStep, totalSteps }) => {
    const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
    return (
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
            <div className="bg-gradient-to-r from-marg-secondary to-marg-accent h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
        </div>
    );
};

const BecomeMentorPage: React.FC = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        fullName: '', university: '', cgpa: '', year: '', communication: '', motivation: '', email: ''
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateStep1 = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.fullName) newErrors.fullName = "Full name is required.";
        if (!formData.email) newErrors.email = "Email is required.";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid.";
        if (!formData.university) newErrors.university = "University name is required.";
        if (!formData.year) newErrors.year = "Please select your year of study.";
        if (!formData.cgpa) newErrors.cgpa = "CGPA is required.";
        else if (isNaN(Number(formData.cgpa)) || Number(formData.cgpa) > 10 || Number(formData.cgpa) < 0) newErrors.cgpa = "Please enter a valid CGPA (0-10).";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.communication) newErrors.communication = "Please rate your communication skills.";
        if (!formData.motivation.trim() || formData.motivation.trim().length < 50) newErrors.motivation = "Please provide a motivation statement of at least 50 characters.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleNext = () => {
        if (validateStep1()) setStep(2);
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateStep2()) {
            console.log("Form Submitted:", formData);
            setStep(3); // Move to submission success step
        }
    };

    return (
        <div className="bg-marg-bg min-h-screen py-16 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-marg-primary mb-4">Become a MARG Mentor</h1>
                    <p className="text-lg text-marg-text-secondary max-w-3xl mx-auto">
                        Share your experience, guide the next generation, and build a stronger community.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
                    {/* Eligibility Section */}
                    <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-gray-200 sticky top-24">
                        <h3 className="font-bold text-lg text-marg-primary mb-4">Eligibility Criteria</h3>
                        <ul className="space-y-3 text-sm text-marg-text-secondary">
                            <li className="flex items-start"><span className="text-marg-secondary mr-2 mt-1">✓</span> 2nd year (or higher) student.</li>
                            <li className="flex items-start"><span className="text-marg-secondary mr-2 mt-1">✓</span> Enrolled in a Government or Top Private University.</li>
                            <li className="flex items-start"><span className="text-marg-secondary mr-2 mt-1">✓</span> Maintained a 9.0+ CGPA or equivalent.</li>
                            <li className="flex items-start"><span className="text-marg-secondary mr-2 mt-1">✓</span> Intermediate or Excellent communication skills.</li>
                        </ul>
                        <hr className="my-6" />
                        <h3 className="font-bold text-lg text-marg-primary mb-4">Selection Process</h3>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-marg-text-secondary">
                            <li>Application Review</li>
                            <li>Interview with MARG Management</li>
                            <li>Onboarding & Training</li>
                        </ol>
                    </div>

                    {/* Form Section */}
                    <div className="lg:col-span-2 bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                        {step === 1 && (
                            <form noValidate>
                                <ProgressBar currentStep={1} totalSteps={3} />
                                <h2 className="text-2xl font-bold text-marg-primary mb-6">Step 1: Personal & Academic Details</h2>
                                <div className="space-y-6">
                                    <FormInput label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} error={errors.fullName} />
                                    <FormInput label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} placeholder="you@example.com"/>
                                    <FormInput label="University Name" name="university" value={formData.university} onChange={handleChange} error={errors.university} />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormSelect label="Current Year of Study" name="year" value={formData.year} onChange={handleChange} error={errors.year}>
                                            <option value="">Select Year...</option>
                                            <option value="2nd Year">2nd Year</option>
                                            <option value="3rd Year">3rd Year</option>
                                            <option value="4th Year">4th Year</option>
                                            <option value="Postgraduate">Postgraduate</option>
                                        </FormSelect>
                                        <FormInput label="Current CGPA (out of 10)" name="cgpa" type="number" value={formData.cgpa} onChange={handleChange} error={errors.cgpa} placeholder="e.g., 9.2"/>
                                    </div>
                                </div>
                                <div className="flex justify-end mt-8">
                                    <button type="button" onClick={handleNext} className="bg-marg-accent text-white px-8 py-3 rounded-lg font-bold">Next Step</button>
                                </div>
                            </form>
                        )}
                        {step === 2 && (
                             <form onSubmit={handleSubmit} noValidate>
                                <ProgressBar currentStep={2} totalSteps={3} />
                                <h2 className="text-2xl font-bold text-marg-primary mb-6">Step 2: Skills & Motivation</h2>
                                <div className="space-y-6">
                                    <FormSelect label="How would you rate your communication skills?" name="communication" value={formData.communication} onChange={handleChange} error={errors.communication}>
                                        <option value="">Select Level...</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Excellent">Excellent</option>
                                    </FormSelect>
                                    <div>
                                        <label htmlFor="motivation" className="block text-sm font-bold text-marg-text-secondary mb-2">Why do you want to be a MARG mentor?</label>
                                        <textarea id="motivation" name="motivation" value={formData.motivation} onChange={handleChange} rows={5} placeholder="Share your motivation for guiding other students..." className={`w-full p-3 border rounded-lg focus:ring-2 focus:outline-none ${errors.motivation ? 'border-red-500 ring-red-300' : 'border-gray-300 focus:ring-marg-accent'}`}></textarea>
                                        {errors.motivation && <p className="text-xs text-red-600 mt-1">{errors.motivation}</p>}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-8">
                                    <button type="button" onClick={() => setStep(1)} className="text-sm font-medium text-marg-text-secondary hover:text-marg-primary">Back</button>
                                    <button type="submit" className="bg-marg-accent text-white px-8 py-3 rounded-lg font-bold">Submit Application</button>
                                </div>
                            </form>
                        )}
                        {step === 3 && (
                            <div className="text-center p-8">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <h2 className="text-3xl font-bold text-marg-primary mt-6">Application Received!</h2>
                                <p className="text-marg-text-secondary mt-3 max-w-md mx-auto">Thank you for your interest. If your application meets our criteria, a member of the MARG management team will contact you to schedule an interview.</p>
                                <Link to="/" className="inline-block mt-8 bg-marg-secondary text-white px-8 py-3 rounded-lg font-bold">Back to Home</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BecomeMentorPage;
