import { Handlers, PageProps } from "$fresh/server.ts";
import ClassicButton from "../components/buttons/ClassicButton.tsx";
import DefaultInput from "../components/inputs/DefaultInput.tsx";
import ClassicText from "../components/texts/ClassicText.tsx";
import Footer from "../islands/Footer.tsx";
import Navbar from "../islands/Navbar.tsx";
import { kv, User } from "../utils/db.ts";
import { CtxState } from "./_middleware.ts";

interface Data {
	"isLoggedIn": boolean;
	"error"?: string;
	"user": User;
}

export const handler: Handlers<Data, CtxState> = {
	async GET(req, res) {
		if (res.state.session.isAuthenticated) {
			const user = (await kv.get<User>([
				"users",
				res.state.session.email as string,
			])).value;
			return res.render({ isLoggedIn: true, "user": user as User });
		}
		return new Response(null, {
			status: 302,
			headers: { "Location": "/" },
		});
	},
};

export default function AdminPage({ data }: PageProps<Data>) {
	return (
		<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0"
				/>
				<title>Admin Page - FTC Gann Documentation</title>
			</head>
			<body class="font-forum">
				<section class="py-[8rem] px-[12rem] flex justify-center items-center flex-col">
					<h1 class="text-red-900 text-7xl uppercase text-shadow-mdblack mb-12">
						Admin Page
					</h1>
					<div class="flex space-x-4 w-full">
						<div class="w-[15rem] flex flex-col justify-center items-center">
							<img
								src={data.user.profilePicture}
								alt="Profile Picture"
								class="rounded-full w-full mb-2"
							/>
							<h1 class="text-2xl">@{data.user.username}</h1>
							<h2 class="text-red-900 font-bold">
								Admin Account
							</h2>
						</div>
						<div class="flex flex-col items-center w-full">
							<ClassicText text="Actions" class="text-5xl mb-4" />
							<div class="flex justify-center items-center space-x-4">
								<button
									style={`background-image: linear-gradient(to bottom, rgba(127, 29, 29, 0.1), rgba(127, 29, 29, 1)), url('https://www.thepublicdiscourse.com/wp-content/uploads/2023/09/BOOKS.jpg'); background-size: 150%; background-position: center; background-repeat: no-repeat`}
									class="flex text-white text-lg items-end justify-center text-center bg-red-900 w-[10rem] h-[7rem] p-4 rounded-2xl hover:shadow-mdblack hover:translate-y-2 transition-all"
									id="new-section"
								>
									+ New Section
								</button>
								<button
									style={`background-image: linear-gradient(to bottom, rgba(218, 160, 109, 0.1), rgba(218, 160, 109, 1)), url('https://miro.medium.com/v2/resize:fit:5120/1*42ebJizcUtZBNIZPmmMZ5Q.jpeg'); background-size: 120%; background-position: center; background-repeat: no-repeat`}
									class="flex text-white text-lg items-end justify-center text-center bg-red-900 w-[10rem] h-[7rem] p-4 rounded-2xl hover:shadow-mdblack hover:translate-y-2 transition-all"
									id="new-page"
								>
									+ New Page
								</button>
							</div>
							<form
								method="post"
								class="shadow-mdblack w-[25rem] h-[15rem] mt-4 hidden justify-center items-center flex-col"
								id="new-section-form"
							>
								<ClassicText
									text="New Section"
									class="text-3xl"
								/>
								<DefaultInput class="rounded-none text-2xl" />
								<ClassicButton text="Submit" type="submit">
								</ClassicButton>
							</form>
						</div>
					</div>
				</section>
				<script src="/js/adminpage.js"></script>
				<Navbar noBackgroundOnStart={false} />
				<Footer />
			</body>
		</html>
	);
}
