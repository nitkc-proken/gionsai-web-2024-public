import { Link } from "@remix-run/react";
import { ChevronRight, RefreshCw } from "lucide-react";
import { useMemo } from "react";
import { Routes, generatePath } from "~/lib/const/links";
import type { Notification } from "~/lib/types/notification";
import { cn } from "~/lib/utils/shadcn";
import { Button } from "../ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";

type NotificationCardProps = {
	className?: string;
	showProjectName?: boolean;
	header: React.ReactNode;
	notifications: Notification[];
	onUpdate: () => void;
};

export function NotificationCard({
	className,
	showProjectName,
	header,
	notifications,
	onUpdate,
}: NotificationCardProps) {
	return (
		<div className={cn("flex flex-col bg-elevated p-3 rounded-xl", className)}>
			<div className="flex justify-between items-center bg-slate-700 text-white px-3 rounded-xl">
				<span className="font-bold text-lg">{header}</span>
				<Button variant={"ghost"} size={"icon"} onClick={onUpdate}>
					<RefreshCw />
				</Button>
			</div>
			<div className="space-y-2 mt-2 rounded-xl grow overflow-y-scroll overflow-x-hidden">
				{notifications.length > 0 ? (
					notifications.map((notification) => (
						<NotificationItem
							showProjectName={showProjectName}
							key={notification.id}
							notification={notification}
						/>
					))
				) : (
					<div className="text-center text-gray-500">お知らせはありません</div>
				)}
			</div>
		</div>
	);
}

type NotificationItemProps = {
	showProjectName?: boolean;
	notification: Notification;
};

function NotificationItem({
	showProjectName,
	notification,
}: NotificationItemProps) {
	const createdString = useMemo(() => {
		const date = new Date(notification.createdAt);
		return date.toLocaleString("ja-JP");
	}, [notification.createdAt]);
	return (
		<Dialog>
			<DialogTrigger className="w-full bg-white p-3 rounded-xl hover:bg-gray-100">
				<div className="text-gray-500 flex justify-between items-center text-xs">
					{showProjectName ? (
						<span className="font-bold">{notification.project.name}</span>
					) : (
						<div />
					)}
					{createdString}
				</div>
				<div className="flex justify-between py-1">
					<div className="text-ellipsis whitespace-nowrap overflow-x-hidden font-bold">
						{notification.title}
					</div>
					<ChevronRight size={24} className="min-w-max" />
				</div>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{notification.title}</DialogTitle>
					<DialogDescription className="flex justify-between">
						<Link
							to={generatePath(Routes.ProjectDetail, {
								project: notification.project.alias,
							})}
							className="hover:underline"
						>
							{showProjectName && notification.project.name}
						</Link>
						<div>{createdString}</div>
					</DialogDescription>
				</DialogHeader>
				<p className="mt-2 overflow-x-hidden break-words whitespace-pre-wrap">
					{notification.content}
				</p>
			</DialogContent>
		</Dialog>
	);
}
