/**
 * Settings File
 */

require("dotenv").config();

const config = {
	db:
	process.env.ENV_NAME == "dev"
	  ? "postgres://user:password@skylab_db:5432/demo_db"
			: "postgres://user:password@skylab_db:5432/demo_db",

	asset_paths: {
		'/public': '/public'
	},

	routes: {
		'/didarul': 'test'
	}
};

export default config;