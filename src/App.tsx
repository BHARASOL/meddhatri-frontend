import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext.js';
import { ProtectedRoute } from './auth/ProtectedRoute.js';
import { LoginPage } from './auth/pages/LoginPage.js';

// Layouts
import { ProfessionalsLayout } from './professionals/layout/ProfessionalsLayout.js';
import { OrganizationLayout } from './components/layouts/OrganizationLayout.js';
import { RecruiterLayout } from './components/layouts/RecruiterLayout.js';
import { AdminLayout } from './components/layouts/AdminLayout.js';
import { PublicLayout } from './components/layouts/PublicLayout.js';

// Professional Pages
import {
  ProfessionalDashboard,
  ProfileEditPage,
  EducationCertificationsPage,
  ResumeManagementPage,
  RecommendedJobsPage,
  SavedJobsPage,
  MyApplicationsPage,
  ProfessionalInterviewsPage,
  ProfessionalNotificationsPage,
  ProfessionalSettingsPage,
  VerificationPage,
  MessagesPage
} from './professionals/pages/index.js';

// Organization Pages
import {
  OrganizationDashboard,
  CreateJobPage,
  ManageJobsPage,
  CandidateSearchPage,
  ApplicantsPage,
  ApplicantDetailsPage,
  RecruitmentPipelinePage,
  OrganizationInterviewsPage,
  OrganizationProfilePage,
  OrganizationVerificationPage,
  TeamManagementPage,
  OrganizationReportsPage,
  OrganizationSettingsPage
} from './organization/pages/index.js';

// Recruiter Pages
import {
  RecruiterDashboardPage,
  RecruiterAssignedJobsPage,
  RecruiterCandidatesPage,
  RecruiterCandidateDetailsPage,
  RecruiterResumeScreeningPage,
  RecruiterPipelinePage,
  RecruiterInterviewsPage,
  RecruiterTasksPage,
  RecruiterTalentPoolPage,
  RecruiterNotificationsPage,
  RecruiterCollaborationPage,
  RecruiterReportsPage,
  RecruiterSettingsPage
} from './recruiters/pages/index.js';

// Super Admin Pages
import {
  SuperAdminDashboardPage,
  UserManagementPage,
  OrganizationManagementPage,
  VerificationManagementPage,
  JobModerationPage,
  AuditLogsPage,
  ComplaintsPage,
  ProfessionManagementPage,
  SkillsQualificationsPage,
  SuperAdminReportsPage,
  RolesPermissionsPage,
  PlatformSettingsPage,
  AdminOrganizationRegisterPage
} from './superadmin/pages/index.js';

// Public Landing Pages
import {
  HomePage,
  JobSearchPage,
  JobDetailPage,
  AboutUsPage,
  HowItWorksPage,
  PricingPage,
  FaqsPage,
  ContactUsPage,
  PrivacyPolicyPage,
  RegisterPage,
  OnboardingWelcomePage,
  CompleteProfilePage,
  LeadershipPage,
  ProfessionalsExplorePage,
  OrganizationsExplorePage,
  PortalsGuidePage,
  OrganizationRegisterPage,
  OrgRegistrationPendingPage,
  DisclaimerPage,
  TermsPage
} from './public-site/pages/index.js';

