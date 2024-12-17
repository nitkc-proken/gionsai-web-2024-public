import { Link } from "@remix-run/react";
import type { FC } from "react";
import { Routes } from "~/lib/const/links";
import { Button } from "./ui/button";

const HeaderLinks = [
	Routes.Home,
	Routes.Greetings,
	Routes.Projects,
	Routes.Map,
	Routes.TimeTable,
	Routes.Access,
];

export const Header: FC = () => {
	return (
		<header className="sticky flex items-center px-10 py-3 shadow-md rounded-xl justify-center lg:justify-normal">
			<Link to={Routes.Home.route}>
				<h1 className="font-kiwimaru text-3xl">木更津高専 祇園祭</h1>
			</Link>
			<div className="hidden lg:block flex-grow" />
			<div className="hidden lg:block">
				{HeaderLinks.map((link) => (
					<Button key={link.route} className="mx-1" asChild variant={"ghost"}>
						<Link to={link.route}>{link.name}</Link>
					</Button>
				))}
			</div>
		</header>
	);
};
