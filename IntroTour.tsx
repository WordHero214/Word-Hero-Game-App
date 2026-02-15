import React, { useEffect } from 'react';
import introJs from 'intro.js';
import 'intro.js/introjs.css';
import { UserRole } from './types';

interface IntroTourProps {
  userRole: UserRole;
  onComplete: () => void;
}

const IntroTour: React.FC<IntroTourProps> = ({ userRole, onComplete }) => {
  useEffect(() => {
    // Initialize intro.js
    const intro = introJs();
    
    // Configure intro.js options
    intro.setOptions({
      exitOnOverlayClick: false,
      exitOnEsc: false,
      showStepNumbers: true,
      showBullets: true,
      showProgress: true,
      scrollToElement: true,
      overlayOpacity: 0.8,
      doneLabel: 'Start Playing! 🎮',
      nextLabel: 'Next →',
      prevLabel: '← Back',
      skipLabel: 'Skip Tour',
      tooltipClass: 'customIntroTooltip',
      highlightClass: 'customIntroHighlight',
    });

    // Define tour steps based on user role
    if (userRole === UserRole.STUDENT) {
      intro.setOptions({
        steps: [
          {
            title: '👋 Welcome to Word Hero!',
            intro: `
              <div style="text-align: center; padding: 20px;">
                <div style="font-size: 48px; margin-bottom: 16px;">🎮</div>
                <h2 style="color: #00c2a0; margin-bottom: 12px;">Let's Get Started!</h2>
                <p style="font-size: 16px; line-height: 1.6;">
                  I'll show you how to play and become a spelling champion! 
                  This quick tour will teach you everything you need to know.
                </p>
              </div>
            `
          },
          {
            element: '[data-intro="home-tab"]',
            title: '🏠 Home Tab',
            intro: `
              <p style="font-size: 15px; line-height: 1.6;">
                This is your <strong>Home</strong> screen! Here you can see:
              </p>
              <ul style="text-align: left; margin-top: 12px; line-height: 1.8;">
                <li>✨ Your sparkies (points)</li>
                <li>🔥 Your daily streak</li>
                <li>📊 Your progress and stats</li>
                <li>🏆 Your rank among classmates</li>
              </ul>
            `,
            position: 'top'
          },
          {
            element: '[data-intro="play-tab"]',
            title: '🎮 Play Tab',
            intro: `
              <p style="font-size: 15px; line-height: 1.6;">
                Click here to <strong>start playing</strong>! You'll find:
              </p>
              <ul style="text-align: left; margin-top: 12px; line-height: 1.8;">
                <li>🟢 <strong>Easy Mode</strong> - Perfect for beginners</li>
                <li>🟡 <strong>Medium Mode</strong> - Unlock at 85% Easy</li>
                <li>🔴 <strong>Hard Mode</strong> - Unlock at 85% Medium</li>
                <li>⚡ <strong>Quick Play</strong> - 5 random words</li>
              </ul>
              <p style="margin-top: 12px; color: #00c2a0; font-weight: bold;">
                💡 Tip: Start with Easy mode to learn the basics!
              </p>
            `,
            position: 'top'
          },
          {
            element: '[data-intro="rank-tab"]',
            title: '🏆 Leaderboard',
            intro: `
              <p style="font-size: 15px; line-height: 1.6;">
                Check your <strong>ranking</strong> here! You can see:
              </p>
              <ul style="text-align: left; margin-top: 12px; line-height: 1.8;">
                <li>👥 <strong>My Class</strong> - Compete with classmates</li>
                <li>📚 <strong>My Grade</strong> - All sections in your grade</li>
                <li>🌍 <strong>All Students</strong> - School-wide rankings</li>
              </ul>
              <p style="margin-top: 12px; color: #f39c12; font-weight: bold;">
                🎯 Goal: Reach the top of your class leaderboard!
              </p>
            `,
            position: 'top'
          },
          {
            element: '[data-intro="stats-tab"]',
            title: '📊 Stats & Progress',
            intro: `
              <p style="font-size: 15px; line-height: 1.6;">
                View your <strong>detailed statistics</strong>:
              </p>
              <ul style="text-align: left; margin-top: 12px; line-height: 1.8;">
                <li>📈 Progress over time</li>
                <li>🎯 Mastery levels for each difficulty</li>
                <li>📝 Words you've learned</li>
                <li>🔥 Streak history</li>
              </ul>
            `,
            position: 'top'
          },
          {
            element: '[data-intro="profile-tab"]',
            title: '👤 Your Profile',
            intro: `
              <p style="font-size: 15px; line-height: 1.6;">
                Your <strong>profile</strong> shows:
              </p>
              <ul style="text-align: left; margin-top: 12px; line-height: 1.8;">
                <li>🏅 Certificates you've earned</li>
                <li>🎖️ Badges and achievements</li>
                <li>⚙️ Settings (language, password)</li>
                <li>🚪 Sign out option</li>
              </ul>
            `,
            position: 'top'
          },
          {
            title: '✨ Earning Sparkies',
            intro: `
              <div style="text-align: center; padding: 20px;">
                <div style="font-size: 48px; margin-bottom: 16px;">✨</div>
                <h3 style="color: #f39c12; margin-bottom: 12px;">How to Earn Sparkies</h3>
                <ul style="text-align: left; line-height: 1.8;">
                  <li>✅ Spell words correctly</li>
                  <li>🔥 Build streaks (2+ correct in a row)</li>
                  <li>🎯 Complete difficulty levels</li>
                  <li>📅 Play daily to maintain your streak</li>
                </ul>
                <p style="margin-top: 16px; color: #00c2a0; font-weight: bold;">
                  💡 Tip: Use fewer hints to earn more sparkies!
                </p>
              </div>
            `
          },
          {
            title: '💡 Using Hints',
            intro: `
              <div style="text-align: center; padding: 20px;">
                <div style="font-size: 48px; margin-bottom: 16px;">💡</div>
                <h3 style="color: #00c2a0; margin-bottom: 12px;">Hint System</h3>
                <ul style="text-align: left; line-height: 1.8;">
                  <li>🆓 <strong>First hint is FREE</strong> - Shows description</li>
                  <li>✨ <strong>Letter reveals cost sparkies</strong> (10, 25, 50)</li>
                  <li>⚠️ <strong>Using hints reduces rewards by 50%</strong></li>
                  <li>🎯 <strong>Max 3 hints per word</strong></li>
                </ul>
                <p style="margin-top: 16px; color: #f39c12; font-weight: bold;">
                  💪 Challenge yourself: Try without hints first!
                </p>
              </div>
            `
          },
          {
            title: '🎯 Ready to Play!',
            intro: `
              <div style="text-align: center; padding: 20px;">
                <div style="font-size: 64px; margin-bottom: 16px;">🚀</div>
                <h2 style="color: #00c2a0; margin-bottom: 12px;">You're All Set!</h2>
                <p style="font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
                  Now you know everything to become a spelling champion!
                </p>
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 16px; border-radius: 12px; color: white; margin-top: 16px;">
                  <p style="font-size: 18px; font-weight: bold; margin-bottom: 8px;">
                    🎮 Click "Start Playing!" to begin your journey!
                  </p>
                  <p style="font-size: 14px; opacity: 0.9;">
                    Good luck and have fun learning! 🌟
                  </p>
                </div>
              </div>
            `
          }
        ]
      });
    } else if (userRole === UserRole.TEACHER) {
      intro.setOptions({
        steps: [
          {
            title: '👋 Welcome, Teacher!',
            intro: `
              <div style="text-align: center; padding: 20px;">
                <div style="font-size: 48px; margin-bottom: 16px;">👨‍🏫</div>
                <h2 style="color: #00c2a0; margin-bottom: 12px;">Teacher Dashboard Tour</h2>
                <p style="font-size: 16px; line-height: 1.6;">
                  Let me show you how to manage your students and track their progress!
                </p>
              </div>
            `
          },
          {
            element: '[data-intro="home-tab"]',
            title: '📊 Dashboard',
            intro: `
              <p style="font-size: 15px; line-height: 1.6;">
                Your <strong>Dashboard</strong> shows:
              </p>
              <ul style="text-align: left; margin-top: 12px; line-height: 1.8;">
                <li>👥 Total students</li>
                <li>📈 Class performance overview</li>
                <li>🎯 Average mastery levels</li>
                <li>🏆 Top performers</li>
              </ul>
            `,
            position: 'top'
          },
          {
            title: '👥 Student Management',
            intro: `
              <div style="padding: 16px;">
                <h3 style="color: #00c2a0; margin-bottom: 12px;">Managing Students</h3>
                <p style="font-size: 15px; line-height: 1.6; margin-bottom: 12px;">
                  You can:
                </p>
                <ul style="text-align: left; line-height: 1.8;">
                  <li>📋 View all student progress</li>
                  <li>📊 Track individual performance</li>
                  <li>🎯 Monitor mastery levels</li>
                  <li>📈 Export reports</li>
                  <li>🏆 Issue certificates</li>
                </ul>
              </div>
            `
          },
          {
            title: '📚 Word Bank',
            intro: `
              <div style="padding: 16px;">
                <h3 style="color: #00c2a0; margin-bottom: 12px;">Word Bank Management</h3>
                <p style="font-size: 15px; line-height: 1.6; margin-bottom: 12px;">
                  Customize your word list:
                </p>
                <ul style="text-align: left; line-height: 1.8;">
                  <li>➕ Add new words manually</li>
                  <li>📤 Bulk upload via CSV</li>
                  <li>✏️ Edit existing words</li>
                  <li>🗑️ Delete words</li>
                  <li>🎯 Assign to specific grades/sections</li>
                </ul>
                <p style="margin-top: 12px; color: #f39c12; font-weight: bold;">
                  💡 Tip: Use CSV upload for adding many words at once!
                </p>
              </div>
            `
          },
          {
            element: '[data-intro="rank-tab"]',
            title: '🏆 Class Leaderboard',
            intro: `
              <p style="font-size: 15px; line-height: 1.6;">
                View your <strong>class rankings</strong>:
              </p>
              <ul style="text-align: left; margin-top: 12px; line-height: 1.8;">
                <li>🥇 Top performers</li>
                <li>📊 Sparkies earned</li>
                <li>🎯 Mastery levels</li>
                <li>🔥 Active streaks</li>
              </ul>
              <p style="margin-top: 12px; color: #00c2a0; font-weight: bold;">
                Use this to motivate students and recognize achievements!
              </p>
            `,
            position: 'top'
          },
          {
            element: '[data-intro="profile-tab"]',
            title: '⚙️ Settings',
            intro: `
              <p style="font-size: 15px; line-height: 1.6;">
                Manage your <strong>account settings</strong>:
              </p>
              <ul style="text-align: left; margin-top: 12px; line-height: 1.8;">
                <li>👤 Update profile information</li>
                <li>🔒 Change password</li>
                <li>🌐 Language preferences</li>
                <li>🚪 Sign out</li>
              </ul>
            `,
            position: 'top'
          },
          {
            title: '🎯 Ready to Teach!',
            intro: `
              <div style="text-align: center; padding: 20px;">
                <div style="font-size: 64px; margin-bottom: 16px;">🚀</div>
                <h2 style="color: #00c2a0; margin-bottom: 12px;">You're All Set!</h2>
                <p style="font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
                  You now know how to manage your class and track student progress!
                </p>
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 16px; border-radius: 12px; color: white; margin-top: 16px;">
                  <p style="font-size: 18px; font-weight: bold; margin-bottom: 8px;">
                    📚 Start managing your students!
                  </p>
                  <p style="font-size: 14px; opacity: 0.9;">
                    Good luck with your teaching! 🌟
                  </p>
                </div>
              </div>
            `
          }
        ]
      });
    }

    // Start the tour
    intro.start();

    // Handle tour completion
    intro.oncomplete(() => {
      onComplete();
    });

    // Handle tour exit
    intro.onexit(() => {
      onComplete();
    });

    // Cleanup
    return () => {
      intro.exit();
    };
  }, [userRole, onComplete]);

  return null; // This component doesn't render anything
};

export default IntroTour;