export const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Routes>
        {/* ======================================================== */}
        {/* PUBLIC & AUTHENTICATION ROUTES (UNPROTECTED)             */}
        {/* ======================================================== */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/welcome" element={<OnboardingWelcomePage />} />
        <Route path="/onboarding" element={<OnboardingWelcomePage />} />
        <Route path="/sign-up" element={<RegisterPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/org/register" element={<OrganizationRegisterPage />} />
        <Route path="/organization/register" element={<OrganizationRegisterPage />} />
        <Route path="/org/pending" element={<OrgRegistrationPendingPage />} />
        <Route path="/organization/pending" element={<OrgRegistrationPendingPage />} />
        <Route path="/complete-profile" element={<CompleteProfilePage />} />
        <Route path="/professional/complete-profile" element={<CompleteProfilePage />} />

        {/* ======================================================== */}
        {/* 1. HEALTHCARE PROFESSIONAL PORTAL (RBAC PROTECTED)       */}
        {/* Allowed: PROFESSIONAL, SUPER_ADMIN                       */}
        {/* ======================================================== */}
        {['/professional', '/professionals'].map((prefix) => (
          <Route
            key={prefix}
            path={prefix}
            element={
              <ProtectedRoute allowedRoles={['PROFESSIONAL', 'SUPER_ADMIN']}>
                <ProfessionalsLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<ProfessionalDashboard />} />
            <Route path="profile" element={<ProfileEditPage />} />
            <Route path="education" element={<EducationCertificationsPage />} />
            <Route path="resume" element={<ResumeManagementPage />} />
            <Route path="recommended" element={<RecommendedJobsPage />} />
            <Route path="saved" element={<SavedJobsPage />} />
            <Route path="applications" element={<MyApplicationsPage />} />
            <Route path="interviews" element={<ProfessionalInterviewsPage />} />
            <Route path="notifications" element={<ProfessionalNotificationsPage />} />
            <Route path="settings" element={<ProfessionalSettingsPage />} />
            <Route path="verification" element={<VerificationPage />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="jobs" element={<JobSearchPage />} />
            <Route path="jobs/:slug" element={<JobDetailPage />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>
        ))}

        {/* Support direct root dashboard path for professional */}
        <Route
          element={
            <ProtectedRoute allowedRoles={['PROFESSIONAL', 'SUPER_ADMIN']}>
              <ProfessionalsLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<ProfessionalDashboard />} />
          <Route path="/profile" element={<ProfileEditPage />} />
          <Route path="/education" element={<EducationCertificationsPage />} />
          <Route path="/resume" element={<ResumeManagementPage />} />
          <Route path="/recommended" element={<RecommendedJobsPage />} />
          <Route path="/saved" element={<SavedJobsPage />} />
          <Route path="/applications" element={<MyApplicationsPage />} />
          <Route path="/interviews" element={<ProfessionalInterviewsPage />} />
          <Route path="/notifications" element={<ProfessionalNotificationsPage />} />
          <Route path="/settings" element={<ProfessionalSettingsPage />} />
          <Route path="/verification" element={<VerificationPage />} />
          <Route path="/messages" element={<MessagesPage />} />
        </Route>

        {/* ======================================================== */}
        {/* 2. ORGANIZATION PORTAL (RBAC PROTECTED)                  */}
        {/* Allowed: ORGANIZATION_ADMIN, SUPER_ADMIN                 */}
        {/* ======================================================== */}
        <Route
          path="/organization"
          element={
            <ProtectedRoute allowedRoles={['ORGANIZATION_ADMIN', 'SUPER_ADMIN']}>
              <OrganizationLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<OrganizationDashboard />} />
          <Route path="jobs" element={<ManageJobsPage />} />
          <Route path="jobs/create" element={<CreateJobPage />} />
          <Route path="candidates" element={<CandidateSearchPage />} />
          <Route path="applicants" element={<ApplicantsPage />} />
          <Route path="applicants/:id" element={<ApplicantDetailsPage />} />
          <Route path="pipeline" element={<RecruitmentPipelinePage />} />
          <Route path="interviews" element={<OrganizationInterviewsPage />} />
          <Route path="profile" element={<OrganizationProfilePage />} />
          <Route path="verification" element={<OrganizationVerificationPage />} />
          <Route path="team" element={<TeamManagementPage />} />
          <Route path="reports" element={<OrganizationReportsPage />} />
          <Route path="settings" element={<OrganizationSettingsPage />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* ======================================================== */}
        {/* 3. RECRUITER PORTAL (RBAC PROTECTED)                     */}
        {/* Allowed: RECRUITER, ORGANIZATION_ADMIN, SUPER_ADMIN      */}
        {/* ======================================================== */}
        {['/recruiter', '/recruiters'].map((prefix) => (
          <Route
            key={prefix}
            path={prefix}
            element={
              <ProtectedRoute allowedRoles={['RECRUITER', 'ORGANIZATION_ADMIN', 'SUPER_ADMIN']}>
                <RecruiterLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<RecruiterDashboardPage />} />
            <Route path="jobs" element={<RecruiterAssignedJobsPage />} />
            <Route path="candidates" element={<RecruiterCandidatesPage />} />
            <Route path="candidates/:id" element={<RecruiterCandidateDetailsPage />} />
            <Route path="screening" element={<RecruiterResumeScreeningPage />} />
            <Route path="pipeline" element={<RecruiterPipelinePage />} />
            <Route path="interviews" element={<RecruiterInterviewsPage />} />
            <Route path="tasks" element={<RecruiterTasksPage />} />
            <Route path="talent-pool" element={<RecruiterTalentPoolPage />} />
            <Route path="collaboration" element={<RecruiterCollaborationPage />} />
            <Route path="notifications" element={<RecruiterNotificationsPage />} />
            <Route path="reports" element={<RecruiterReportsPage />} />
            <Route path="settings" element={<RecruiterSettingsPage />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>
        ))}

        {/* ======================================================== */}
        {/* 4. SUPER ADMIN CONSOLE (STRICT RBAC PROTECTED)           */}
        {/* Allowed: STRICTLY SUPER_ADMIN ONLY                       */}
        {/* ======================================================== */}
        {['/superadmin', '/admin'].map((prefix) => (
          <Route
            key={prefix}
            path={prefix}
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<SuperAdminDashboardPage />} />
            <Route path="users" element={<UserManagementPage />} />
            <Route path="organizations" element={<OrganizationManagementPage />} />
            <Route path="register-organization" element={<AdminOrganizationRegisterPage />} />
            <Route path="organizations/register" element={<AdminOrganizationRegisterPage />} />
            <Route path="verifications" element={<VerificationManagementPage />} />
            <Route path="job-moderation" element={<JobModerationPage />} />
            <Route path="jobs" element={<JobModerationPage />} />
            <Route path="audit-logs" element={<AuditLogsPage />} />
            <Route path="complaints" element={<ComplaintsPage />} />
            <Route path="professions" element={<ProfessionManagementPage />} />
            <Route path="skills-qualifications" element={<SkillsQualificationsPage />} />
            <Route path="reports-analytics" element={<SuperAdminReportsPage />} />
            <Route path="reports" element={<SuperAdminReportsPage />} />
            <Route path="roles-permissions" element={<RolesPermissionsPage />} />
            <Route path="roles" element={<RolesPermissionsPage />} />
            <Route path="platform-settings" element={<PlatformSettingsPage />} />
            <Route path="settings" element={<PlatformSettingsPage />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>
        ))}

        {/* ======================================================== */}
        {/* PUBLIC MARKETING & LANDING PAGES                         */}
        {/* ======================================================== */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/landing" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/faqs" element={<FaqsPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/contact-us" element={<ContactUsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/terms-and-conditions" element={<TermsPage />} />
          <Route path="/disclaimer" element={<DisclaimerPage />} />
          <Route path="/leadership" element={<LeadershipPage />} />
          <Route path="/explore/professionals" element={<ProfessionalsExplorePage />} />
          <Route path="/explore/organizations" element={<OrganizationsExplorePage />} />
          <Route path="/guide" element={<PortalsGuidePage />} />
          <Route path="/find-jobs" element={<JobSearchPage />} />
        </Route>

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
