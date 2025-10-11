import jwt_decode from "jwt-decode";

const token = localStorage.getItem("access_token");
const user = token ? jwt_decode(token) : null;