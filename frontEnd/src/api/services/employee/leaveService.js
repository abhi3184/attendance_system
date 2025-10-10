import httpClient from "../../http/httpClient";

export const employeeLeaveService = {

    getAllLaves: async (emp_id) => {
        const res = await httpClient.get(`leave/leave_summary/${emp_id}`);
        return res.data || [];
    },

    getLeavesByEmpID : async (emp_id) => {
        const res = await httpClient.get(`leave/getLeavesById?empId=${emp_id}`);
        return res.data || [];
    },

    upcomig_holidays : async () => {
        const res = await httpClient.get(`holidays/get_upcoming_holidays`);
        return res.data || [];
    },

    addLeaveRequest: async (payload) => {
        const res = await httpClient.post('/leave/addleave', payload);
        return res.data || {};
    },

    getLeaveTypes: async () => {
        const res = await httpClient.get('leave/getAllLeaveTypes');
        return res.data || [];
    },
}