import httpClient from "../../http/httpClient";

export const EmployeeService = {
  getAllEmployees: async () => {
    const res = await httpClient.get(`/registration/getAllEmployees`);
    return res.data?.data || [];
  },

  getAllManagers: async () => {
    const res = await httpClient.get(`/registration/getAllManagers`);
    return res.data?.data || [];
  },

  getAllRoles: async () => {
    const res = await httpClient.get(`/registration/getAllRoles`);
    return res.data?.data || [];
  },

  checkEmployeeExist: async ({ email, mobile }) => {
    const res = await httpClient.get(`/registration/checkEmployeeExist`, {
      params: { emailId: email, mobile },
    });
    return res.data;
  },

  addEmployee: async (payload) => {
    const res = await httpClient.post(`/registration/postEmployee`, payload);
    return res.data;
  },

  updateEmployee: async (payload) => {
    const res = await httpClient.put(`/registration/updateEmployee`, payload);
    return res.data;
  },

  updateEmployeeStatus: async (emp_id, status) => {
    const res = await httpClient.put(`/registration/updateEmployeeStatus`, { emp_id, status });
    return res.data;
  },

  deleteEmployee: async (emp_id) => {
    const res = await httpClient.delete(`/registration/deleteEmployee`, { params: { emp_id } });
    return res.data;
  },
};
