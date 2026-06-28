import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

// ─── Students ──────────────────────────────────────────────
export const getStudents       = ()    => api.get('/students');
export const getStudent        = (id)  => api.get(`/students/${id}`);
export const getStudentEnrollments = (id) => api.get(`/students/${id}/enrollments`);
export const getStudentAssignments = (id) => api.get(`/students/${id}/assignments`);
export const getStudentProgress    = (id) => api.get(`/students/${id}/progress`);
export const getStudentResults     = (id) => api.get(`/students/${id}/results`);

// ─── Teachers ─────────────────────────────────────────────
export const getTeachers        = ()          => api.get('/teachers');
export const getTeacherCourses  = (id)        => api.get(`/teachers/${id}/courses`);
export const getTeacherSubmissions = (id)     => api.get(`/teachers/${id}/submissions`);
export const getTeacherPerformance = (id, cId)=> api.get(`/teachers/${id}/performance/${cId}`);
export const getTeacherAIContent   = (id)     => api.get(`/teachers/${id}/ai-content`);
export const approveAIContent      = (cId)    => api.patch(`/teachers/ai-content/${cId}/approve`);
export const gradeSubmission       = (data)   => api.post('/teachers/grade', data);

// ─── Admin ────────────────────────────────────────────────
export const getAdminStats    = ()   => api.get('/admin/stats');
export const getAdminCourses  = ()   => api.get('/admin/courses');
export const getAdminActivity = ()   => api.get('/admin/activity');

// ─── Quizzes ──────────────────────────────────────────────
export const getQuizzes = (courseId) => api.get(`/admin/quizzes/${courseId}`);

export default api;
