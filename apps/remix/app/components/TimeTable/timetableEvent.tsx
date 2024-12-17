import { ChevronDown } from "lucide-react";
import type { HTMLAttributes } from "react";
import type { Event } from "~/generated/types/events.schema";
import { cn } from "~/lib/utils/shadcn";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

type TimetableEventProps = {
	event: Event;
} & HTMLAttributes<HTMLDivElement>;

export function TimetableEvent({
	event,
	className,
	...props
}: TimetableEventProps) {
	return (
		<div
			className={cn(
				"bg-elevated flex border-[1px] border-dashed border-gray-700 rounded-xl",
				className,
			)}
			{...props}
		>
			<div className="text-sm lg:text-base flex-grow text-center">
				<p className="font-bold font-genshin-gothic">{event.title}</p>
				<p className="text-xs lg:text-base">
					{event.startTime} ～ {event.finishTime}
				</p>
			</div>
			{event.description && (
				<Popover>
					<PopoverTrigger className="h-min mt-[5%] absolute right-0" asChild>
						<Button size={"icon"} variant={"ghost"}>
							<ChevronDown size={24} />
						</Button>
					</PopoverTrigger>
					<PopoverContent>
						<div className="w-max p-2 lg:p-4 whitespace-pre-wrap font-genshin-gothic-mono">
							{event.description}
						</div>
					</PopoverContent>
				</Popover>
			)}
		</div>
	);
}
