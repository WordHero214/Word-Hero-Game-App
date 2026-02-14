import React, { useState } from 'react';
import { Word, Difficulty } from './types';
import { addWord, updateWord, deleteWord } from './firebaseService';
import BulkWordUpload from './BulkWordUpload';

interface WordBankManagerProps {
  words: Word[];
  onWordsChange: () => void;
}

const WordBankManager: React.FC<WordBankManagerProps> = ({ words, onWordsChange }) => {
  const [filter, setFilter] = useState<Difficulty | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingWord, setEditingWord] = useState<Word | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [needsRefresh, setNeedsRefresh] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [wordToDelete, setWordToDelete] = useState<string | null>(null);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [formData, setFormData] = useState({
    term: '',
    difficulty: Difficulty.EASY,
    category: '',
    hint: '',
    scenario: '',
    gradeLevels: [] as string[],
    sections: [] as string[]
  });

  const filteredWords = words
    .filter(w => filter === 'ALL' || w.difficulty === filter)
    .filter(w => w.term.toLowerCase().includes(search.toLowerCase()) || 
                 w.category.toLowerCase().includes(search.toLowerCase()));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.term || !formData.category) {
      setErrorMessage('Please fill in all required fields (Word and Category)');
      setShowErrorModal(true);
      return;
    }

    try {
      if (editingWord) {
        await updateWord(editingWord.id, {
          term: formData.term.toUpperCase(),
          difficulty: formData.difficulty,
          category: formData.category,
          gradeLevels: formData.gradeLevels.length > 0 ? formData.gradeLevels : undefined,
          sections: formData.sections.length > 0 ? formData.sections : undefined,
          ...(formData.hint && { hint: formData.hint }),
          ...(formData.scenario && { scenario: formData.scenario })
        });
        setSuccessMessage(`Word "${formData.term.toUpperCase()}" updated successfully!`);
        setShowSuccessModal(true);
        setEditingWord(null);
        // Clear form after editing
        setFormData({
          term: '',
          difficulty: Difficulty.EASY,
          category: '',
          hint: '',
          scenario: '',
          gradeLevels: [],
          sections: []
        });
      } else {
        const newWord: Word = {
          id: `teacher_${Date.now()}`,
          term: formData.term.toUpperCase(),
          difficulty: formData.difficulty,
          category: formData.category,
          gradeLevels: formData.gradeLevels.length > 0 ? formData.gradeLevels : undefined,
          sections: formData.sections.length > 0 ? formData.sections : undefined,
          ...(formData.hint && { hint: formData.hint }),
          ...(formData.scenario && { scenario: formData.scenario })
        };
        await addWord(newWord);
        setSuccessMessage(`Word "${formData.term.toUpperCase()}" added successfully!`);
        setShowSuccessModal(true);
        setNeedsRefresh(true); // Mark that we need to refresh later
        // Clear form but keep form open for adding more words
        setFormData({
          term: '',
          difficulty: formData.difficulty, // Keep same difficulty
          category: '',
          hint: '',
          scenario: '',
          gradeLevels: formData.gradeLevels, // Keep same grade levels
          sections: formData.sections // Keep same sections
        });
      }
      
      // Only refresh if editing (not adding new)
      if (editingWord) {
        onWordsChange();
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'An error occurred while saving the word');
      setShowErrorModal(true);
    }
  };

  const handleEdit = (word: Word) => {
    setEditingWord(word);
    setFormData({
      term: word.term,
      difficulty: word.difficulty,
      category: word.category,
      hint: word.hint || '',
      scenario: word.scenario || '',
      gradeLevels: word.gradeLevels || [],
      sections: word.sections || []
    });
    setShowForm(true);
  };

  const handleDelete = async (wordId: string) => {
    setWordToDelete(wordId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!wordToDelete) return;
    
    try {
      await deleteWord(wordToDelete);
      setSuccessMessage('Word deleted successfully!');
      setShowSuccessModal(true);
      setShowDeleteConfirm(false);
      setWordToDelete(null);
      onWordsChange();
    } catch (error: any) {
      setErrorMessage(error.message || 'An error occurred while deleting the word');
      setShowErrorModal(true);
      setShowDeleteConfirm(false);
      setWordToDelete(null);
    }
  };

  const resetForm = () => {
    setFormData({
      term: '',
      difficulty: Difficulty.EASY,
      category: '',
      hint: '',
      scenario: '',
      gradeLevels: [],
      sections: []
    });
    setEditingWord(null);
    setShowForm(false);
    // Refresh word list if needed
    if (needsRefresh) {
      onWordsChange();
      setNeedsRefresh(false);
    }
  };

  const wordsByDifficulty = {
    easy: words.filter(w => w.difficulty === Difficulty.EASY).length,
    medium: words.filter(w => w.difficulty === Difficulty.MEDIUM).length,
    hard: words.filter(w => w.difficulty === Difficulty.HARD).length
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#162031] rounded-2xl p-4 border border-white/5">
          <p className="text-gray-500 text-xs uppercase font-bold mb-2">Total Words</p>
          <p className="text-3xl font-bold text-white">{words.length}</p>
        </div>
        <div className="bg-[#22c55e]/10 border border-[#22c55e]/20 rounded-2xl p-4">
          <p className="text-gray-500 text-xs uppercase font-bold mb-2">Easy</p>
          <p className="text-3xl font-bold text-[#22c55e]">{wordsByDifficulty.easy}</p>
        </div>
        <div className="bg-[#3b82f6]/10 border border-[#3b82f6]/20 rounded-2xl p-4">
          <p className="text-gray-500 text-xs uppercase font-bold mb-2">Medium</p>
          <p className="text-3xl font-bold text-[#3b82f6]">{wordsByDifficulty.medium}</p>
        </div>
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4">
          <p className="text-gray-500 text-xs uppercase font-bold mb-2">Hard</p>
          <p className="text-3xl font-bold text-orange-500">{wordsByDifficulty.hard}</p>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="bg-[#162031] rounded-2xl p-6 border border-white/5">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="flex gap-3">
            <button
              onClick={() => setShowForm(true)}
              className="bg-[#00c2a0] hover:bg-[#00d8b3] text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all active:scale-95"
            >
              <span className="text-xl">➕</span>
              Add Word
            </button>
            <button
              onClick={() => setShowBulkUpload(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all active:scale-95"
            >
              <span className="text-xl">📤</span>
              Bulk Upload
            </button>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                placeholder="Search words..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#0b1221] border border-white/5 rounded-xl py-2 px-10 text-sm text-white focus:border-[#00c2a0] outline-none"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${
              filter === 'ALL' ? 'bg-white/10 text-white' : 'text-gray-500'
            }`}
          >
            All ({words.length})
          </button>
          <button
            onClick={() => setFilter(Difficulty.EASY)}
            className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${
              filter === Difficulty.EASY ? 'bg-[#22c55e] text-white' : 'text-gray-500'
            }`}
          >
            Easy ({wordsByDifficulty.easy})
          </button>
          <button
            onClick={() => setFilter(Difficulty.MEDIUM)}
            className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${
              filter === Difficulty.MEDIUM ? 'bg-[#3b82f6] text-white' : 'text-gray-500'
            }`}
          >
            Medium ({wordsByDifficulty.medium})
          </button>
          <button
            onClick={() => setFilter(Difficulty.HARD)}
            className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${
              filter === Difficulty.HARD ? 'bg-orange-500 text-white' : 'text-gray-500'
            }`}
          >
            Hard ({wordsByDifficulty.hard})
          </button>
        </div>
      </div>

      {/* Word List */}
      <div className="bg-[#162031] rounded-2xl p-6 border border-white/5">
        <h3 className="text-xl font-bold text-white mb-6">
          {filteredWords.length} Word{filteredWords.length !== 1 ? 's' : ''}
        </h3>
        
        {filteredWords.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-2">No words found</p>
            <p className="text-gray-600 text-sm">Try adjusting your filters or add new words</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {filteredWords.map((word) => {
              const difficultyColors = {
                [Difficulty.EASY]: 'bg-[#22c55e]/10 border-[#22c55e]/20 text-[#22c55e]',
                [Difficulty.MEDIUM]: 'bg-[#3b82f6]/10 border-[#3b82f6]/20 text-[#3b82f6]',
                [Difficulty.HARD]: 'bg-orange-500/10 border-orange-500/20 text-orange-500'
              };

              return (
                <div
                  key={word.id}
                  className="bg-[#0b1221] rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1">
                      <h4 className="text-xl font-bold text-white">{word.term}</h4>
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${difficultyColors[word.difficulty]}`}>
                        {word.difficulty}
                      </span>
                      <span className="text-gray-500 text-sm">{word.category}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(word)}
                        className="text-blue-400 hover:text-blue-300 font-bold text-sm px-3 py-1 rounded-lg hover:bg-blue-400/10 transition-all"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(word.id)}
                        className="text-red-400 hover:text-red-300 font-bold text-sm px-3 py-1 rounded-lg hover:bg-red-400/10 transition-all"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                  {word.hint && (
                    <p className="text-gray-400 text-sm italic mb-2">💡 {word.hint}</p>
                  )}
                  {word.scenario && (
                    <p className="text-gray-400 text-sm italic">📝 {word.scenario}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-[#162031] rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in slide-in-from-bottom-8 duration-500 shadow-2xl border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="text-3xl">{editingWord ? '✏️' : '➕'}</span>
                {editingWord ? 'Edit Word' : 'Add New Word'}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-white text-2xl w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/5 transition-all active:scale-90"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                  Word Term *
                </label>
                <input
                  type="text"
                  value={formData.term}
                  onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                  className="w-full bg-[#0b1221] border border-white/5 rounded-xl py-3 px-4 text-white outline-none focus:border-[#00c2a0] transition-all"
                  placeholder="APPLE"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                  Difficulty *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD].map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setFormData({ ...formData, difficulty: diff })}
                      className={`py-3 px-4 rounded-xl font-bold transition-all ${
                        formData.difficulty === diff
                          ? diff === Difficulty.EASY ? 'bg-[#22c55e] text-white' :
                            diff === Difficulty.MEDIUM ? 'bg-[#3b82f6] text-white' :
                            'bg-orange-500 text-white'
                          : 'bg-[#0b1221] text-gray-400 border border-white/5'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                  Category *
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-[#0b1221] border border-white/5 rounded-xl py-3 px-4 text-white outline-none focus:border-[#00c2a0] transition-all"
                  placeholder="Fruits, Animals, Science, etc."
                  required
                />
              </div>

              {formData.difficulty === Difficulty.EASY && (
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                    Hint (for Easy mode)
                  </label>
                  <textarea
                    value={formData.hint}
                    onChange={(e) => setFormData({ ...formData, hint: e.target.value })}
                    className="w-full bg-[#0b1221] border border-white/5 rounded-xl py-3 px-4 text-white outline-none focus:border-[#00c2a0] transition-all resize-none"
                    rows={2}
                    placeholder="A helpful hint for students..."
                  />
                </div>
              )}

              {formData.difficulty === Difficulty.HARD && (
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                    Scenario (for Hard mode)
                  </label>
                  <textarea
                    value={formData.scenario}
                    onChange={(e) => setFormData({ ...formData, scenario: e.target.value })}
                    className="w-full bg-[#0b1221] border border-white/5 rounded-xl py-3 px-4 text-white outline-none focus:border-[#00c2a0] transition-all resize-none"
                    rows={2}
                    placeholder="A sentence with _______ for the missing word..."
                  />
                </div>
              )}

              {/* Grade Level Selection */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                  Grade Levels (Leave empty for all grades)
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {['1', '2', '3', '4', '5', '6'].map((grade) => (
                    <button
                      key={grade}
                      type="button"
                      onClick={() => {
                        const newGrades = formData.gradeLevels.includes(grade)
                          ? formData.gradeLevels.filter(g => g !== grade)
                          : [...formData.gradeLevels, grade];
                        setFormData({ ...formData, gradeLevels: newGrades });
                      }}
                      className={`py-2 px-3 rounded-lg font-bold text-sm transition-all ${
                        formData.gradeLevels.includes(grade)
                          ? 'bg-[#00c2a0] text-white'
                          : 'bg-[#0b1221] text-gray-400 border border-white/5'
                      }`}
                    >
                      {grade}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  {formData.gradeLevels.length === 0 
                    ? 'Available to all grade levels' 
                    : `Available to Grade ${formData.gradeLevels.join(', ')}`}
                </p>
              </div>

              {/* Section Selection */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                  Sections (Leave empty for all sections)
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {['A', 'B', 'C', 'D', 'E', 'F'].map((section) => (
                    <button
                      key={section}
                      type="button"
                      onClick={() => {
                        const newSections = formData.sections.includes(section)
                          ? formData.sections.filter(s => s !== section)
                          : [...formData.sections, section];
                        setFormData({ ...formData, sections: newSections });
                      }}
                      className={`py-2 px-3 rounded-lg font-bold text-sm transition-all ${
                        formData.sections.includes(section)
                          ? 'bg-[#00c2a0] text-white'
                          : 'bg-[#0b1221] text-gray-400 border border-white/5'
                      }`}
                    >
                      {section}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  {formData.sections.length === 0 
                    ? 'Available to all sections' 
                    : `Available to Section ${formData.sections.join(', ')}`}
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#00c2a0] to-[#00d8b3] hover:from-[#00d8b3] hover:to-[#00e8c3] text-white font-bold py-3 rounded-xl transition-all active:scale-95 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <span className="text-xl">{editingWord ? '✓' : '➕'}</span>
                  {editingWord ? 'Update Word' : 'Add Word'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 bg-[#0b1221] hover:bg-[#162031] text-gray-400 hover:text-white font-bold py-3 rounded-xl transition-all active:scale-95 border border-white/10 hover:border-white/20"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[110] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-[#162031] rounded-3xl p-8 max-w-md w-full border-2 border-[#00c2a0] shadow-2xl animate-in zoom-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-[#00c2a0] to-[#00d8b3] rounded-full flex items-center justify-center mx-auto animate-bounce shadow-lg shadow-[#00c2a0]/50">
                <span className="text-4xl">✅</span>
              </div>
              <h3 className="text-2xl font-bold text-white animate-in slide-in-from-top-2 duration-500">Success!</h3>
              <p className="text-gray-300 text-lg animate-in slide-in-from-bottom-2 duration-500 delay-100">{successMessage}</p>
              <div className="pt-4 space-y-3">
                {!editingWord && (
                  <button
                    onClick={() => {
                      setShowSuccessModal(false);
                      // DON'T call onWordsChange() here - it causes re-render and closes form
                      // Just close modal and focus on input
                      setTimeout(() => {
                        const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                        if (input) input.focus();
                      }, 100);
                    }}
                    className="w-full bg-gradient-to-r from-[#00c2a0] to-[#00d8b3] hover:from-[#00d8b3] hover:to-[#00e8c3] text-white font-bold py-3 rounded-xl transition-all active:scale-95 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    ➕ Add Another Word
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    onWordsChange(); // Refresh word list now
                    setNeedsRefresh(false); // Clear the flag
                    if (!editingWord) {
                      resetForm(); // Close form only if not editing
                    }
                  }}
                  className="w-full bg-[#0b1221] hover:bg-[#162031] text-gray-400 hover:text-white font-bold py-3 rounded-xl transition-all active:scale-95 border border-white/10 hover:border-white/20"
                >
                  {editingWord ? '✓ Done' : '✓ Done - Close Form'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[110] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-[#162031] rounded-3xl p-8 max-w-md w-full border-2 border-red-500 shadow-2xl animate-in zoom-in shake duration-500">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto animate-pulse shadow-lg shadow-red-500/50">
                <span className="text-4xl">⚠️</span>
              </div>
              <h3 className="text-2xl font-bold text-white">Oops!</h3>
              <p className="text-gray-300 text-lg">{errorMessage}</p>
              <button
                onClick={() => setShowErrorModal(false)}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 rounded-xl transition-all active:scale-95 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[110] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-[#162031] rounded-3xl p-8 max-w-md w-full border-2 border-orange-500 shadow-2xl animate-in zoom-in duration-500">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto animate-bounce shadow-lg shadow-orange-500/50">
                <span className="text-4xl">🗑️</span>
              </div>
              <h3 className="text-2xl font-bold text-white">Delete Word?</h3>
              <p className="text-gray-300 text-lg">Are you sure you want to delete this word? This action cannot be undone.</p>
              <div className="pt-4 space-y-3">
                <button
                  onClick={confirmDelete}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 rounded-xl transition-all active:scale-95 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setWordToDelete(null);
                  }}
                  className="w-full bg-[#0b1221] hover:bg-[#162031] text-gray-400 hover:text-white font-bold py-3 rounded-xl transition-all active:scale-95 border border-white/10 hover:border-white/20"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Word Upload Modal */}
      {showBulkUpload && (
        <BulkWordUpload
          onClose={() => setShowBulkUpload(false)}
          onSuccess={() => {
            setShowBulkUpload(false);
            onWordsChange(); // Refresh word list
          }}
        />
      )}
    </div>
  );
};

export default WordBankManager;
