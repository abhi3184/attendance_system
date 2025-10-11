import httpClient from "../../http/httpClient";

export const ManagerDashboardService = {
  getTeamMembers: async (managerId) => {
    try {
      const res = await httpClient.get(`/registration/get_employee_by_manager/${managerId}`);
      return res.data;
    } catch (err) {
      throw err;
    }
  },

  getAttendanceCount: async (managerId) => {
    try {
      const res = await httpClient.get(`/dashboard/attendance_count_by_manager/${managerId}`);
      return res.data;
    } catch (err) {
      throw err;
    }
  },

  getLeaves: async (managerId) => {
    try {
      const res = await httpClient.get(`/leave/getLeavesByManagerID/${managerId}`);
      return res.data;
    } catch (err) {
      throw err;
    }
  },

  getWeeklyAttendance: async (managerId) => {
    try {
      const res = await httpClient.get(`/checkIn/weekly_attendance_by_manager/${managerId}`);
      return res.data;
    } catch (err) {
      throw err;
    }
  },

  getUpcomingHolidays: async () => {
    try {
      const res = await httpClient.get(`/holidays/get_upcoming_holidays`);
      return res.data;
    } catch (err) {
      throw err;
    }
  },

  updateLeaveStatus: async (payload) => {
    try {
      const res = await httpClient.put(`/leave/update_status`, payload);
      return res.data;
    } catch (err) {
      throw err;
    }
  },
};
