import jwt_decode from "jwt-decode"; // npm install jwt-decode

export const getDecodedToken = (token) => {
  if (!token) return null;
  try {
    return jwt_decode(token); // returns payload
  } catch (error) {
    return null;
  }
};

export const getUserRole = (token) => {
  const decoded = getDecodedToken(token);
  return decoded ? decoded.role : null;
};
