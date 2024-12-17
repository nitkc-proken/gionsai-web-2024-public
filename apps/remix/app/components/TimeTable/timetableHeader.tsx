import type { PropsWithChildren } from "react";
import { cn } from "~/lib/utils/shadcn";

type TimeTableHeaderProps = {
	className?: string;
} & PropsWithChildren;

export function TimetableHeader(props: TimeTableHeaderProps) {
	return (
		<div className={props.className}>
			<div className={"py-2 lg:p-5 rounded-xl bg-slate-700 text-white"}>
				<h1 className="text-lg break-keep text-center">{props.children}</h1>
			</div>
		</div>
	);
}
