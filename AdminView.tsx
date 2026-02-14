import React, { useState, useEffect } from 'react';
import { User, UserRole } from './types';
import { 
  createTeacherAccount, 
  getAllUsers, 
  deleteUserAccount, 
  updateUserData,
  getSystemAnalytics 
} from './firebaseService';
import Upload540WordsComponent from './Upload540WordsComponent';

interface SystemAnalytics {
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  totalWords: number;
  totalGamesPlayed: number;
  totalSparkies: number;
  averageMastery: number;
  activeToday: number;
  certificatesIssued: number;
}

const AdminView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'analytics' | 'create' | 'database'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [analytics, setAnalytics] = useState<SystemAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Create Teacher Form
  const [tName, setTName] = useState('');
  const [tEmail, setTEmail] = useState('');
  const [tPassword, setTPassword] = useState('');
  const [tSubject, setTSubject] = useState('');
  
  // Edit User Modal
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Search and Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'ALL' | UserRole>('ALL');
  
  // Database Management
  const [showUpload540, setShowUpload540] = useState(false);

  useEffect(() => {
    loadUsers();
    loadAnalytics();
  }, []);

  const loadUsers = async () => {
    try {
      const allUsers = await getAllUsers();
      setUsers(allUsers.filter(u => !u.deleted));
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadAnalytics = async () => {
    try {
      const data = await getSystemAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      await createTeacherAccount(tEmail, tPassword, tName, tSubject);
      setMessage(`✅ Teacher account created! Email: ${tEmail} | Temp Password: ${tPassword}`);
      setTName('');
      setTEmail('');
      setTPassword('');
      setTSubject('');
      await loadUsers();
      await loadAnalytics();
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    setLoading(true);
    try {
      await deleteUserAccount(userToDelete.id);
      setMessage(`✅ User ${userToDelete.name} deleted successfully`);
      setShowDeleteConfirm(false);
      setUserToDelete(null);
      await loadUsers();
      await loadAnalytics();
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    
    setLoading(true);
    try {
      await updateUserData(editingUser.id, editingUser);
      setMessage(`✅ User ${editingUser.name} updated successfully`);
      setShowEditModal(false);
      setEditingUser(null);
      await loadUsers();
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'ALL' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div>
        <h2 className="text-4xl font-bold text-white mb-2">System Administration</h2>
        <p className="text-gray-500">Mastering Words • Educational Platform Control</p>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl text-sm ${message.startsWith('✅') ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
          {message}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 sm:gap-4 bg-[#162031] p-2 rounded-2xl border border-white/5">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 min-w-[120px] py-3 px-3 sm:px-6 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            activeTab === 'users'
              ? 'bg-[#00c2a0] text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          👥 Users
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex-1 min-w-[120px] py-3 px-3 sm:px-6 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            activeTab === 'analytics'
              ? 'bg-[#00c2a0] text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          📊 Analytics
        </button>
        <button
          onClick={() => setActiveTab('create')}
          className={`flex-1 min-w-[120px] py-3 px-3 sm:px-6 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            activeTab === 'create'
              ? 'bg-[#00c2a0] text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          ➕ Create
        </button>
        <button
          onClick={() => setActiveTab('database')}
          className={`flex-1 min-w-[120px] py-3 px-3 sm:px-6 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            activeTab === 'database'
              ? 'bg-[#00c2a0] text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          📚 Database
        </button>
      </div>

      {/* User Management Tab */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Search and Filter */}
          <div className="bg-[#162031] rounded-2xl p-6 border border-white/5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-4 mb-2 block">
                  Search Users
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full bg-[#0b1221] border border-white/5 rounded-xl py-3 px-6 text-white outline-none focus:border-[#00c2a0] transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-4 mb-2 block">
                  Filter by Role
                </label>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value as any)}
                  className="w-full bg-[#0b1221] border border-white/5 rounded-xl py-3 px-6 text-white outline-none focus:border-[#00c2a0] transition-all"
                >
                  <option value="ALL">All Roles</option>
                  <option value="ADMIN">Admins</option>
                  <option value="TEACHER">Teachers</option>
                  <option value="STUDENT">Students</option>
                </select>
              </div>
            </div>
          </div>

          {/* User Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-2xl p-6 border border-purple-500/20">
              <div className="text-purple-400 text-sm font-bold mb-2">Total Users</div>
              <div className="text-white text-3xl font-bold">{users.length}</div>
            </div>
            <div className="bg-gradient-to-br from-teal-500/10 to-teal-500/5 rounded-2xl p-6 border border-teal-500/20">
              <div className="text-teal-400 text-sm font-bold mb-2">Teachers</div>
              <div className="text-white text-3xl font-bold">
                {users.filter(u => u.role === UserRole.TEACHER).length}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-2xl p-6 border border-blue-500/20">
              <div className="text-blue-400 text-sm font-bold mb-2">Students</div>
              <div className="text-white text-3xl font-bold">
                {users.filter(u => u.role === UserRole.STUDENT).length}
              </div>
            </div>
          </div>

          {/* User List */}
          <div className="bg-[#162031] rounded-2xl p-6 border border-white/5">
            <h3 className="text-xl font-bold text-white mb-4">
              Active User Directory ({filteredUsers.length})
            </h3>
            <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
              {filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-[#0b1221] rounded-xl border border-white/5 hover:border-[#00c2a0]/30 transition-all">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-white font-bold">{user.name}</span>
                      <span className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-widest ${
                        user.role === 'ADMIN' ? 'bg-purple-500 text-white' : 
                        user.role === 'TEACHER' ? 'bg-teal-500 text-white' : 
                        'bg-blue-500 text-white'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                    {user.role === UserRole.STUDENT && (
                      <div className="text-xs text-gray-600 mt-1">
                        Grade {user.gradeLevel} • Section {user.section} • {user.sparkies || 0} sparkies
                      </div>
                    )}
                    {user.role === UserRole.TEACHER && user.subject && (
                      <div className="text-xs text-gray-600 mt-1">Subject: {user.subject}</div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingUser(user);
                        setShowEditModal(true);
                      }}
                      className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-sm font-bold transition-all"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => {
                        setUserToDelete(user);
                        setShowDeleteConfirm(true);
                      }}
                      className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-bold transition-all"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
              {filteredUsers.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No users found matching your search criteria
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && analytics && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-2xl p-6 border border-blue-500/20">
              <div className="flex items-center justify-between mb-3">
                <div className="text-blue-400 text-sm font-bold">Total Users</div>
                <div className="text-3xl">👥</div>
              </div>
              <div className="text-white text-4xl font-bold">{analytics.totalUsers}</div>
              <div className="text-xs text-gray-500 mt-2">
                {analytics.totalStudents} students, {analytics.totalTeachers} teachers
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-2xl p-6 border border-green-500/20">
              <div className="flex items-center justify-between mb-3">
                <div className="text-green-400 text-sm font-bold">Games Played</div>
                <div className="text-3xl">🎮</div>
              </div>
              <div className="text-white text-4xl font-bold">{analytics.totalGamesPlayed}</div>
              <div className="text-xs text-gray-500 mt-2">
                Avg: {analytics.totalStudents > 0 ? Math.round(analytics.totalGamesPlayed / analytics.totalStudents) : 0} per student
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 rounded-2xl p-6 border border-yellow-500/20">
              <div className="flex items-center justify-between mb-3">
                <div className="text-yellow-400 text-sm font-bold">Total Sparkies</div>
                <div className="text-3xl">✨</div>
              </div>
              <div className="text-white text-4xl font-bold">{analytics.totalSparkies}</div>
              <div className="text-xs text-gray-500 mt-2">
                Avg: {analytics.totalStudents > 0 ? Math.round(analytics.totalSparkies / analytics.totalStudents) : 0} per student
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-2xl p-6 border border-purple-500/20">
              <div className="flex items-center justify-between mb-3">
                <div className="text-purple-400 text-sm font-bold">Certificates</div>
                <div className="text-3xl">🏆</div>
              </div>
              <div className="text-white text-4xl font-bold">{analytics.certificatesIssued}</div>
              <div className="text-xs text-gray-500 mt-2">
                {analytics.totalStudents > 0 ? Math.round((analytics.certificatesIssued / analytics.totalStudents) * 100) : 0}% of students
              </div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#162031] rounded-2xl p-6 border border-white/5">
              <h3 className="text-xl font-bold text-white mb-4">📈 Performance Metrics</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400 text-sm">Average Mastery</span>
                    <span className="text-white font-bold">{analytics.averageMastery}%</span>
                  </div>
                  <div className="w-full h-3 bg-[#0b1221] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-1000"
                      style={{ width: `${analytics.averageMastery}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400 text-sm">Active Today</span>
                    <span className="text-white font-bold">{analytics.activeToday} students</span>
                  </div>
                  <div className="w-full h-3 bg-[#0b1221] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-1000"
                      style={{ width: `${analytics.totalStudents > 0 ? (analytics.activeToday / analytics.totalStudents) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400 text-sm">Word Bank Size</span>
                    <span className="text-white font-bold">{analytics.totalWords} words</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Avg: {analytics.totalStudents > 0 ? Math.round(analytics.totalWords / analytics.totalStudents) : 0} words per student
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#162031] rounded-2xl p-6 border border-white/5">
              <h3 className="text-xl font-bold text-white mb-4">👥 User Distribution</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400 text-sm">Students</span>
                      <span className="text-white font-bold">{analytics.totalStudents}</span>
                    </div>
                    <div className="w-full h-3 bg-[#0b1221] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                        style={{ width: `${analytics.totalUsers > 0 ? (analytics.totalStudents / analytics.totalUsers) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-2xl">🎓</div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400 text-sm">Teachers</span>
                      <span className="text-white font-bold">{analytics.totalTeachers}</span>
                    </div>
                    <div className="w-full h-3 bg-[#0b1221] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-teal-500 to-teal-600"
                        style={{ width: `${analytics.totalUsers > 0 ? (analytics.totalTeachers / analytics.totalUsers) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-2xl">👨‍🏫</div>
                </div>

                <div className="mt-6 p-4 bg-[#0b1221] rounded-xl">
                  <div className="text-sm text-gray-400 mb-2">Student-Teacher Ratio</div>
                  <div className="text-3xl font-bold text-white">
                    {analytics.totalTeachers > 0 ? Math.round(analytics.totalStudents / analytics.totalTeachers) : 0}:1
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Teacher Tab */}
      {activeTab === 'create' && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#162031] rounded-[2.5rem] p-8 border border-white/5 shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-teal-500/20 rounded-2xl flex items-center justify-center text-2xl">👩‍🏫</div>
              <div>
                <h3 className="text-2xl font-bold text-white">Create Teacher Account</h3>
                <p className="text-gray-500 text-sm">Add a new teacher to the system</p>
              </div>
            </div>
            
            <form onSubmit={handleCreateTeacher} className="space-y-4">
              <div>
                <label htmlFor="teacherName" className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-4 mb-2 block">
                  Full Name
                </label>
                <input 
                  id="teacherName"
                  name="teacherName"
                  type="text" 
                  value={tName}
                  onChange={e => setTName(e.target.value)}
                  className="w-full bg-[#0b1221] border border-white/5 rounded-2xl py-3 px-6 text-white outline-none focus:border-teal-500 transition-all"
                  placeholder="Dr. Elena Rossi"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="teacherEmail" className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-4 mb-2 block">
                  Email Address
                </label>
                <input 
                  id="teacherEmail"
                  name="teacherEmail"
                  type="email" 
                  value={tEmail}
                  onChange={e => setTEmail(e.target.value)}
                  className="w-full bg-[#0b1221] border border-white/5 rounded-2xl py-3 px-6 text-white outline-none focus:border-teal-500 transition-all"
                  placeholder="elena.rossi@school.edu"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="teacherPassword" className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-4 mb-2 block">
                  Temporary Password
                </label>
                <input 
                  id="teacherPassword"
                  name="teacherPassword"
                  type="password" 
                  value={tPassword}
                  onChange={e => setTPassword(e.target.value)}
                  className="w-full bg-[#0b1221] border border-white/5 rounded-2xl py-3 px-6 text-white outline-none focus:border-teal-500 transition-all"
                  placeholder="••••••••"
                  required
                />
                <p className="text-xs text-gray-500 mt-2 ml-4">
                  Teacher will be prompted to change this password on first login
                </p>
              </div>
              
              <div>
                <label htmlFor="teacherSubject" className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-4 mb-2 block">
                  Subject (Optional)
                </label>
                <input 
                  id="teacherSubject"
                  name="teacherSubject"
                  type="text" 
                  value={tSubject}
                  onChange={e => setTSubject(e.target.value)}
                  className="w-full bg-[#0b1221] border border-white/5 rounded-2xl py-3 px-6 text-white outline-none focus:border-teal-500 transition-all"
                  placeholder="English Literacy"
                />
              </div>
              
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-[#00c2a0] text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-[#00d8b3] active:scale-95 transition-all mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : '✅ Create Teacher Account'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Database Management Tab */}
      {activeTab === 'database' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-3xl p-8 border border-purple-500/20">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center text-3xl">
                📚
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white">Database Management</h3>
                <p className="text-gray-400">Manage word database for offline gameplay</p>
              </div>
            </div>
          </div>

          {/* Database Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#162031] rounded-2xl p-6 border border-white/5">
              <div className="text-purple-400 text-sm font-bold mb-2">Total Words</div>
              <div className="text-white text-3xl font-bold">540</div>
              <div className="text-gray-500 text-xs mt-1">Across all grades</div>
            </div>
            <div className="bg-[#162031] rounded-2xl p-6 border border-white/5">
              <div className="text-blue-400 text-sm font-bold mb-2">Grade Levels</div>
              <div className="text-white text-3xl font-bold">6</div>
              <div className="text-gray-500 text-xs mt-1">Grades 1-6</div>
            </div>
            <div className="bg-[#162031] rounded-2xl p-6 border border-white/5">
              <div className="text-green-400 text-sm font-bold mb-2">Difficulty Levels</div>
              <div className="text-white text-3xl font-bold">3</div>
              <div className="text-gray-500 text-xs mt-1">Easy, Medium, Hard</div>
            </div>
          </div>

          {/* Upload 540 Words Section */}
          <div className="bg-[#162031] rounded-3xl p-8 border border-white/5">
            <div className="flex items-start gap-6">
              <div className="flex-1">
                <h4 className="text-2xl font-bold text-white mb-3">📤 Upload Complete Database</h4>
                <p className="text-gray-400 mb-4">
                  Upload the complete 540-word database for offline use. This includes:
                </p>
                <ul className="space-y-2 text-gray-300 text-sm mb-6">
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    90 words per grade level (1-6)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    30 words per difficulty (Easy, Medium, Hard)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    Bilingual hints (English & Filipino)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    Random word selection with reset
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    Educational progression by grade
                  </li>
                </ul>
                <button
                  onClick={() => setShowUpload540(true)}
                  className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 px-8 rounded-xl transition-all active:scale-95 flex items-center gap-3"
                >
                  <span className="text-2xl">📚</span>
                  Upload 540 Words Database
                </button>
              </div>
              <div className="hidden lg:block">
                <div className="bg-[#0b1221] rounded-2xl p-6 border border-white/5">
                  <div className="text-xs font-bold text-gray-500 uppercase mb-3">Database Structure</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Grade 1:</span>
                      <span className="text-white font-bold">90 words</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Grade 2:</span>
                      <span className="text-white font-bold">90 words</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Grade 3:</span>
                      <span className="text-white font-bold">90 words</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Grade 4:</span>
                      <span className="text-white font-bold">90 words</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Grade 5:</span>
                      <span className="text-white font-bold">90 words</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Grade 6:</span>
                      <span className="text-white font-bold">90 words</span>
                    </div>
                    <div className="border-t border-white/10 pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400 font-bold">Total:</span>
                        <span className="text-purple-400 font-bold">540 words</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Database Tools */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#162031] rounded-2xl p-6 border border-white/5">
              <h5 className="text-white font-bold mb-3 flex items-center gap-2">
                <span className="text-xl">📝</span>
                Manual Word Entry
              </h5>
              <p className="text-gray-400 text-sm mb-4">
                Add individual words or small batches through the teacher dashboard
              </p>
              <button
                onClick={() => setActiveTab('create')}
                className="text-[#00c2a0] hover:text-[#00d8b3] text-sm font-bold transition-colors"
              >
                Go to Teacher Tools →
              </button>
            </div>
            <div className="bg-[#162031] rounded-2xl p-6 border border-white/5">
              <h5 className="text-white font-bold mb-3 flex items-center gap-2">
                <span className="text-xl">📊</span>
                Database Analytics
              </h5>
              <p className="text-gray-400 text-sm mb-4">
                View word usage statistics and student performance data
              </p>
              <button
                onClick={() => setActiveTab('analytics')}
                className="text-[#00c2a0] hover:text-[#00d8b3] text-sm font-bold transition-colors"
              >
                View Analytics →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload 540 Words Modal */}
      {showUpload540 && (
        <Upload540WordsComponent onClose={() => setShowUpload540(false)} />
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-[#162031] rounded-3xl p-8 max-w-md w-full border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-6">Edit User</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-4 mb-2 block">Name</label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                  className="w-full bg-[#0b1221] border border-white/5 rounded-xl py-3 px-6 text-white outline-none focus:border-[#00c2a0]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-4 mb-2 block">Email</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  className="w-full bg-[#0b1221] border border-white/5 rounded-xl py-3 px-6 text-white outline-none focus:border-[#00c2a0]"
                />
              </div>
              {editingUser.role === UserRole.STUDENT && (
                <>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-4 mb-2 block">Grade Level</label>
                    <input
                      type="text"
                      value={editingUser.gradeLevel || ''}
                      onChange={(e) => setEditingUser({...editingUser, gradeLevel: e.target.value})}
                      className="w-full bg-[#0b1221] border border-white/5 rounded-xl py-3 px-6 text-white outline-none focus:border-[#00c2a0]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-4 mb-2 block">Section</label>
                    <input
                      type="text"
                      value={editingUser.section || ''}
                      onChange={(e) => setEditingUser({...editingUser, section: e.target.value})}
                      className="w-full bg-[#0b1221] border border-white/5 rounded-xl py-3 px-6 text-white outline-none focus:border-[#00c2a0]"
                    />
                  </div>
                </>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingUser(null);
                }}
                className="flex-1 bg-[#0b1221] hover:bg-[#162031] text-white font-bold py-3 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateUser}
                disabled={loading}
                className="flex-1 bg-[#00c2a0] hover:bg-[#00d8b3] text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && userToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-[#162031] rounded-3xl p-8 max-w-md w-full border border-red-500/20">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚠️</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Delete User?</h3>
              <p className="text-gray-400">
                Are you sure you want to delete <span className="text-white font-bold">{userToDelete.name}</span>?
                This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setUserToDelete(null);
                }}
                className="flex-1 bg-[#0b1221] hover:bg-[#162031] text-white font-bold py-3 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={loading}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
              >
                {loading ? 'Deleting...' : 'Delete User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminView;