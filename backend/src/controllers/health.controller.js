// Basic health status
const basicHealthStatus = (req, res) => {
    // Return the response
    res.status(200).json({
        success: true,
        message: "Api Endpoints are working properly :)"
    });
};

export { basicHealthStatus };
