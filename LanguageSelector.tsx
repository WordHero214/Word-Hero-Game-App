import React from 'react';
import { Language } from './translations';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

interface LanguageSelectorProps {
  currentLanguage: Language;
  userId: string;
  onLanguageChange: (lang: Language) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  currentLanguage, 
  userId, 
  onLanguageChange 
}) => {
  const handleLanguageChange = async (newLang: Language) => {
    try {
      // Update in Firebase
      await updateDoc(doc(db, 'users', userId), { language: newLang });
      // Update local state
      onLanguageChange(newLang);
      console.log(`✅ Language changed to: ${newLang === 'en' ? 'English' : 'Filipino'}`);
    } catch (error) {
      console.error('❌ Error updating language:', error);
    }
  };

  return (
    <div className="flex items-center gap-0.5 bg-[#1a2638]/60 rounded-lg p-0.5 border border-white/5">
      <button
        onClick={() => handleLanguageChange('en')}
        className={`px-2 py-1 rounded-md font-semibold text-[10px] transition-all flex items-center gap-1 ${
          currentLanguage === 'en'
            ? 'bg-[#00c2a0] text-white'
            : 'bg-transparent text-gray-500 hover:text-gray-300'
        }`}
        title="Switch to English"
      >
        <span className="text-sm">🇺🇸</span>
      </button>
      
      <button
        onClick={() => handleLanguageChange('fil')}
        className={`px-2 py-1 rounded-md font-semibold text-[10px] transition-all flex items-center gap-1 ${
          currentLanguage === 'fil'
            ? 'bg-[#00c2a0] text-white'
            : 'bg-transparent text-gray-500 hover:text-gray-300'
        }`}
        title="Lumipat sa Filipino"
      >
        <span className="text-sm">🇵🇭</span>
      </button>
    </div>
  );
};

export default LanguageSelector;
