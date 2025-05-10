const { genrateStreamToken } = require("../db/stream");

module.exports ={
    getStreamToken: async (req, res) => {
        try{
            const token = genrateStreamToken(req.user._id);

            res.status(200).json({
                    token
            });

        }catch (error) {
            console.error("Error in getStreamToken:", error);
            res.status(500).json({
                status: "error",
                message: "Internal Server Error",
            });
        }
    },
}