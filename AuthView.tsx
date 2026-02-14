
import React, { useState, useEffect } from 'react';
import { UserRole, User } from './types';
import { signUpUser, signInUser, getAllTeachers } from './firebaseService';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './firebase';

const AuthView: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [identifier, setIdentifier] = useState(''); // Email for Firebase
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [section, setSection] = useState('');
  const [teacherId, setTeacherId] = useState(''); // Store teacher ID
  const [teacherName, setTeacherName] = useState(''); // Store teacher name
  const [teachers, setTeachers] = useState<User[]>([]); // List of teachers
  const [loadingTeachers, setLoadingTeachers] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Load teachers when registration form is shown for students
  useEffect(() => {
    if (isRegistering) {
      // Only load teachers if needed - don't fail if it doesn't work
      loadTeachers().catch(err => {
        console.log('Teachers list not available:', err);
        // Silently fail - teacher selection is optional
      });
    }
  }, [isRegistering]);

  const loadTeachers = async () => {
    setLoadingTeachers(true);
    try {
      const teachersList = await getAllTeachers();
      setTeachers(teachersList);
    } catch (error) {
      console.error('Error loading teachers:', error);
      // Don't show error to user - teacher selection is optional
      // Just leave teachers list empty
      setTeachers([]);
    } finally {
      setLoadingTeachers(false);
    }
  };

  const handleTeacherChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTeacherId = e.target.value;
    setTeacherId(selectedTeacherId);
    
    // Find the teacher and set their name
    const selectedTeacher = teachers.find(t => t.id === selectedTeacherId);
    if (selectedTeacher) {
      setTeacherName(selectedTeacher.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      if (isRegistering) {
        // Validate teacher selection
        if (!teacherId) {
          setError('Please select a teacher');
          setLoading(false);
          return;
        }
        
        console.log('📝 Starting registration process...');
        
        // Registration for Students only
        const newUser = await signUpUser(identifier, password, name, UserRole.STUDENT, { 
          gradeLevel, 
          section, 
          teacherName,
          teacherId 
        });
        
        console.log('✅ Registration successful!', newUser);
        setSuccessMessage('Registration successful! Logging you in...');
        
        // Wait a moment to show success message
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Auth state change will be handled by onAuthStateChanged in App.tsx
      } else {
        // Login for any role
        console.log('🔐 Starting login process...');
        await signInUser(identifier, password);
        console.log('✅ Login successful!');
        // Auth state change will be handled by onAuthStateChanged in App.tsx
      }
    } catch (err: any) {
      console.error("❌ Auth error:", err);
      
      // Provide more specific error messages
      let errorMessage = 'Authentication failed. Please try again.';
      
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please sign in instead.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (err.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email.';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      await sendPasswordResetEmail(auth, identifier);
      setSuccessMessage('Password reset email sent! Check your inbox.');
      setTimeout(() => {
        setShowForgotPassword(false);
        setSuccessMessage('');
      }, 3000);
    } catch (err: any) {
      console.error("Password reset error:", err);
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 animate-in fade-in duration-700">
      <div className="w-full max-w-md bg-[#162031] rounded-[3rem] p-10 shadow-2xl border border-white/5">
        <div className="text-center mb-10">
          {/* Enhanced Animated Logo */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            {/* Glowing background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#00c2a0] to-[#00d8b3] rounded-3xl blur-xl opacity-50 animate-pulse" />
            
            {/* Main logo container */}
            <div className="relative w-24 h-24 bg-gradient-to-br from-[#00c2a0] to-[#00d8b3] rounded-3xl flex items-center justify-center text-5xl font-black text-white shadow-2xl shadow-teal-500/30 transform hover:scale-110 transition-transform duration-300">
              W
              {/* Sparkle effects */}
              <div className="absolute -top-1 -right-1 text-yellow-400 text-lg animate-ping">✨</div>
              <div className="absolute -bottom-1 -left-1 text-yellow-400 text-sm animate-ping" style={{ animationDelay: '0.5s' }}>⭐</div>
            </div>
            
            {/* Rotating ring */}
            <div className="absolute inset-0 border-2 border-[#00c2a0] border-t-transparent rounded-full animate-spin-slow opacity-30" />
          </div>
          
          {/* App name with gradient */}
          <h2 className="text-4xl font-black mb-2 bg-gradient-to-r from-[#00c2a0] via-[#00d8b3] to-[#00c2a0] bg-clip-text text-transparent">
            Word Hero
          </h2>
          <p className="text-gray-500">
            {showForgotPassword ? 'Reset Your Password' : (isRegistering ? 'New Student Registration' : 'Welcome back, explorer!')}
          </p>
        </div>

        {showForgotPassword ? (
          // Forgot Password Form
          <form onSubmit={handlePasswordReset} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-red-400 text-sm">
                {error}
              </div>
            )}
            {successMessage && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 text-green-400 text-sm">
                {successMessage}
              </div>
            )}
            
            <div>
              <label htmlFor="resetEmail" className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-4 mb-2 block">Email Address</label>
              <input 
                id="resetEmail"
                name="resetEmail"
                type="email" 
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                className="w-full bg-[#0b1221] border-2 border-transparent focus:border-[#00c2a0] rounded-2xl py-4 px-6 text-white outline-none transition-all placeholder:text-gray-700"
                placeholder="Enter your email"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#00c2a0] hover:bg-[#00d8b3] transition-all rounded-2xl py-5 text-white font-bold text-xl shadow-lg shadow-teal-500/10 active:scale-95 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Reset Email'}
            </button>

            <button 
              type="button"
              onClick={() => {
                setShowForgotPassword(false);
                setError('');
                setSuccessMessage('');
              }}
              className="w-full text-center mt-4 text-sm text-gray-500 hover:text-[#00c2a0] transition-colors"
            >
              ← Back to Sign In
            </button>
          </form>
        ) : (
          // Regular Login/Register Form
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-red-400 text-sm">
                {error}
              </div>
            )}
          
          {isRegistering && (
            <div>
              <label htmlFor="fullName" className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-4 mb-2 block">Full Name</label>
              <input 
                id="fullName"
                name="fullName"
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-[#0b1221] border-2 border-transparent focus:border-[#00c2a0] rounded-2xl py-4 px-6 text-white outline-none transition-all placeholder:text-gray-700"
                placeholder="Ex: Juan Dela Cruz"
                required={isRegistering}
              />
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-4 mb-2 block">
              {isRegistering ? 'Email Address' : 'Email'}
            </label>
            <input 
              id="email"
              name="email"
              type="email" 
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              className="w-full bg-[#0b1221] border-2 border-transparent focus:border-[#00c2a0] rounded-2xl py-4 px-6 text-white outline-none transition-all placeholder:text-gray-700"
              placeholder={isRegistering ? "student@school.edu" : "Enter email"}
              required
            />
          </div>

          {isRegistering && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="gradeLevel" className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-4 mb-2 block">Grade Level</label>
                <select 
                  id="gradeLevel"
                  name="gradeLevel"
                  value={gradeLevel}
                  onChange={e => setGradeLevel(e.target.value)}
                  className="w-full bg-[#0b1221] border-2 border-transparent focus:border-[#00c2a0] rounded-2xl py-4 px-6 text-white outline-none transition-all appearance-none"
                  required={isRegistering}
                >
                  <option value="">Select Grade</option>
                  {[1,2,3,4,5,6].map(g => <option key={g} value={g.toString()}>Grade {g}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="section" className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-4 mb-2 block">Section</label>
                <select 
                  id="section"
                  name="section"
                  value={section}
                  onChange={e => setSection(e.target.value)}
                  className="w-full bg-[#0b1221] border-2 border-transparent focus:border-[#00c2a0] rounded-2xl py-4 px-6 text-white outline-none transition-all appearance-none"
                >
                  <option value="">Select Section</option>
                  {['A', 'B', 'C', 'D', 'E', 'F'].map(s => <option key={s} value={s}>Section {s}</option>)}
                </select>
              </div>
            </div>
          )}

          {isRegistering && (
            <div>
              <label htmlFor="teacherSelect" className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-4 mb-2 block">
                Select Your Teacher
              </label>
              {loadingTeachers ? (
                <div className="w-full bg-[#0b1221] border-2 border-transparent rounded-2xl py-4 px-6 text-gray-500 text-center">
                  Loading teachers...
                </div>
              ) : teachers.length === 0 ? (
                <div className="w-full bg-[#0b1221] border-2 border-red-500/20 rounded-2xl py-4 px-6 text-red-400 text-sm">
                  No teachers available. Please contact admin.
                </div>
              ) : (
                <select 
                  id="teacherSelect"
                  name="teacherSelect"
                  value={teacherId}
                  onChange={handleTeacherChange}
                  className="w-full bg-[#0b1221] border-2 border-transparent focus:border-[#00c2a0] rounded-2xl py-4 px-6 text-white outline-none transition-all appearance-none"
                  required={isRegistering}
                >
                  <option value="">Choose your teacher</option>
                  {teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name} {teacher.subject ? `- ${teacher.subject}` : ''}
                    </option>
                  ))}
                </select>
              )}
              <p className="text-xs text-gray-500 mt-2 ml-4">
                Select the teacher for your class or subject
              </p>
            </div>
          )}

          <div>
            <label htmlFor="password" className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-4 mb-2 block">Password</label>
            <input 
              id="password"
              name="password"
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-[#0b1221] border-2 border-transparent focus:border-[#00c2a0] rounded-2xl py-4 px-6 text-white outline-none transition-all placeholder:text-gray-700"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#f39c12] hover:bg-[#e67e22] transition-all rounded-2xl py-5 text-white font-bold text-xl shadow-lg shadow-orange-500/10 active:scale-95 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Please wait...' : (isRegistering ? 'Join the Class' : 'Sign In')}
          </button>
        </form>
        )}

        {!showForgotPassword && (
          <>
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="w-full text-center mt-8 text-sm text-gray-500 hover:text-[#00c2a0] transition-colors"
            >
              {isRegistering ? 'Already a student? Log in here' : 'Not registered? Create a student account'}
            </button>

            {!isRegistering && (
              <>
                <button 
                  onClick={() => setShowForgotPassword(true)}
                  className="w-full text-center mt-4 text-sm text-gray-500 hover:text-[#00c2a0] transition-colors"
                >
                  Forgot password?
                </button>
                <p className="text-[10px] text-gray-600 text-center mt-6 uppercase tracking-widest font-bold">
                  Teachers & Admins must use assigned credentials
                </p>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AuthView;

// Add custom animations for the logo
const style = document.createElement('style');
style.textContent = `
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  .animate-spin-slow {
    animation: spin-slow 3s linear infinite;
  }
`;
if (typeof document !== 'undefined') {
  document.head.appendChild(style);
}
