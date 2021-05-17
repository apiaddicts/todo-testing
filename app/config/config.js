var config = {
	port: process.env.PORT || 3001,
	db: process.env.MONGOLAB_URI || "mongodb://localhost/todoapi"
}

module.exports = config;
