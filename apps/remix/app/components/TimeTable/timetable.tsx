import { useMemo } from "react";
import type { TimeTableDay, TimeTableEvent } from "~/lib/types/timetableEvents";
import { cn } from "~/lib/utils/shadcn";
import { useBreakPointValue } from "~/lib/utils/tailwind";
import { TimetableView } from "~/lib/utils/timetableView";
import { TimetableEvent } from "./timetableEvent";
import { TimetableHeader } from "./timetableHeader";

type TimeTableProps = {
	eventsOfDay: TimeTableDay;
	className?: string;
};

export function Timetable({ eventsOfDay, className }: TimeTableProps) {
	const timetableView = useBreakPointValue({
		default: new TimetableView("09:30", "16:00", 0.13),
		lg: new TimetableView("09:30", "16:00", 0.18),
	});
	return (
		<div
			className={cn(
				"overflow-x-scroll max-h-[calc(100vh_-_18rem)] lg:max-h-[73vh] xl:max-h-[75vh] grid grid-cols-[50px_175px_175px_175px] lg:grid-cols-[100px_300px_300px_300px] gap-2",
				className,
			)}
		>
			<TimetableHeader className="sticky top-0 left-0 z-50">
				時間
			</TimetableHeader>
			<TimetableHeader className="sticky top-0 z-40">第1体育館</TimetableHeader>
			<TimetableHeader className="sticky top-0 z-40">第2体育館</TimetableHeader>
			<TimetableHeader className="sticky top-0 z-40">第6講義室</TimetableHeader>
			<div className="sticky text-center left-0 z-30 bg-white">
				{timetableView.timeTextList.map((t) => (
					<div
						key={t}
						className="bg-white"
						style={{
							marginTop: timetableView.top,
						}}
					>
						<div
							className={
								"ml-4 h-[1px] absolute bg-gray-400 -z-10 w-[680px] lg:w-[1000px]"
							}
							style={{
								marginTop: timetableView.top,
								top: timetableView.fromTop(t.minute),
							}}
						/>
						<p
							className="text-xs lg:text-sm"
							style={{
								lineHeight: timetableView.timeTextHeightStyle,
							}}
						>
							{t}
						</p>
					</div>
				))}
			</div>
			<TimeTableEvents
				timetableView={timetableView}
				events={eventsOfDay.gym1}
			/>
			<TimeTableEvents
				timetableView={timetableView}
				events={eventsOfDay.gym2}
			/>
			<TimeTableEvents
				timetableView={timetableView}
				events={eventsOfDay.lectureRoom6}
			/>
		</div>
	);
}

type TimeTableEventsProps = {
	timetableView: TimetableView;
	events: TimeTableEvent[];
};
function TimeTableEvents({ timetableView, events }: TimeTableEventsProps) {
	return (
		<div
			className="relative z-20"
			style={{
				marginTop: timetableView.top,
			}}
		>
			{events.map((e) => (
				<TimetableEvent
					key={`${e.startTime}${e.finishTime}`}
					className="absolute w-full"
					style={{
						height: timetableView.height(e.lengthMinute),
						marginTop: timetableView.fromTop(e.startMinute),
					}}
					event={e}
				/>
			))}
		</div>
	);
}
