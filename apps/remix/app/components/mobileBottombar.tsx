import { Link } from "@remix-run/react";
import {
	Bell,
	CalendarClock,
	Ellipsis,
	HomeIcon,
	MapIcon,
	Search,
	Speech,
	TrainFront,
	Utensils,
} from "lucide-react";
import type { PropsWithChildren } from "react";
import { type Route, Routes } from "~/lib/const/links";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const items: BottombarItemProps[] = [
	{
		key: "home",
		icon: <HomeIcon size={30} />,
		children: "ホーム",
		link: Routes.Home,
		type: "item",
	},
	{
		key: "projects",
		icon: <Search size={30} />,
		children: "企画一覧",
		link: Routes.Projects,
		type: "item",
	},
	{
		type: "item",
		key: "timetable",
		icon: <CalendarClock size={30} />,
		link: Routes.TimeTable,
		children: "イベント",
	},
	{
		type: "item",
		key: "map",
		icon: <MapIcon size={30} />,
		link: Routes.Map,
		children: "地図",
	},
	{
		key: "others",
		icon: <Ellipsis size={30} />,
		children: "その他",
		type: "menu",
		links: [
			{
				type: "item",
				key: "greetings",
				icon: <Speech />,
				link: Routes.Greetings,
				children: "ご挨拶",
			},
			{
				type: "item",
				key: "access",
				icon: <TrainFront />,
				link: Routes.Access,
				children: "アクセス",
			},
		],
	},
] as const;

type MobileBottombarProps = {
	onNotificationClick: () => void;
};

export default function MobileBottombar(props: MobileBottombarProps) {
	return (
		<div className="lg:hidden fixed bottom-0 flex justify-around bg-secondary w-full z-50">
			{items.map((item) => (
				<BottombarItem
					{...item}
					key={item.key}
					// onClickは外から受取りたいので、ここで渡す
					{...(item.type === "custom" && item.key === "notification"
						? { onClick: props.onNotificationClick }
						: undefined)}
				/>
			))}
		</div>
	);
}

type BottombarItem = {
	type: "item";
	key: string;
	icon: React.ReactNode;
	link: Route;
} & PropsWithChildren;

type BottombarMenu = {
	type: "menu";
	key: string;
	icon: React.ReactNode;
	links: BottombarItem[];
} & PropsWithChildren;

type BottombarItemCustom = {
	type: "custom";
	key: string;
	icon: React.ReactNode;
	onClick?: () => void;
} & PropsWithChildren;

type BottombarItemProps = BottombarItem | BottombarMenu | BottombarItemCustom;

function BottombarItem(props: BottombarItemProps) {
	if (props.type === "menu") {
		<div>
			{props.icon}
			{props.children}
		</div>;
		return (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<div className="rounded-md my-1">
						<div className="flex p-1 flex-col items-center bg-secondary hover:bg-secondary/90 h-full justify-between">
							{props.icon}
							{props.children}
						</div>
					</div>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					{props.links.map((link) => (
						<DropdownMenuItem key={link.key}>
							<Link to={link.link.route} className="inline-flex gap-3">
								{link.icon}
								{link.children}
							</Link>
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
		);
	}
	if (props.type === "custom") {
		return (
			<div className="rounded-md my-1">
				<div
					onClick={props.onClick}
					className="flex p-1 flex-col items-center bg-secondary hover:bg-secondary/90 h-full justify-between"
				>
					{props.icon}
					{props.children}
				</div>
			</div>
		);
	}
	return (
		<div className="rounded-md my-1">
			<Link
				to={props.link.route}
				className="flex p-1 flex-col items-center bg-secondary hover:bg-secondary/90 h-full justify-between"
			>
				{props.icon}
				{props.children}
			</Link>
		</div>
	);
}
