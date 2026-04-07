
import React, { useState, useEffect } from 'react';
import { User, Difficulty, Word } from './types';
import { getWords, getAllStudents } from './firebaseService';
import WordBankManager from './WordBankManager';
import StudentAnalytics from './StudentAnalytics';
import PasswordChangeModal from './PasswordChangeModal';
import BulkWordUpload from './BulkWordUpload';
import AdvancedAnalytics from './AdvancedAnalytics';

interface TeacherViewProps {
  initialTab?: 'dashboard' | 'students' | 'words' | 'analytics';
}

const TeacherView: React.FC<TeacherViewProps> = ({ initialTab = 'dashboard' }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'students' | 'words' | 'analytics'>(initialTab);
  const [students, setStudents] = useState<User[]>([]);
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentSearch, setStudentSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'sparkies' | 'progress'>('sparkies');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [wordsData, studentsData] = await Promise.all([
        getWords(),
        getAllStudents()
      ]);
      setWords(wordsData);
      setStudents(studentsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtering and Sorting
  const filteredStudents = students
    .filter(s => {
      // Search filter
      const matchesSearch = s.name.toLowerCase().includes(studentSearch.toLowerCase());
      // Grade filter
      const matchesGrade = gradeFilter === 'all' || s.gradeLevel === gradeFilter;
      return matchesSearch && matchesGrade;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'sparkies') return (b.sparkies || 0) - (a.sparkies || 0);
      const avgA = Object.values(a.levelProgress || {}).reduce((sum, lp) => sum + lp.mastery, 0) / 3;
      const avgB = Object.values(b.levelProgress || {}).reduce((sum, lp) => sum + lp.mastery, 0) / 3;
      return avgB - avgA;
    });
  
  // Top Performers - sorted by sparkies (highest to lowest)
  const topPerformers = [...students]
    .sort((a, b) => (b.sparkies || 0) - (a.sparkies || 0))
    .slice(0, 5);
  
  // Get unique grade levels for filter
  const gradeLevels = Array.from(new Set(students.map(s => s.gradeLevel).filter(Boolean))).sort();

  // Analytics
  const totalWords = words.length;
  const wordsByDifficulty = {
    easy: words.filter(w => w.difficulty === Difficulty.EASY).length,
    medium: words.filter(w => w.difficulty === Difficulty.MEDIUM).length,
    hard: words.filter(w => w.difficulty === Difficulty.HARD).length
  };
  const totalStudents = students.length;
  const activeStudents = students.filter(s => (s.totalGames || 0) > 0).length;
  const avgSparkies = students.length > 0
    ? Math.round(students.reduce((sum, s) => sum + (s.sparkies || 0), 0) / students.length)
    : 0;
  const totalGames = students.reduce((sum, s) => sum + (s.totalGames || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00c2a0] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-4xl font-bold text-white mb-2">Teacher Dashboard</h2>
          <p className="text-gray-500">Manage words, monitor students, and track progress</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'dashboard' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'students' ? 'bg-[#00c2a0] text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            👥 Students
          </button>
          <button
            onClick={() => setActiveTab('words')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'words' ? 'bg-[#f39c12] text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            📚 Word Bank
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'analytics' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            📈 Analytics
          </button>
        </div>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* No Words Warning */}
          {totalWords === 0 && (
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 animate-in slide-in-from-top duration-500 shadow-lg shadow-orange-200">
              <div className="flex items-start gap-4">
                <div className="text-4xl">⚠️</div>
                <div className="flex-1">
                  <h4 className="text-white font-bold text-lg mb-2">No Words in Word Bank</h4>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    Students are currently using default practice words. Add custom words for your students to get started!
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setActiveTab('words')}
                      className="bg-[#f39c12] hover:bg-[#e67e22] text-white font-bold py-2 px-4 rounded-xl text-sm transition-all active:scale-95"
                    >
                      ➕ Add Words Manually
                    </button>
                    <button
                      onClick={() => setShowBulkUpload(true)}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2 px-4 rounded-xl text-sm transition-all active:scale-95"
                    >
                      📤 Bulk Upload
                    </button>
                    <button
                      onClick={() => setShowPasswordChange(true)}
                      className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-bold py-2 px-4 rounded-xl text-sm transition-all active:scale-95"
                    >
                      🔒 Change Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-6 shadow-lg shadow-purple-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">👥</span>
                <span className="text-xs font-bold text-purple-100 uppercase">Students</span>
              </div>
              <p className="text-3xl font-bold text-white mb-1">{totalStudents}</p>
              <p className="text-xs text-purple-100">{activeStudents} active</p>
            </div>

            <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl p-6 shadow-lg shadow-orange-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">📚</span>
                <span className="text-xs font-bold text-orange-100 uppercase">Words</span>
              </div>
              <p className="text-3xl font-bold text-white mb-1">{totalWords}</p>
              <p className="text-xs text-orange-100">
                {wordsByDifficulty.easy}E • {wordsByDifficulty.medium}M • {wordsByDifficulty.hard}H
              </p>
            </div>

            <div className="bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl p-6 shadow-lg shadow-teal-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">✨</span>
                <span className="text-xs font-bold text-teal-100 uppercase">Avg Sparkies</span>
              </div>
              <p className="text-3xl font-bold text-white mb-1">{avgSparkies}</p>
              <p className="text-xs text-teal-100">per student</p>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 shadow-lg shadow-blue-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">🎮</span>
                <span className="text-xs font-bold text-blue-100 uppercase">Total Games</span>
              </div>
              <p className="text-3xl font-bold text-white mb-1">{totalGames}</p>
              <p className="text-xs text-blue-100">played</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setActiveTab('words')}
                className="bg-[#f39c12] hover:bg-[#e67e22] text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95"
              >
                <span className="text-2xl">➕</span>
                Manage Word Bank
              </button>

              <button
                onClick={() => setShowBulkUpload(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95"
              >
                <span className="text-2xl">📤</span>
                Bulk Upload Words
              </button>

              <button
                onClick={() => setActiveTab('students')}
                className="bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95"
              >
                <span className="text-2xl">👥</span>
                View Students
              </button>

              <button
                onClick={() => setShowPasswordChange(true)}
                className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95"
              >
                <span className="text-2xl">🔒</span>
                Change Password
              </button>

              <button
                onClick={() => setActiveTab('students')}
                className="bg-[#00c2a0] hover:bg-[#00d8b3] text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95"
              >
                <span className="text-2xl">📊</span>
                View Student Progress
              </button>
            </div>
          </div>

          {/* Top Performers */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-6">🏆 Top Performers (By Sparkies)</h3>
            <div className="space-y-3">
              {topPerformers.map((student, index) => (
                <div
                  key={student.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all cursor-pointer border border-gray-100"
                  onClick={() => setSelectedStudent(student)}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
                      index === 0
                        ? 'bg-yellow-500 text-white'
                        : index === 1
                        ? 'bg-gray-400 text-white'
                        : index === 2
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-bold">{student.name}</p>
                    <p className="text-gray-500 text-xs">
                      {student.gradeLevel ? `Grade ${student.gradeLevel}` : 'No grade'} • {student.wordsLearned || 0} words learned
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#f39c12] font-bold">✨ {student.sparkies || 0}</p>
                    <p className="text-gray-500 text-xs">{student.totalGames || 0} games</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Students Tab */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Student Performance ({filteredStudents.length})</h3>
              <div className="flex gap-3 w-full md:w-auto flex-wrap">
                <div className="relative flex-1 md:w-64">
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="w-full bg-gray-100 border border-gray-200 rounded-xl py-2 px-10 text-sm text-gray-900 focus:border-[#00c2a0] outline-none"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs">🔍</span>
                </div>
                <select
                  value={gradeFilter}
                  onChange={(e) => setGradeFilter(e.target.value)}
                  className="bg-gray-100 border border-gray-200 rounded-xl py-2 px-4 text-sm text-gray-900 focus:border-[#00c2a0] outline-none"
                >
                  <option value="all">All Grades</option>
                  {gradeLevels.map(grade => (
                    <option key={grade} value={grade}>Grade {grade}</option>
                  ))}
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-gray-100 border border-gray-200 rounded-xl py-2 px-4 text-sm text-gray-900 focus:border-[#00c2a0] outline-none"
                >
                  <option value="sparkies">Sort by Sparkies</option>
                  <option value="name">Sort by Name</option>
                  <option value="progress">Sort by Progress</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-500 text-xs font-bold uppercase tracking-widest border-b border-gray-100">
                    <th className="pb-4 pl-4">Student</th>
                    <th className="pb-4">Grade</th>
                    <th className="pb-4">Progress</th>
                    <th className="pb-4">Sparkies</th>
                    <th className="pb-4">Streak</th>
                    <th className="pb-4 text-right pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => {
                    const avgMastery = student.levelProgress
                      ? Math.round(
                          Object.values(student.levelProgress).reduce((sum, lp) => sum + lp.mastery, 0) / 3
                        )
                      : 0;

                    return (
                      <tr
                        key={student.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors group"
                      >
                        <td className="py-5 pl-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold">
                              {student.name[0]}
                            </div>
                            <div>
                              <span className="text-gray-900 font-bold block">{student.name}</span>
                              <span className="text-gray-500 text-xs">@{student.username}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-5">
                          <div className="flex items-center gap-2">
                            <span className="text-blue-600 font-bold">
                              {student.gradeLevel ? `Grade ${student.gradeLevel}` : 'N/A'}
                            </span>
                            {student.section && (
                              <span className="text-gray-500 text-xs">• {student.section}</span>
                            )}
                          </div>
                        </td>
                        <td className="py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#00c2a0] transition-all"
                                style={{ width: `${avgMastery}%` }}
                              />
                            </div>
                            <span className="text-gray-900 font-bold text-sm">{avgMastery}%</span>
                          </div>
                        </td>
                        <td className="py-5">
                          <div className="flex items-center gap-2">
                            <span className="text-[#f39c12]">✨</span>
                            <span className="text-gray-900 font-bold">{student.sparkies || 0}</span>
                          </div>
                        </td>
                        <td className="py-5">
                          <div className="flex items-center gap-2">
                            <span className="text-red-500">🔥</span>
                            <span className="text-gray-900 font-bold">{student.currentStreak || 0}</span>
                          </div>
                        </td>
                        <td className="py-5 text-right pr-4">
                          <button
                            onClick={() => setSelectedStudent(student)}
                            className="text-[#00c2a0] text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
                          >
                            View Details →
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Word Bank Tab */}
      {activeTab === 'words' && (
        <WordBankManager
          words={words}
          onWordsChange={loadData}
        />
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <AdvancedAnalytics students={students} totalWords={totalWords} />
      )}

      {/* Password Change Modal */}
      {showPasswordChange && (
        <PasswordChangeModal
          onClose={() => setShowPasswordChange(false)}
          onSuccess={() => {
            console.log('Password changed successfully');
          }}
        />
      )}

      {/* Bulk Word Upload Modal */}
      {showBulkUpload && (
        <BulkWordUpload
          onClose={() => setShowBulkUpload(false)}
          onSuccess={() => {
            setShowBulkUpload(false);
            loadData(); // Refresh word list
          }}
        />
      )}

      {/* Student Analytics Modal */}
      {selectedStudent && (
        <StudentAnalytics 
          student={selectedStudent} 
          onClose={() => setSelectedStudent(null)}
          onStudentUpdate={() => {
            setSelectedStudent(null);
            loadData(); // Refresh student list
          }}
        />
      )}
    </div>
  );
};

export default TeacherView;
