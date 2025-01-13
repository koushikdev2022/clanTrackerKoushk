const axios = require("axios");


const isUserAuthenticateMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided", status: false, status_code: 401 });
    }

    const url = process.env.MAIN_SERVER;
    const response = await axios.post(
      `${url}/user/token`,
      {}, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response?.data?.status_code === 422) {
      return res.status(422).json({
        message: "Unprocessable Entity",
        status: false,
        status_code: 422,
        error: response?.data?.error || "Invalid token",
      });
    }

    
    req.user = response?.data?.data || null;
    next(); 

  } catch (error) {
    console.error("Error in isUserAuthenticateMiddleware:", error);
    const status = error.response?.status || 500;
    const message =
      error.response?.data?.message || error.message || "INTERNAL_SERVER_ERROR";

    return res.status(status).json({
      message,
      status: false,
      status_code: status,
    });
  }
};

module.exports = isUserAuthenticateMiddleware;
