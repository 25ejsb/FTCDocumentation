import RedLinkBtn from "../components/buttons/RedLinkBtn.tsx";
import Search from "../components/Search.tsx";
import Footer from "../islands/Footer.tsx";
import Navbar from "../islands/Navbar.tsx";

export default function Documentation() {
	return (
		<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0"
				/>
				<title>Documentation - FTC Gann Documentation</title>
			</head>
			<body class="font-forum">
				<section class="py-[10rem] flex flex-col justify-center items-center bg-[linear-gradient(to_right_bottom,rgba(0,0,0,0.2),rgba(0,0,0,0.2)),url('https://images.squarespace-cdn.com/content/v1/59650f73be659443d46c1424/1572873958474-0QVQHLE9CFDQIXL7Z1XZ/gann-robotics-lab.jpg')] bg-cover bg-center space-y-4">
					<div class="space-y-4 flex flex-col justify-center items-center">
						<h1 class="text-slate-200 font-bold uppercase text-7xl tracking-wider text-shadow-mdwhite">
							RABBI Documentation
						</h1>
						<p class="font-semibold text-red-900 text-3xl text-shadow-mdwhite capitalize w-[50rem] text-center">
							Build your robot with anything you need from our
							giant codespace, and keep it simple.
						</p>
						<Search />
						<div class="flex space-x-4">
							<RedLinkBtn
								link="/documentation/getStarted"
								text="Get Started"
							/>
							<RedLinkBtn link="/forums" text="Forums & Support">
							</RedLinkBtn>
						</div>
					</div>
				</section>
				<section
					id="pages"
					class="p-[6rem] flex justify-center items-center flex-col space-y-4"
				>
					<h1 class="text-red-900 text-5xl font-semibold tracking-wide">
						Documentation Sections
					</h1>
					<div class="flex space-y-4 space-x-4">
						<div class="w-[12rem] h-[7.5rem] bg-red-900 rounded-[2rem] flex justify-center items-center hover:translate-y-[-0.5rem] active:translate-y-2 hover:shadow-mdblack transition-all">
							<a
								href="/adminpage"
								class="w-full text-center text-white text-2xl"
							>
								+ Add Section
							</a>
						</div>
					</div>
				</section>
				<Navbar noBackgroundOnStart={true} />
				<Footer />
			</body>
		</html>
	);
}
