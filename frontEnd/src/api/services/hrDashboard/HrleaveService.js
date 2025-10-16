import httpClient from "../../http/httpClient";

export const hrleaveService = {

  getAllLeaves: async () => {
    const res = await httpClient.get(`/leave/get_all_leaves`);
    return res?.data || [];
  },

    updateLeaveStatus : async (obj) => {
        const res = await httpClient.put(`leave/update_status_By_HR`,obj);
        return res?.data || []; 
    }
};
