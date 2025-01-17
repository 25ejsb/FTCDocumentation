// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_404 from "./routes/_404.tsx";
import * as $_app from "./routes/_app.tsx";
import * as $_middleware from "./routes/_middleware.ts";
import * as $account from "./routes/account.tsx";
import * as $adminpage from "./routes/adminpage.tsx";
import * as $api_changeDescription from "./routes/api/changeDescription.ts";
import * as $api_changeUsername from "./routes/api/changeUsername.ts";
import * as $api_deleteProfilePicture from "./routes/api/deleteProfilePicture.ts";
import * as $api_getSessionData from "./routes/api/getSessionData.ts";
import * as $api_logout from "./routes/api/logout.ts";
import * as $api_signup from "./routes/api/signup.ts";
import * as $auth_Authorize from "./routes/auth/Authorize.tsx";
import * as $auth_login from "./routes/auth/login.ts";
import * as $auth_mssignin from "./routes/auth/mssignin.tsx";
import * as $documentation from "./routes/documentation.tsx";
import * as $documentation_section_item_ from "./routes/documentation/[section]/[item].tsx";
import * as $index from "./routes/index.tsx";
import * as $login from "./routes/login.tsx";
import * as $signup from "./routes/signup.tsx";
import * as $Counter from "./islands/Counter.tsx";
import * as $Footer from "./islands/Footer.tsx";
import * as $Navbar from "./islands/Navbar.tsx";
import type { Manifest } from "$fresh/server.ts";

const manifest = {
	routes: {
		"./routes/_404.tsx": $_404,
		"./routes/_app.tsx": $_app,
		"./routes/_middleware.ts": $_middleware,
		"./routes/account.tsx": $account,
		"./routes/adminpage.tsx": $adminpage,
		"./routes/api/changeDescription.ts": $api_changeDescription,
		"./routes/api/changeUsername.ts": $api_changeUsername,
		"./routes/api/deleteProfilePicture.ts": $api_deleteProfilePicture,
		"./routes/api/getSessionData.ts": $api_getSessionData,
		"./routes/api/logout.ts": $api_logout,
		"./routes/api/signup.ts": $api_signup,
		"./routes/auth/Authorize.tsx": $auth_Authorize,
		"./routes/auth/login.ts": $auth_login,
		"./routes/auth/mssignin.tsx": $auth_mssignin,
		"./routes/documentation.tsx": $documentation,
		"./routes/documentation/[section]/[item].tsx":
			$documentation_section_item_,
		"./routes/index.tsx": $index,
		"./routes/login.tsx": $login,
		"./routes/signup.tsx": $signup,
	},
	islands: {
		"./islands/Counter.tsx": $Counter,
		"./islands/Footer.tsx": $Footer,
		"./islands/Navbar.tsx": $Navbar,
	},
	baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
