import React, { useState, useMemo } from 'react';
import { User, Difficulty } from './types';

interface AdvancedAnalyticsProps {
  students: User[];
  totalWords: number;
}

const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ students, totalWords }) => {
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('all');

  // Calculate analytics
  const analytics = useMemo(() => {
    const filteredStudents = selectedGrade === 'all' 
      ? students 
      : students.filter(s => s.gradeLevel === selectedGrade);

    const totalStudents = filteredStudents.length;
    const activeStudents = filteredStudents.filter(s => (s.totalGames || 0) > 0).length;
    const totalSparkies = filteredStudents.reduce((sum, s) => sum + (s.sparkies || 0), 0);
    const totalGames = filteredStudents.reduce((sum, s) => sum + (s.totalGames || 0), 0);
    const totalWordsLearned = filteredStudents.reduce((sum, s) => sum + (s.wordsLearned || 0), 0);
    
    const avgSparkies = totalStudents > 0 ? Math.round(totalSparkies / totalStudents) : 0;
    const avgGames = totalStudents > 0 ? Math.round(totalGames / totalStudents) : 0;
    const avgWordsLearned = totalStudents > 0 ? Math.round(totalWordsLearned / totalStudents) : 0;
    
    const engagementRate = totalStudents > 0 ? Math.round((activeStudents / totalStudents) * 100) : 0;
    
    // Difficulty distribution
    const easyMastery = filteredStudents.reduce((sum, s) => {
      const progress = s.levelProgress?.[Difficulty.EASY];
      return sum + (progress?.mastery || 0);
    }, 0) / (totalStudents || 1);
    
    const mediumMastery = filteredStudents.reduce((sum, s) => {
      const progress = s.levelProgress?.[Difficulty.MEDIUM];
      return sum + (progress?.mastery || 0);
    }, 0) / (totalStudents || 1);
    
    const hardMastery = filteredStudents.reduce((sum, s) => {
      const progress = s.levelProgress?.[Difficulty.HARD];
      return sum + (progress?.mastery || 0);
    }, 0) / (totalStudents || 1);
    
    // Streak analysis
    const studentsWithStreak = filteredStudents.filter(s => (s.currentStreak || 0) > 0).length;
    const avgStreak = filteredStudents.reduce((sum, s) => sum + (s.currentStreak || 0), 0) / (totalStudents || 1);
    const longestStreak = Math.max(...filteredStudents.map(s => s.longestStreak || 0), 0);
    
    // Grade distribution
    const gradeDistribution = students.reduce((acc, s) => {
      const grade = s.gradeLevel || 'Unknown';
      acc[grade] = (acc[grade] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      totalStudents,
      activeStudents,
      totalSparkies,
      totalGames,
      totalWordsLearned,
      avgSparkies,
      avgGames,
      avgWordsLearned,
      engagementRate,
      easyMastery: Math.round(easyMastery),
      mediumMastery: Math.round(mediumMastery),
      hardMastery: Math.round(hardMastery),
      studentsWithStreak,
      avgStreak: Math.round(avgStreak * 10) / 10,
      longestStreak,
      gradeDistribution
    };
  }, [students, selectedGrade]);

  const gradeLevels = Array.from(new Set(students.map(s => s.gradeLevel).filter(Boolean))).sort();

  const exportData = () => {
    // Filter students by selected grade
    const studentsToExport = selectedGrade === 'all' 
      ? students 
      : students.filter(s => s.gradeLevel === selectedGrade);
    
    const csvContent = [
      ['Student Name', 'Grade', 'Section', 'Sparkies', 'Words Learned', 'Games Played', 'Current Streak', 'Easy Mastery', 'Medium Mastery', 'Hard Mastery'],
      ...studentsToExport.map(s => [
        s.name,
        s.gradeLevel || 'N/A',
        s.section || 'N/A',
        s.sparkies || 0,
        s.wordsLearned || 0,
        s.totalGames || 0,
        s.currentStreak || 0,
        s.levelProgress?.[Difficulty.EASY]?.mastery || 0,
        s.levelProgress?.[Difficulty.MEDIUM]?.mastery || 0,
        s.levelProgress?.[Difficulty.HARD]?.mastery || 0
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const csvGradeLabel = selectedGrade === 'all' ? 'all-grades' : `grade-${selectedGrade}`;
    a.download = `class-report-${csvGradeLabel}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateReport = () => {
    const date = new Date();
    const formattedDate = date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    const formattedTime = date.toLocaleTimeString('en-US');
    
    const gradeLabel = selectedGrade === 'all' ? 'All Grades' : `Grade ${selectedGrade}`;
    
    // Filter students for detailed list
    const studentsToReport = selectedGrade === 'all' 
      ? students 
      : students.filter(s => s.gradeLevel === selectedGrade);
    
    // Sort by sparkies for report
    const sortedStudents = [...studentsToReport].sort((a, b) => (b.sparkies || 0) - (a.sparkies || 0));
    
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Class Performance Report - ${gradeLabel}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
            padding: 20px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            border-radius: 8px;
        }
        
        .header {
            text-align: center;
            border-bottom: 3px solid #00c2a0;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        
        .header h1 {
            color: #00c2a0;
            font-size: 32px;
            margin-bottom: 10px;
        }
        
        .header .subtitle {
            color: #666;
            font-size: 18px;
        }
        
        .meta-info {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
        }
        
        .meta-info div {
            margin: 5px 0;
        }
        
        .meta-info strong {
            color: #00c2a0;
        }
        
        .section {
            margin-bottom: 40px;
        }
        
        .section-title {
            color: #00c2a0;
            font-size: 24px;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e0e0e0;
        }
        
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .metric-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .metric-card.teal {
            background: linear-gradient(135deg, #00c2a0 0%, #00d8b3 100%);
        }
        
        .metric-card.orange {
            background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
        }
        
        .metric-card.blue {
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        }
        
        .metric-card .label {
            font-size: 14px;
            opacity: 0.9;
            margin-bottom: 5px;
        }
        
        .metric-card .value {
            font-size: 36px;
            font-weight: bold;
        }
        
        .metric-card .subtext {
            font-size: 12px;
            opacity: 0.8;
            margin-top: 5px;
        }
        
        .progress-bar {
            background: #e0e0e0;
            height: 30px;
            border-radius: 15px;
            overflow: hidden;
            margin: 10px 0;
            position: relative;
        }
        
        .progress-fill {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 14px;
            transition: width 0.3s ease;
        }
        
        .progress-fill.easy {
            background: linear-gradient(90deg, #22c55e 0%, #16a34a 100%);
        }
        
        .progress-fill.medium {
            background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%);
        }
        
        .progress-fill.hard {
            background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%);
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        thead {
            background: #00c2a0;
            color: white;
        }
        
        th {
            padding: 15px;
            text-align: left;
            font-weight: 600;
        }
        
        td {
            padding: 12px 15px;
            border-bottom: 1px solid #e0e0e0;
        }
        
        tbody tr:hover {
            background: #f8f9fa;
        }
        
        tbody tr:nth-child(even) {
            background: #fafafa;
        }
        
        .rank-badge {
            display: inline-block;
            width: 30px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            border-radius: 50%;
            font-weight: bold;
            color: white;
        }
        
        .rank-1 { background: #fbbf24; }
        .rank-2 { background: #9ca3af; }
        .rank-3 { background: #ea580c; }
        .rank-other { background: #6b7280; }
        
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e0e0e0;
            text-align: center;
            color: #666;
            font-size: 14px;
        }
        
        .grade-distribution {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin-top: 20px;
        }
        
        .grade-box {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            border: 2px solid #e0e0e0;
        }
        
        .grade-box .grade-label {
            color: #666;
            font-size: 14px;
            margin-bottom: 10px;
        }
        
        .grade-box .grade-count {
            font-size: 32px;
            font-weight: bold;
            color: #00c2a0;
        }
        
        .grade-box .grade-percent {
            color: #999;
            font-size: 12px;
            margin-top: 5px;
        }
        
        @media print {
            body {
                background: white;
                padding: 0;
            }
            
            .container {
                box-shadow: none;
                padding: 20px;
            }
            
            .no-print {
                display: none;
            }
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 20px;
            }
            
            .metrics-grid {
                grid-template-columns: 1fr;
            }
            
            table {
                font-size: 14px;
            }
            
            th, td {
                padding: 8px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Class Performance Report</h1>
            <div class="subtitle">Mastering Words - Spelling Learning System</div>
        </div>
        
        <div class="meta-info">
            <div><strong>Report Generated:</strong> ${formattedDate} at ${formattedTime}</div>
            <div><strong>Grade Level:</strong> ${gradeLabel}</div>
            <div><strong>Total Students:</strong> ${analytics.totalStudents}</div>
        </div>
        
        <div class="section">
            <h2 class="section-title">📈 Overview Statistics</h2>
            <div class="metrics-grid">
                <div class="metric-card">
                    <div class="label">Total Students</div>
                    <div class="value">${analytics.totalStudents}</div>
                    <div class="subtext">${analytics.activeStudents} active (${analytics.engagementRate}%)</div>
                </div>
                <div class="metric-card teal">
                    <div class="label">Total Sparkies Earned</div>
                    <div class="value">${analytics.totalSparkies}</div>
                    <div class="subtext">Average: ${analytics.avgSparkies} per student</div>
                </div>
                <div class="metric-card orange">
                    <div class="label">Games Played</div>
                    <div class="value">${analytics.totalGames}</div>
                    <div class="subtext">Average: ${analytics.avgGames} per student</div>
                </div>
                <div class="metric-card blue">
                    <div class="label">Words Learned</div>
                    <div class="value">${analytics.totalWordsLearned}</div>
                    <div class="subtext">Average: ${analytics.avgWordsLearned} per student</div>
                </div>
            </div>
        </div>
        
        <div class="section">
            <h2 class="section-title">🎯 Difficulty Level Mastery</h2>
            <div>
                <div style="margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                        <span><strong>Easy Level</strong></span>
                        <span><strong>${analytics.easyMastery}%</strong></span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill easy" style="width: ${analytics.easyMastery}%">
                            ${analytics.easyMastery}%
                        </div>
                    </div>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                        <span><strong>Medium Level</strong></span>
                        <span><strong>${analytics.mediumMastery}%</strong></span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill medium" style="width: ${analytics.mediumMastery}%">
                            ${analytics.mediumMastery}%
                        </div>
                    </div>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                        <span><strong>Hard Level</strong></span>
                        <span><strong>${analytics.hardMastery}%</strong></span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill hard" style="width: ${analytics.hardMastery}%">
                            ${analytics.hardMastery}%
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="section">
            <h2 class="section-title">🔥 Engagement & Streaks</h2>
            <div class="metrics-grid">
                <div class="metric-card">
                    <div class="label">Engagement Rate</div>
                    <div class="value">${analytics.engagementRate}%</div>
                    <div class="subtext">${analytics.activeStudents} of ${analytics.totalStudents} students active</div>
                </div>
                <div class="metric-card orange">
                    <div class="label">Students with Streak</div>
                    <div class="value">${analytics.studentsWithStreak}</div>
                    <div class="subtext">Average: ${analytics.avgStreak} days</div>
                </div>
                <div class="metric-card teal">
                    <div class="label">Longest Streak</div>
                    <div class="value">${analytics.longestStreak}</div>
                    <div class="subtext">days in a row</div>
                </div>
            </div>
        </div>
        
        ${selectedGrade === 'all' ? `
        <div class="section">
            <h2 class="section-title">📚 Grade Distribution</h2>
            <div class="grade-distribution">
                ${Object.entries(analytics.gradeDistribution).map(([grade, count]) => `
                    <div class="grade-box">
                        <div class="grade-label">Grade ${grade}</div>
                        <div class="grade-count">${count}</div>
                        <div class="grade-percent">${Math.round((count / analytics.totalStudents) * 100)}%</div>
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}
        
        <div class="section">
            <h2 class="section-title">🏆 Student Performance Details</h2>
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Student Name</th>
                        <th>Grade</th>
                        <th>Sparkies</th>
                        <th>Words</th>
                        <th>Games</th>
                        <th>Streak</th>
                        <th>Easy</th>
                        <th>Medium</th>
                        <th>Hard</th>
                    </tr>
                </thead>
                <tbody>
                    ${sortedStudents.map((student, index) => `
                        <tr>
                            <td>
                                <span class="rank-badge ${
                                    index === 0 ? 'rank-1' : 
                                    index === 1 ? 'rank-2' : 
                                    index === 2 ? 'rank-3' : 
                                    'rank-other'
                                }">${index + 1}</span>
                            </td>
                            <td><strong>${student.name}</strong></td>
                            <td>${student.gradeLevel || 'N/A'}${student.section ? ` - ${student.section}` : ''}</td>
                            <td><strong>${student.sparkies || 0}</strong></td>
                            <td>${student.wordsLearned || 0}</td>
                            <td>${student.totalGames || 0}</td>
                            <td>${student.currentStreak || 0}</td>
                            <td>${student.levelProgress?.[Difficulty.EASY]?.mastery || 0}%</td>
                            <td>${student.levelProgress?.[Difficulty.MEDIUM]?.mastery || 0}%</td>
                            <td>${student.levelProgress?.[Difficulty.HARD]?.mastery || 0}%</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <div class="footer">
            <p><strong>Mastering Words</strong> - Gamified Spelling Learning System</p>
            <p>This report was automatically generated on ${formattedDate}</p>
            <p style="margin-top: 10px; font-size: 12px;">
                For questions or support, please contact your system administrator.
            </p>
        </div>
    </div>
</body>
</html>
    `.trim();

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const htmlGradeLabel = selectedGrade === 'all' ? 'all-grades' : `grade-${selectedGrade}`;
    a.download = `class-report-${htmlGradeLabel}-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="bg-[#162031] rounded-2xl p-6 border border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Advanced Analytics</h3>
            <p className="text-gray-400 text-sm">Comprehensive class performance insights</p>
          </div>
          <div className="flex gap-3">
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="bg-[#0b1221] border border-white/5 rounded-xl py-2 px-4 text-sm text-white focus:border-[#00c2a0] outline-none"
            >
              <option value="all">All Grades</option>
              {gradeLevels.map(grade => (
                <option key={grade} value={grade}>Grade {grade}</option>
              ))}
            </select>
            <button
              onClick={generateReport}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-xl text-sm transition-all active:scale-95"
            >
              📄 Generate Report
            </button>
            <button
              onClick={exportData}
              className="bg-[#00c2a0] hover:bg-[#00d8b3] text-white font-bold px-6 py-2 rounded-xl text-sm transition-all active:scale-95"
            >
              📊 Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">👥</span>
            <span className="text-xs font-bold text-purple-400 uppercase">Students</span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{analytics.totalStudents}</p>
          <p className="text-xs text-gray-500">{analytics.activeStudents} active ({analytics.engagementRate}%)</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">✨</span>
            <span className="text-xs font-bold text-orange-400 uppercase">Total Sparkies</span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{analytics.totalSparkies}</p>
          <p className="text-xs text-gray-500">Avg: {analytics.avgSparkies} per student</p>
        </div>

        <div className="bg-gradient-to-br from-teal-500/10 to-teal-500/5 border border-teal-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">🎮</span>
            <span className="text-xs font-bold text-teal-400 uppercase">Games Played</span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{analytics.totalGames}</p>
          <p className="text-xs text-gray-500">Avg: {analytics.avgGames} per student</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">📚</span>
            <span className="text-xs font-bold text-blue-400 uppercase">Words Learned</span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{analytics.totalWordsLearned}</p>
          <p className="text-xs text-gray-500">Avg: {analytics.avgWordsLearned} per student</p>
        </div>
      </div>

      {/* Difficulty Mastery */}
      <div className="bg-[#162031] rounded-2xl p-8 border border-white/5">
        <h3 className="text-xl font-bold text-white mb-6">Difficulty Level Mastery</h3>
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-green-400">Easy Level</span>
              <span className="text-sm font-bold text-white">{analytics.easyMastery}%</span>
            </div>
            <div className="w-full h-3 bg-[#0b1221] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-1000"
                style={{ width: `${analytics.easyMastery}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-yellow-400">Medium Level</span>
              <span className="text-sm font-bold text-white">{analytics.mediumMastery}%</span>
            </div>
            <div className="w-full h-3 bg-[#0b1221] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 transition-all duration-1000"
                style={{ width: `${analytics.mediumMastery}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-red-400">Hard Level</span>
              <span className="text-sm font-bold text-white">{analytics.hardMastery}%</span>
            </div>
            <div className="w-full h-3 bg-[#0b1221] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-1000"
                style={{ width: `${analytics.hardMastery}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Engagement & Streaks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#162031] rounded-2xl p-8 border border-white/5">
          <h3 className="text-xl font-bold text-white mb-6">Engagement Metrics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#0b1221] rounded-xl">
              <span className="text-gray-400">Engagement Rate</span>
              <span className="text-2xl font-bold text-[#00c2a0]">{analytics.engagementRate}%</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-[#0b1221] rounded-xl">
              <span className="text-gray-400">Active Students</span>
              <span className="text-2xl font-bold text-white">{analytics.activeStudents}/{analytics.totalStudents}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-[#0b1221] rounded-xl">
              <span className="text-gray-400">Avg Games/Student</span>
              <span className="text-2xl font-bold text-blue-400">{analytics.avgGames}</span>
            </div>
          </div>
        </div>

        <div className="bg-[#162031] rounded-2xl p-8 border border-white/5">
          <h3 className="text-xl font-bold text-white mb-6">Streak Analysis</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#0b1221] rounded-xl">
              <span className="text-gray-400">Students with Streak</span>
              <span className="text-2xl font-bold text-orange-400">{analytics.studentsWithStreak}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-[#0b1221] rounded-xl">
              <span className="text-gray-400">Average Streak</span>
              <span className="text-2xl font-bold text-white">{analytics.avgStreak} days</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-[#0b1221] rounded-xl">
              <span className="text-gray-400">Longest Streak</span>
              <span className="text-2xl font-bold text-red-400">🔥 {analytics.longestStreak} days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grade Distribution */}
      <div className="bg-[#162031] rounded-2xl p-8 border border-white/5">
        <h3 className="text-xl font-bold text-white mb-6">Grade Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(analytics.gradeDistribution).map(([grade, count]) => (
            <div key={grade} className="bg-[#0b1221] rounded-xl p-4 text-center">
              <p className="text-gray-400 text-xs mb-2">Grade {grade}</p>
              <p className="text-3xl font-bold text-white">{count}</p>
              <p className="text-gray-500 text-xs mt-1">
                {Math.round((count / analytics.totalStudents) * 100)}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;
