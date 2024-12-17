import { Link } from "@remix-run/react";
import type { FC } from "react";
import { DashboardRoutes } from "~/lib/const/links";

export const Header: FC = () => {
	return (
		<header className="sticky flex items-center px-10 py-3 shadow-md rounded-xl justify-center lg:justify-normal">
			<Link to={DashboardRoutes.Home.route}>
				<h1 className="text-3xl">祇園祭 ダッシュボード</h1>
			</Link>
			<div className="hidden lg:block flex-grow" />
			<div className="hidden lg:block" />
		</header>
	);
};
