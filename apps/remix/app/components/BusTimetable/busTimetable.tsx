import type React from "react";
import { type PropsWithChildren, useMemo } from "react";
import type { GroupedBusTimetableData } from "~/lib/utils/busTimetable";
import { isDuringEvent } from "~/lib/utils/date";
import { cn } from "~/lib/utils/shadcn";

type BusTimetableProps = {
	direction: React.ReactNode;
	timetableDescription: React.ReactNode;
	data: GroupedBusTimetableData;
	currentDate: Date;
};
export function BusTimetable({
	direction,
	data,
	currentDate,
	timetableDescription,
}: BusTimetableProps) {
	const nextBus = useMemo(() => {
		return isDuringEvent()
			? Object.values(data)
					.flat()
					.find((time) => {
						const date = new Date(currentDate);
						date.setHours(Math.floor(time.minute / 60), time.minute % 60);
						return date > currentDate;
					})
			: undefined;
	}, [data, currentDate]);
	return (
		<div className="w-full space-y-5">
			<div className="sticky top-0 p-2 md:p-8 space-y-5 bg-white">
				<h2 className="text-center text-2xl font-bold">{direction}</h2>
				{nextBus && (
					<div className="p-5 bg-slate-700 text-white text-center rounded-md">
						次のバスは
						<span className="text-4xl mx-2">
							{nextBus?.hourText}:{nextBus?.minuteText}
						</span>
						{nextBus?.from.long} 発
					</div>
				)}
			</div>
			<div className="rounded-xl bg-elevated font-genshin-gothic-mono">
				<Row className="rounded-t-xl text-xl font-semibold bg-slate-700 text-white">
					{timetableDescription}
				</Row>
				{Object.entries(data).map(([hour, times], i) => (
					<Row key={hour} className={i % 2 === 0 ? "bg-white" : "bg-elevated"}>
						<div className="text-2xl lg:text-3xl font-bold">
							{times[0].hourText}
						</div>
						<div className="space-x-2">
							{times.map((time) => (
								<Item
									key={time.minute}
									data={time}
									highlight={nextBus && nextBus.minute === time.minute}
								/>
							))}
						</div>
					</Row>
				))}
			</div>
		</div>
	);
}

function Row(props: { className?: string } & PropsWithChildren) {
	return (
		<div
			className={cn(
				"flex items-center gap-10 px-2 py-1 border-collapse border-[1px]  border-gray-100",
				props.className,
			)}
		>
			{props.children}
		</div>
	);
}

function Item({
	data,
	highlight,
}: { data: GroupedBusTimetableData[number][number]; highlight?: boolean }) {
	return (
		<div
			className={cn(
				"inline-block text-center w-10",
				highlight && "outline-2 outline outline-red-400",
			)}
		>
			<div className="font-bold">{data.minuteText}</div>
			<div className="text-sm">{data.from.short}</div>
		</div>
	);
}
