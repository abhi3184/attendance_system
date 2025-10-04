// EditEmployeeModal.js
import React, { useState, useEffect } from "react";
import Modal from "../../modals/modal";
import FancyDropdown from "../../modals/dropdowns";
import axios from "axios";
import toast from "react-hot-toast";

export const EditEmployeeModal = ({ isOpen, onClose, employeeData, onSubmit }) => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        department: "",
        role: "",
        shift: "",
        managerId: "",
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [managers, setManagers] = useState([]);
    const [roles, setRoles] = useState([]);

    const inputBaseClass = "w-full border rounded-md px-3 pt-4 pb-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500";

    // Fetch managers and roles once
    useEffect(() => {
        axios.get("http://127.0.0.1:8000/registration/getAllManagers")
            .then(res => Array.isArray(res.data?.data) && setManagers(res.data.data))
            .catch(err => console.error(err));

        axios.get("http://127.0.0.1:8000/registration/getAllRoles")
            .then(res => Array.isArray(res.data?.data) && setRoles(res.data.data))
            .catch(err => console.error(err));
    }, []);

    // Populate form when modal opens
    useEffect(() => {
        if (isOpen && employeeData) {
            setFormData({
                firstName: employeeData.firstName || "",
                lastName: employeeData.lastName || "",
                email: employeeData.emailId || "",
                mobile: employeeData.mobile || "",
                department: employeeData.department || "",
                role: employeeData.roles_id  || "",
                shift: employeeData.shift_time || "",
                managerId: employeeData.manager_id || "",
            });
            setErrors({});
            setLoading(false);
        }
    }, [isOpen, employeeData]);

    const validateField = (name, value) => {
        if (value === null || value === undefined || value.toString().trim() === "")
            return "This field is required";

        if (name === "email" && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value))
            return "Enter a valid email";

        if (name === "mobile" && !/^\d{10}$/.test(value))
            return "Enter valid 10-digit number";

        return "";
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: validateField(name, value) || undefined }));
    };

    const handleDropdownChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: validateField(field, value) || undefined }));
    };

    const handleSubmit = async () => {
        const stepErrors = {};
        Object.keys(formData).forEach(f => {
            const err = validateField(f, formData[f]);
            if (err) stepErrors[f] = err;
        });
        if (Object.keys(stepErrors).length > 0) return setErrors(stepErrors);

        setLoading(true);
        try {
            const payload = {
                emp_id: employeeData.emp_id || employeeData.emp_code, // ensure API receives emp_id
                firstName: formData.firstName,
                lastName: formData.lastName,
                department: formData.department,
                shift: formData.shift,
                roles: formData.role,
                manager_id: formData.managerId
            };

            const res = await axios.put(
                "http://127.0.0.1:8000/registration/updateEmployee",
                payload
            );

            if (res.status === 200) {
                onSubmit(payload);
                onClose();
            }
        } catch (err) {
            console.error(err);
            toast.error("Update failed ❌");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Employee">
            <form className="flex flex-col gap-3 text-gray-700 text-sm">
                <div className="flex flex-wrap gap-3">
                    {["firstName", "lastName"].map(f => (
                        <div key={f} className="flex-1 relative">
                            <label className="absolute left-3 top-1 text-gray-400 text-xs font-medium">
                                {f === "firstName" ? "First Name" : "Last Name"}
                            </label>
                            <input
                                name={f}
                                value={formData[f]}
                                onChange={handleChange}
                                className={`${inputBaseClass} ${errors[f] ? "border-red-400" : "border-gray-300"}`}
                            />
                            {errors[f] && <p className="text-red-500 text-xs mt-1">{errors[f]}</p>}
                        </div>
                    ))}
                </div>

                <div className="flex flex-wrap gap-3 mt-2">
                    {["email", "mobile"].map(f => (
                        <div key={f} className="flex-1 relative">
                            <label className="absolute left-3 top-1 text-gray-400 text-xs font-medium">
                                {f === "email" ? "Email" : "Mobile"}
                            </label>
                            <input
                                type={f === "email" ? "email" : "tel"}
                                name={f}
                                value={formData[f]}
                                onChange={handleChange}
                                className={`${inputBaseClass} ${errors[f] ? "border-red-400" : "border-gray-300"}`}
                            />
                            {errors[f] && <p className="text-red-500 text-xs mt-1">{errors[f]}</p>}
                        </div>
                    ))}
                </div>

                <div className="flex-1">
                    <label className="text-gray-400 text-xs font-medium mb-1 block">Manager</label>
                    <FancyDropdown
                        options={managers.map(m => ({ label: `${m.firstName} ${m.lastName}`, value: m.emp_id }))}
                        value={formData.managerId}
                        placeholder="Select Manager"
                        onChange={val => handleDropdownChange("managerId", val)}
                        className={`${errors.managerId ? "border-red-400" : "border-gray-300"} rounded-md`}
                    />
                    {errors.managerId && <p className="text-red-500 text-xs mt-1">{errors.managerId}</p>}
                </div>

                <div className="flex flex-wrap gap-3 mt-2">
                    <div className="flex-1">
                        <label className="text-gray-400 text-xs font-medium mb-1 block">Department</label>
                        <FancyDropdown
                            options={["IT", "Trade", "Purchase", "Sales"]}
                            value={formData.department}
                            placeholder="Department"
                            onChange={val => handleDropdownChange("department", val)}
                            className={`${errors.department ? "border-red-400" : "border-gray-300"} rounded-md`}
                        />
                        {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
                    </div>

                    <div className="flex-1">
                        <label className="text-gray-400 text-xs font-medium mb-1 block">Role</label>
                        <FancyDropdown
                            options={roles.map(r => ({ label: r.role, value: r.role_id }))}
                            value={formData.role}
                            placeholder="Role"
                            onChange={val => handleDropdownChange("role", val)}
                            className={`${errors.role ? "border-red-400" : "border-gray-300"} rounded-md`}
                        />
                        {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
                    </div>

                    <div className="flex-1">
                        <label className="text-gray-400 text-xs font-medium mb-1 block">Shift</label>
                        <FancyDropdown
                            options={["Morning", "Evening"]}
                            value={formData.shift}
                            placeholder="Shift"
                            onChange={val => handleDropdownChange("shift", val)}
                            className={`${errors.shift ? "border-red-400" : "border-gray-300"} rounded-md`}
                        />
                        {errors.shift && <p className="text-red-500 text-xs mt-1">{errors.shift}</p>}
                    </div>
                </div>

                <div className="flex justify-end mt-3">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className={`px-4 py-1 rounded text-white ${loading ? "bg-purple-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"}`}
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Update"}
                    </button>
                </div>
            </form>
        </Modal>
    );
};
