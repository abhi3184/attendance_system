import httpClient from "../../http/httpClient";

export const hrleaveService = {

  addLeaveBalance: async (obj) => {
    const res = await httpClient.post(`/leave/add_leave_balance`,obj)
    return res || []
  },

  getAllLeaves: async () => {
    const res = await httpClient.get(`/leave/get_all_leaves`);
    return res?.data || [];
  },

  updateLeaveStatus: async (obj) => {
    const res = await httpClient.put(`leave/update_status_By_HR`, obj);
    return res?.data || [];
  },

  getAllLeaveTypes : async () => {
    const res = await httpClient.get(`leave/get_all_leave_types`);
    return res?.data || []
  }
};
