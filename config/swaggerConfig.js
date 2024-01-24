const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Library API",
			version: "1.0.0",
			description: "A simple Express Library API",
		},
		servers: [
			{
				url: "http://localhost:2405",
			},
		],
		components: {
			securitySchemes: {
				bearerAuth: {
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'JWT',
			  },
			},
		  },
	},
	apis: ["./routes/*.js"],
};

module.exports = {
    options
}