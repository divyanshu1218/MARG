import React from 'react';
import { Link } from 'react-router-dom';

const CheckIcon: React.FC<{ className?: string }> = ({ className = "text-marg-secondary" }) => (
  <svg className={`w-6 h-6 mr-3 flex-shrink-0 ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PricingCard: React.FC<{
  plan: string;
  description: string;
  price?: string;
  priceDetails?: string;
  features: string[];
  ctaText: string;
  isFeatured?: boolean;
}> = ({ plan, description, price, priceDetails, features, ctaText, isFeatured = false }) => {
  const cardClasses = `bg-white p-8 rounded-2xl border transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl flex flex-col h-full`;
  const featuredCardClasses = `border-marg-accent shadow-xl relative overflow-hidden`;
  const buttonClasses = `w-full mt-auto py-3 px-6 rounded-lg font-bold transition-transform hover:scale-105`;
  const featuredButtonClasses = `bg-marg-accent text-white shadow-lg`;
  const standardButtonClasses = `bg-marg-primary text-white`;

  return (
    <div className={`${cardClasses} ${isFeatured ? featuredCardClasses : 'border-gray-200'}`}>
      {isFeatured && (
        <div className="absolute top-0 right-0 bg-marg-accent text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
          MOST POPULAR
        </div>
      )}
      <h3 className="text-2xl font-bold text-marg-primary">{plan}</h3>
      <p className="text-marg-text-secondary mt-2 mb-6">{description}</p>
      
      {price && (
        <div className="mb-6">
          <span className="text-4xl font-extrabold text-marg-primary">{price}</span>
          {priceDetails && <span className="text-marg-text-secondary">{priceDetails}</span>}
        </div>
      )}

      <ul className="space-y-4 text-marg-text-secondary mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <CheckIcon className={isFeatured ? "text-marg-accent" : "text-marg-secondary"} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <button className={`${buttonClasses} ${isFeatured ? featuredButtonClasses : standardButtonClasses}`}>
        {ctaText}
      </button>
    </div>
  );
};


const ProPage: React.FC = () => {
  return (
    <div className="bg-marg-bg-light min-h-screen">
      {/* Hero Section */}
      <div className="text-center py-16 px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-marg-primary mb-4 opacity-0 animate-fade-in-up">Unlock Your Full Potential with MARG Pro</h1>
        <p className="text-lg text-marg-text-secondary max-w-3xl mx-auto opacity-0 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          Get advanced guidance, unlimited access, and premium tools designed for ambitious students and dedicated educators.
        </p>
      </div>

      {/* Pricing Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          
          {/* Free Plan */}
          <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <PricingCard
              plan="Free Plan"
              description="The essential tools to start your journey."
              price="Free"
              features={[
                "Basic Aptitude Quiz",
                "Core AI Recommendations",
                "Career Library Access",
                "1 Classroom for Teachers (up to 50 Students)",
                "1 Free Mentorship Session for Students"
              ]}
              ctaText="Currently Active"
            />
          </div>

          {/* Student Pro Plan */}
          <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
            <PricingCard
              plan="Student Pro"
              description="For students serious about their future."
              price="₹499"
              priceDetails="/ student"
              features={[
                "Advanced Career Pathways & AI Timelines",
                "Unlimited, Evolving AI Suggestions",
                "Downloadable Personalized Reports",
                "Exclusive Access to Premium Resources",
                "Unlimited One-on-One Mentorship Counseling"
              ]}
              ctaText="Upgrade to Student Pro"
              isFeatured={true}
            />
          </div>

          {/* Teacher Pro Plan */}
          <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '800ms' }}>
            <PricingCard
              plan="Teacher Pro"
              description="Empower your entire classroom with data."
              price="Custom"
              priceDetails=" for institutions"
              features={[
                "Unlimited Classrooms & Students",
                "Advanced Classroom & Student Analytics",
                "Bulk Student Onboarding & Management",
                "Class-wide Resource & Announcement Sharing",
                "Priority Support for Educators"
              ]}
              ctaText="Contact Sales"
            />
          </div>
        </div>
      </div>

      {/* Become a Mentor Section */}
      <div className="bg-marg-bg py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center opacity-0 animate-fade-in-up" style={{ animationDelay: '900ms' }}>
            <h2 className="text-3xl font-bold text-marg-primary mb-4">Join Our Community of Mentors</h2>
            <p className="text-lg text-marg-text-secondary mb-8">
                Are you a 2nd year (or higher) college student with a passion for guiding others? Apply to become a vetted MARG mentor and make a real impact on the next generation of students.
            </p>
            <Link 
                to="/become-a-mentor"
                className="inline-block bg-marg-secondary text-white px-8 py-3 rounded-lg font-bold hover:bg-marg-secondary/90 transition-transform hover:scale-105 shadow-lg"
            >
                Apply to be a MARG Mentor
            </Link>
        </div>
      </div>
    </div>
  );
};

export default ProPage;