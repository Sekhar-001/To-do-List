import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  PieChart,
  Printer,
  Calendar,
  Clock,
  Award,
  CheckCircle2,
  FileText
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export const AnalyticsView = () => {
  const { studyLogs, subjects, mockTests, tasks, topics, profile } = useApp();
  const [selectedReportType, setSelectedReportType] = useState('Weekly');

  // Chart 1 Data: Daily Study Hours Trend
  const lineLabels = studyLogs.map(l => l.date.substring(5)); // MM-DD
  const lineHoursData = studyLogs.map(l => l.hours);
  const linePlannedData = studyLogs.map(l => l.plannedHours);

  const studyHoursChartData = {
    labels: lineLabels,
    datasets: [
      {
        label: 'Actual Study Hours',
        data: lineHoursData,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        tension: 0.35,
        fill: true
      },
      {
        label: 'Planned Target Hours',
        data: linePlannedData,
        borderColor: '#94a3b8',
        borderDash: [5, 5],
        tension: 0.1,
        fill: false
      }
    ]
  };

  // Chart 2 Data: Subject Study Hours Distribution Bar Chart
  const subjectNames = subjects.map(s => s.code);
  const subjectHours = subjects.map(s => s.studyHours);
  const subjectColors = subjects.map(s => s.color);

  const subjectChartData = {
    labels: subjectNames,
    datasets: [
      {
        label: 'Total Hours Spent',
        data: subjectHours,
        backgroundColor: subjectColors,
        borderRadius: 6
      }
    ]
  };

  // Chart 3 Data: Syllabus Topic Status Breakdown Doughnut Chart
  const masteredCount = topics.filter(t => t.status === 'Mastered').length;
  const revisedCount = topics.filter(t => t.status.startsWith('Revision')).length;
  const completedCount = topics.filter(t => t.status === 'Completed').length;
  const learningCount = topics.filter(t => t.status === 'Learning').length;
  const notStartedCount = topics.filter(t => t.status === 'Not Started').length;

  const syllabusChartData = {
    labels: ['Mastered', 'Revised', 'Completed', 'Learning', 'Not Started'],
    datasets: [
      {
        data: [masteredCount, revisedCount, completedCount, learningCount, notStartedCount],
        backgroundColor: ['#10b981', '#6366f1', '#8b5cf6', '#f59e0b', '#64748b']
      }
    ]
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <PieChart size={28} style={{ color: 'var(--accent-primary)' }} />
            <span>Productivity Analytics & Printable Reports</span>
          </h1>
          <p className="page-subtitle">Visual study analytics, target vs actual study time, and printable academic summaries</p>
        </div>

        <button className="btn btn-primary" onClick={handlePrintReport}>
          <Printer size={18} /> Print Academic Report
        </button>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid-2col">
        {/* Daily Study Hours Trend Line Chart */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Clock size={18} style={{ color: 'var(--accent-primary)' }} />
              <span>Daily Study Time (Actual vs Target)</span>
            </div>
          </div>
          <div style={{ height: '260px' }}>
            <Line
              data={studyHoursChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } }
              }}
            />
          </div>
        </div>

        {/* Subject Study Hours Distribution */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Clock size={18} style={{ color: '#8b5cf6' }} />
              <span>Subject Hours Distribution</span>
            </div>
          </div>
          <div style={{ height: '260px' }}>
            <Bar
              data={subjectChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
              }}
            />
          </div>
        </div>
      </div>

      {/* Printable Report Generator Section */}
      <div className="card" style={{ border: '2px dashed var(--border-hover)' }}>
        <div className="card-header">
          <div className="card-title">
            <FileText size={20} style={{ color: 'var(--accent-primary)' }} />
            <span>Generated Academic Audit Report</span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['Daily', 'Weekly', 'Monthly', 'Subject', 'Revision', 'MockTest'].map(rep => (
              <button
                key={rep}
                onClick={() => setSelectedReportType(rep)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid',
                  borderColor: selectedReportType === rep ? 'var(--accent-primary)' : 'var(--border-color)',
                  backgroundColor: selectedReportType === rep ? 'var(--accent-primary-light)' : 'var(--bg-tertiary)',
                  color: selectedReportType === rep ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  fontWeight: '700',
                  fontSize: '0.78rem',
                  cursor: 'pointer'
                }}
              >
                {rep} Report
              </button>
            ))}
          </div>
        </div>

        {/* Report Content Preview (Formated for crisp printing) */}
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem',
          color: 'var(--text-primary)'
        }}>
          <div style={{ borderBottom: '2px solid var(--accent-primary)', paddingBottom: '0.75rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>EduTrack Academic Performance Report</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Student: {profile.name} • Goal: {profile.targetExam}</p>
            </div>
            <div style={{ textAlign: 'right', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Report Type: <strong>{selectedReportType} Report</strong><br />
              Generated: {new Date().toLocaleDateString()}
            </div>
          </div>

          <div className="grid-3col" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>TOTAL COMPLETED TASKS</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '800' }}>{tasks.filter(t => t.status === 'Completed').length} / {tasks.length}</div>
            </div>

            <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>AVERAGE MOCK ACCURACY</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#10b981' }}>
                {(mockTests.reduce((acc, curr) => acc + curr.accuracy, 0) / (mockTests.length || 1)).toFixed(1)}%
              </div>
            </div>

            <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>ACTIVE STUDY STREAK</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#f59e0b' }}>{profile.streakDays} Days</div>
            </div>
          </div>

          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.5rem' }}>Subject Mastery Audit</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '1rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-tertiary)', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '0.5rem 0.75rem' }}>Subject</th>
                <th style={{ padding: '0.5rem 0.75rem' }}>Study Hours</th>
                <th style={{ padding: '0.5rem 0.75rem' }}>Topics Done</th>
                <th style={{ padding: '0.5rem 0.75rem' }}>Identified Weak Areas</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.5rem 0.75rem', fontWeight: '700' }}>{s.name}</td>
                  <td style={{ padding: '0.5rem 0.75rem' }}>{s.studyHours} hrs</td>
                  <td style={{ padding: '0.5rem 0.75rem' }}>{s.completedTopics} / {s.topicsCount}</td>
                  <td style={{ padding: '0.5rem 0.75rem', color: '#ef4444' }}>{s.weakAreas.join(', ') || 'None'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
