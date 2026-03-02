import React from 'react';
import { User, Difficulty } from './types';

interface StudentAnalyticsProps {
  student: User;
  onClose: () => void;
  onStudentUpdate?: () => void; // Callback to refresh student list
}

const StudentAnalytics: React.FC<StudentAnalyticsProps> = ({ student, onClose, onStudentUpdate }) => {
  const [showTeacherNameModal, setShowTeacherNameModal] = React.useState(false);
  const [teacherName, setTeacherName] = React.useState(student.teacherName || '');
  const [saving, setSaving] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');

  // Calculate overall mastery
  const overallMastery = student.levelProgress
    ? Math.round(
        (Object.values(student.levelProgress) as any[]).reduce((sum, lp) => sum + lp.mastery, 0) / 3
      )
    : 0;

  // Get progress history for last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(Date.now() - i * 86400000);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }).reverse();

  const progressData = student.progressHistory || [];
  const weekData = last7Days.map((day, i) => {
    const entry = progressData[i];
    return {
      day,
      sparkies: entry?.sparkiesEarned || 0,
      words: entry?.wordsLearned || 0
    };
  });

  const maxSparkies = Math.max(...weekData.map(d => d.sparkies), 1);

  const handleUpdateTeacherName = async () => {
    if (!teacherName.trim()) {
      setErrorMessage('Please enter a teacher name');
      return;
    }

    setSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const { updateStudentTeacherName, updateExistingCertificatesWithTeacherName } = await import('./firebaseService');
      
      // Update teacher name
      await updateStudentTeacherName(student.id, teacherName.trim());
      
      // Also update existing certificates with the teacher name
      await updateExistingCertificatesWithTeacherName(student.id, teacherName.trim());
      
      setSuccessMessage('Teacher name updated successfully! Existing certificates have been updated too.');
      setTimeout(() => {
        setShowTeacherNameModal(false);
        setSuccessMessage('');
        onStudentUpdate?.(); // Refresh student list
      }, 2000); // Longer delay to show the message
    } catch (error: any) {
      console.error('Error updating teacher name:', error);
      setErrorMessage(error.message || 'Failed to update teacher name');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto bg-[#162031] rounded-3xl p-8 shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">{student.name}</h2>
            <p className="text-gray-500">@{student.username}</p>
            {student.section && (
              <p className="text-gray-500 text-sm">
                Grade {student.gradeLevel} • Section {student.section}
              </p>
            )}
            {student.teacherName && (
              <p className="text-[#00c2a0] text-sm font-bold">
                👨‍🏫 Teacher: {student.teacherName}
              </p>
            )}
            {!student.teacherName && (
              <button
                onClick={() => setShowTeacherNameModal(true)}
                className="text-orange-500 text-sm font-bold hover:text-orange-400 transition-colors mt-1"
              >
                ⚠️ Add Teacher Name
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-white bg-[#0b1221] w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-all"
          >
            ✕
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#0b1221] rounded-2xl p-4 border border-[#f39c12]/20">
            <div className="text-3xl mb-2">✨</div>
            <p className="text-2xl font-bold text-white">{student.sparkies || 0}</p>
            <p className="text-xs text-gray-500 uppercase font-bold">Sparkies</p>
          </div>
          <div className="bg-[#0b1221] rounded-2xl p-4 border border-[#00c2a0]/20">
            <div className="text-3xl mb-2">📚</div>
            <p className="text-2xl font-bold text-white">{student.wordsLearned || 0}</p>
            <p className="text-xs text-gray-500 uppercase font-bold">Words Learned</p>
          </div>
          <div className="bg-[#0b1221] rounded-2xl p-4 border border-red-500/20">
            <div className="text-3xl mb-2">🔥</div>
            <p className="text-2xl font-bold text-white">{student.currentStreak || 0}</p>
            <p className="text-xs text-gray-500 uppercase font-bold">Current Streak</p>
          </div>
          <div className="bg-[#0b1221] rounded-2xl p-4 border border-blue-500/20">
            <div className="text-3xl mb-2">🎮</div>
            <p className="text-2xl font-bold text-white">{student.totalGames || 0}</p>
            <p className="text-xs text-gray-500 uppercase font-bold">Games Played</p>
          </div>
        </div>

        {/* Mastery Progress */}
        <div className="bg-[#0b1221] rounded-2xl p-6 mb-6 border border-white/5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Mastery Progress</h3>
            <div className="text-right">
              <p className="text-3xl font-bold text-[#00c2a0]">{overallMastery}%</p>
              <p className="text-xs text-gray-500 uppercase font-bold">Overall</p>
            </div>
          </div>

          {student.levelProgress && (
            <div className="space-y-4">
              {(Object.values(student.levelProgress) as any[]).map((progress) => {
                const colors = {
                  [Difficulty.EASY]: { bg: 'bg-[#22c55e]', text: 'text-[#22c55e]' },
                  [Difficulty.MEDIUM]: { bg: 'bg-[#3b82f6]', text: 'text-[#3b82f6]' },
                  [Difficulty.HARD]: { bg: 'bg-orange-500', text: 'text-orange-500' }
                };
                const color = colors[progress.difficulty as Difficulty];

                return (
                  <div key={progress.difficulty}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-bold capitalize">
                        {progress.difficulty.toLowerCase()}
                      </span>
                      <span className={`font-bold ${color.text}`}>
                        {progress.mastery}%
                      </span>
                    </div>
                    <div className="h-3 bg-[#162031] rounded-full overflow-hidden">
                      <div
                        className={`h-full ${color.bg} transition-all duration-500`}
                        style={{ width: `${progress.mastery}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {progress.gamesPlayed} games played
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Weekly Activity */}
        <div className="bg-[#0b1221] rounded-2xl p-6 mb-6 border border-white/5">
          <h3 className="text-xl font-bold text-white mb-6">Weekly Activity</h3>
          <div className="flex items-end justify-between gap-2 h-48">
            {weekData.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="flex-1 w-full flex items-end justify-center">
                  <div
                    className="w-full bg-gradient-to-t from-[#f39c12] to-[#f39c12]/50 rounded-t-lg transition-all duration-500 hover:opacity-80 relative group"
                    style={{
                      height: `${(day.sparkies / maxSparkies) * 100}%`,
                      minHeight: day.sparkies > 0 ? '8px' : '0'
                    }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#162031] px-2 py-1 rounded text-xs font-bold text-[#f39c12] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {day.sparkies} ✨
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 font-bold">{day.day}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Badges & Achievements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#0b1221] rounded-2xl p-6 border border-white/5">
            <h3 className="text-xl font-bold text-white mb-4">
              Badges ({student.badges?.length || 0})
            </h3>
            <div className="flex flex-wrap gap-2">
              {student.badges && student.badges.length > 0 ? (
                student.badges.slice(0, 6).map((badgeId) => (
                  <div
                    key={badgeId}
                    className="w-12 h-12 bg-[#162031] rounded-xl flex items-center justify-center text-2xl border border-[#f39c12]/20"
                  >
                    🏆
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No badges earned yet</p>
              )}
            </div>
          </div>

          <div className="bg-[#0b1221] rounded-2xl p-6 border border-white/5">
            <h3 className="text-xl font-bold text-white mb-4">
              Certificates ({student.certificates?.length || 0})
            </h3>
            <div className="space-y-2">
              {student.certificates && student.certificates.length > 0 ? (
                student.certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="flex items-center gap-3 p-2 bg-[#162031] rounded-lg"
                  >
                    <span className="text-2xl">📜</span>
                    <div className="flex-1">
                      <p className="text-white font-bold text-sm">{cert.title}</p>
                      <p className="text-gray-500 text-xs">{cert.earnedDate}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No certificates earned yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-8">
          <button 
            onClick={() => setShowTeacherNameModal(true)}
            className="flex-1 bg-[#f39c12] hover:bg-[#e67e22] text-white font-bold py-3 rounded-xl transition-all active:scale-95"
          >
            👨‍🏫 {student.teacherName ? 'Update' : 'Add'} Teacher Name
          </button>
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all active:scale-95">
            📊 Generate Report
          </button>
        </div>
      </div>

      {/* Teacher Name Modal */}
      {showTeacherNameModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[110] flex items-center justify-center p-6">
          <div className="bg-[#162031] rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/10 animate-in zoom-in duration-300">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#f39c12]/20 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4">
                👨‍🏫
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {student.teacherName ? 'Update' : 'Add'} Teacher Name
              </h3>
              <p className="text-gray-400 text-sm">
                This will appear on {student.name}'s certificates
              </p>
            </div>

            {errorMessage && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-4 animate-in slide-in-from-top duration-300">
                <p className="text-red-400 text-sm text-center">{errorMessage}</p>
              </div>
            )}

            {successMessage && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 mb-4 animate-in slide-in-from-top duration-300">
                <p className="text-green-400 text-sm text-center font-bold">{successMessage}</p>
              </div>
            )}

            <div className="mb-6">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-4 mb-2 block">
                Teacher's Full Name
              </label>
              <input
                type="text"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                placeholder="Ex: Mrs. Santos"
                className="w-full bg-[#0b1221] border-2 border-transparent focus:border-[#00c2a0] rounded-2xl py-4 px-6 text-white outline-none transition-all placeholder:text-gray-700"
                disabled={saving}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowTeacherNameModal(false);
                  setErrorMessage('');
                  setSuccessMessage('');
                  setTeacherName(student.teacherName || '');
                }}
                disabled={saving}
                className="flex-1 bg-[#0b1221] hover:bg-[#162031] text-gray-400 font-bold py-3 rounded-xl transition-all active:scale-95 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateTeacherName}
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-[#00c2a0] to-[#00d8b3] hover:from-[#00d8b3] hover:to-[#00e6c1] text-white font-bold py-3 rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#00c2a0]/20"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAnalytics;
