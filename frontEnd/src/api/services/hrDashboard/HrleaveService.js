import httpClient from "../../http/httpClient";

export const hrleaveService = {

  getAllLeaves: async () => {
    const res = await httpClient.get(`/leave/get_all_leaves`);
    return res?.data || [];
  },

  updateStatus: async (id, status,approvedby) => {
    const res = await httpClient.put(`http://127.0.0.1:8000/leave/update_status`, {
      leave_id: id,
      status,
      approved_by: approvedby,
    });
    return res || null;
  },
};
