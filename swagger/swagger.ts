const swaggerAutogen = require("swagger-autogen")({
	openapi: "3.0.0",
	autoHeaders: false,
});

const doc = {
	info: {
		title: "Circle API",
		description: "Welcome to Circle API!",
	},
	components: {
		securitySchemes: {
			bearerAuth: {
				type: "http",
				scheme: "bearer",
			},
		},
		"@schemas": {
			LoginDTO: {
				type: "object",
				properties: {
					email: {
						type: "string",
					},
					password: {
						type: "string",
					},
				},
			},
			RegisterDTO: {
				type: "object",
				properties: {
					fullName: {
						type: "string",
					},
					username: {
						type: "string",
					},
					email: {
						type: "string",
					},
					password: {
						type: "string",
					},
				},
			},
			ForgotPasswordDTO: {
				type: "object",
				properties: {
					email: {
						type: "string",
					},
				},
			},
			ResetPasswordDTO: {
				type: "object",
				properties: {
					oldPassword: {
						type: "string",
					},
					newPassword: {
						type: "string",
					},
				},
			},
			CreateThreadDTO: {
				type: "object",
				properties: {
					content: {
						type: "string",
					},
					images: {
						type: "file",
					},
				},
			},
			UpdateThreadDTO: {
				type: "object",
				properties: {
					content: {
						type: "string",
					},
					images: {
						type: "file",
					},
				},
			},
			DeleteThreadDTO: {
				type: "object",
				properties: {
					threadId: {
						type: "string",
					},
				},
			},
			CreateLikeDTO: {
				type: "object",
				properties: {
					threadId: {
						type: "string",
					},
				},
			},
			CreateReplyDTO: {
				type: "object",
				properties: {
					content: {
						type: "string",
					},
				},
			},
			CreateFollowDTO: {
				type: "object",
				properties: {
					id: {
						type: "string",
					},
				},
			},
			UpdateProfileDTO: {
				type: "object",
				properties: {
					fullname: {
						type: "string",
					},
					avatarUrl: {
						type: "file",
					},
					bannerUrl: {
						type: "file",
					},
					bio: {
						type: "string",
					},
					username: { type: "string" },
				},
			},
		},
	},
	host: "localhost:3000",
};

const outputFile = "./swagger-output.json";
const routes = ["src/index.ts"];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
  root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);
