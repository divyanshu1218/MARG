import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CAREER_CATEGORIES, CAREERS_DATA, SUB_CATEGORIES } from '../constants';
import CareerCard from '../components/CareerCard';
import { getCareerDetails, findColleges } from '../services/geminiService';
import { Career, College } from '../types';

const CollegeList: React.FC<{ career: Career | null }> = ({ career }) => {
    const [budget, setBudget] = useState('');
    const [location, setLocation] = useState('');
    const [collegeType, setCollegeType] = useState('');

    const [colleges, setColleges] = useState<College[] | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);

    const handleSearch = async () => {
        if (!career) return;
        setIsSearching(true);
        setSearchError(null);
        setColleges(null);
        try {
            const results = await findColleges(career.title, budget, location, collegeType);
            setColleges(results);
        } catch (error) {
            console.error("Failed to get college recommendations:", error);
            setSearchError("Sorry, we couldn't fetch recommendations. Please try again later.");
        } finally {
            setIsSearching(false);
        }
    };


    if (!career) return null;

    return (
        <div>
            <div className="space-y-4 mb-6 p-4 bg-marg-bg-light rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Budget Filter */}
                    <div>
                        <label className="block text-sm font-medium text-marg-text-secondary mb-1">Budget (Annual)</label>
                        <input
                            type="text"
                            value={budget}
                            onChange={e => setBudget(e.target.value)}
                            placeholder="e.g., < 2 Lakhs, affordable"
                            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-marg-accent focus:outline-none"
                        />
                    </div>
                    {/* Type Filter */}
                    <div>
                        <label className="block text-sm font-medium text-marg-text-secondary mb-1">College Type</label>
                        <input
                            type="text"
                            value={collegeType}
                            onChange={e => setCollegeType(e.target.value)}
                            placeholder="e.g., Government, Private"
                            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-marg-accent focus:outline-none"
                        />
                    </div>
                </div>
                 {/* Location Filter */}
                <div>
                    <label className="block text-sm font-medium text-marg-text-secondary mb-1">City or State</label>
                    <input
                        type="text"
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                        placeholder="e.g., Mumbai, Delhi, Maharashtra"
                        className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-marg-accent focus:outline-none"
                    />
                </div>
                 <button
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="w-full mt-2 flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-marg-accent hover:bg-marg-accent/90 transition-all transform hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {isSearching ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Searching with AI...
                        </>
                    ) : (
                        'Find Colleges with AI'
                    )}
                </button>
            </div>

            {/* College List */}
            <div className="space-y-4">
                {searchError && (
                    <p className="text-center text-red-600 font-semibold py-8">{searchError}</p>
                )}
                
                {colleges && colleges.length > 0 && (
                    colleges.map(college => (
                        <div key={college.name} className="bg-white p-4 rounded-lg border border-gray-200 animate-fade-in-up-short">
                            <div className="flex justify-between items-start gap-2">
                                <h4 className="font-bold text-marg-primary">{college.name}</h4>
                                {college.website && (
                                    <a href={college.website} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-marg-accent hover:underline flex-shrink-0">
                                        Visit Website 
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 inline-block ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                    </a>
                                )}
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-marg-text-secondary mt-1">
                                <span>📍 {college.city}, {college.state}</span>
                                <span>🎓 {college.type}</span>
                                {college.annualFees > 0 && <span>💰 ₹{college.annualFees.toLocaleString('en-IN')}/year</span>}
                            </div>
                        </div>
                    ))
                )}
                
                {colleges !== null && colleges.length === 0 && !isSearching && (
                     <p className="text-center text-marg-text-secondary py-8">No colleges match your filter criteria.</p>
                )}
            </div>
        </div>
    );
};


const CareerDetailModal: React.FC<{
  career: Career | null;
  details: string;
  isLoading: boolean;
  onClose: () => void;
}> = ({ career, details, isLoading, onClose }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'colleges'>('details');

  useEffect(() => {
    // Reset to details tab when a new career is selected
    if (career) {
      setActiveTab('details');
    }
  }, [career]);
    
  if (!career) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-marg-primary">{career.title}</h2>
            <p className="text-sm text-marg-text-secondary">{career.category} / {career.subcategory}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="border-b border-gray-200">
          <nav className="flex space-x-4 px-6">
            <button onClick={() => setActiveTab('details')} className={`py-3 px-1 text-sm font-medium ${activeTab === 'details' ? 'border-b-2 border-marg-accent text-marg-primary' : 'text-marg-text-secondary'}`}>
              Career Details
            </button>
            <button onClick={() => setActiveTab('colleges')} className={`py-3 px-1 text-sm font-medium ${activeTab === 'colleges' ? 'border-b-2 border-marg-accent text-marg-primary' : 'text-marg-text-secondary'}`}>
              Find Colleges
            </button>
          </nav>
        </div>

        <div className="p-6 overflow-y-auto bg-gray-50/50 flex-1">
          {activeTab === 'details' && (
            isLoading ? (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-marg-accent border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-marg-text-secondary">Fetching latest insights with AI...</p>
              </div>
            ) : (
              <div 
                className="prose prose-sm max-w-none text-marg-text-primary" 
                dangerouslySetInnerHTML={{ 
                  __html: details
                    .replace(/\n/g, '<br />')
                    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-marg-secondary hover:underline font-medium">$1</a>')
                }}
              ></div>
            )
          )}
          {activeTab === 'colleges' && <CollegeList career={career} />}
        </div>
      </div>
    </div>
  );
};


const CareersPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeSubCategory, setActiveSubCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [careerDetails, setCareerDetails] = useState('');
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [searchParams] = useSearchParams();

  const handleCardClick = useCallback(async (career: Career) => {
    setSelectedCareer(career);
    setIsLoadingDetails(true);
    setCareerDetails('');
    try {
        const details = await getCareerDetails(career.title);
        setCareerDetails(details);
    } catch (error) {
        console.error("Failed to get career details:", error);
        setCareerDetails("Sorry, I couldn't fetch details for this career. Please try again later.");
    } finally {
        setIsLoadingDetails(false);
    }
  }, []);

  useEffect(() => {
    const initialSearch = searchParams.get('search');
    if (initialSearch) {
      setSearchTerm(initialSearch);
      const matchingCareer = CAREERS_DATA.find(career =>
        career.title.toLowerCase().includes(initialSearch.toLowerCase())
      );
      if (matchingCareer) {
        handleCardClick(matchingCareer);
      }
    }
  }, [searchParams, handleCardClick]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
       if (event.key === 'Escape') {
        setSelectedCareer(null);
       }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    setActiveSubCategory('All'); // Reset sub-category when main category changes
  };

  const filteredCareers = useMemo(() => {
    return CAREERS_DATA.filter(career => {
      const matchesCategory = activeCategory === 'All' || career.category === activeCategory;
      
      const subCategoriesForActiveCategory = SUB_CATEGORIES[activeCategory];
      const matchesSubCategory = !subCategoriesForActiveCategory || activeSubCategory === 'All' || career.subcategory === activeSubCategory;

      const matchesSearch = career.title.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesCategory && matchesSubCategory && matchesSearch;
    });
  }, [activeCategory, activeSubCategory, searchTerm]);
  
  const subCategoriesForActiveCategory = SUB_CATEGORIES[activeCategory];

  return (
    <div className="bg-marg-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-extrabold text-marg-primary mb-2">Explore Career Choices</h1>
        <p className="text-lg text-marg-text-secondary mb-8">Find your path, then discover the best colleges to get you there.</p>

        <div className="mb-4 flex flex-wrap gap-2">
          {CAREER_CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category
                  ? 'bg-marg-secondary text-white'
                  : 'bg-white text-marg-text-secondary hover:bg-marg-bg-light'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        {subCategoriesForActiveCategory && activeCategory !== 'All' && (
            <div className="mb-6 flex flex-wrap gap-2 pl-4 border-l-4 border-marg-secondary/30 transition-all duration-300">
                <button
                    onClick={() => setActiveSubCategory('All')}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        activeSubCategory === 'All'
                            ? 'bg-marg-accent text-white'
                            : 'bg-white text-marg-text-secondary hover:bg-marg-bg-light'
                    }`}
                >
                    All {activeCategory}
                </button>
                {subCategoriesForActiveCategory.map(subCategory => (
                    <button
                        key={subCategory}
                        onClick={() => setActiveSubCategory(subCategory)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            activeSubCategory === subCategory
                                ? 'bg-marg-accent text-white'
                                : 'bg-white text-marg-text-secondary hover:bg-marg-bg-light'
                        }`}
                    >
                        {subCategory}
                    </button>
                ))}
            </div>
        )}

        <div className="mb-8 relative">
           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
           </div>
          <input
            type="text"
            placeholder="Search careers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-marg-accent focus:outline-none"
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCareers.length > 0 ? (
            filteredCareers.map(career => <CareerCard key={career.id} career={career} onClick={handleCardClick} />)
          ) : (
            <p className="text-marg-text-secondary md:col-span-3 text-center">No careers found matching your criteria.</p>
          )}
        </div>
      </div>
       <CareerDetailModal
        career={selectedCareer}
        details={careerDetails}
        isLoading={isLoadingDetails}
        onClose={() => setSelectedCareer(null)}
      />
    </div>
  );
};

export default CareersPage;