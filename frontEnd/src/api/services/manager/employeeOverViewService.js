import httpClient from "../../http/httpClient";

export const EmployeeOverViewService = {

    getEmployeeByManager: async (managerId) => {
        const res = await httpClient.get(`/registration/get_employee_by_manager/${managerId}`);
        return res?.data;
    },

    getUpcomingHolidays: async () => {
        const res = await httpClient.get('holidays/get_upcoming_holidays/');
        return res.data;
    },

    getleavesByManager: async (managerId) => {
        const res = await httpClient.get(`leave/getLeavesByManagerID/${managerId}`);
        return res.data || [];
    },

    leaveSummary: async (employeeId) => {
        const res = await httpClient.get(`leave/leave_summary/${employeeId}`);
        return res?.data;
    },

    getPersonalLeaveRequests: async (employeeId) => {
        const res = await httpClient.get(`leave/getLeavesById?empId=${employeeId}`);
        return res?.data || [];
    }

}