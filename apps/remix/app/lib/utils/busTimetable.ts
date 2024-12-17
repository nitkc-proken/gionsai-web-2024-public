import type { BusTimetable } from "~/generated/types/bus.schema";

export type GroupedBusTimetableData = Record<
	number,
	{
		from: BusStop;
		to: BusStop;
		hourText: string;
		minuteText: string;
		minute: number;
	}[]
>;

type BusStop = {
	short: string;
	long: string;
};

export function groupingBusTimetableData(
	data: BusTimetable["toKosen" | "fromKosen"],
) {
	const destMap = {
		east: {
			short: "東",
			long: "東口",
		},
		west: {
			short: "西",
			long: "西口",
		},
		front: {
			short: "前",
			long: "高専前",
		},
		back: {
			short: "裏",
			long: "高専裏",
		},
	} as const satisfies Record<
		BusTimetable["toKosen" | "fromKosen"][number]["from" | "to"],
		BusStop
	>;
	const flatten = data
		.flatMap((d) =>
			d.time.map((t) => {
				const splitted = t.split(":");
				const timeMinute =
					Number.parseInt(splitted[0]) * 60 + Number.parseInt(splitted[1]);
				return {
					from: destMap[d.from],
					to: destMap[d.to],
					hourText: splitted[0],
					minuteText: splitted[1],
					minute: timeMinute,
				};
			}),
		)
		.sort((a, b) => a.minute - b.minute);
	// grouping flatten by hour of time
	const grouped = flatten.reduce((acc, cur) => {
		const hour = Number.parseInt(cur.hourText);
		if (!acc[hour]) {
			acc[hour] = [];
		}
		acc[hour].push(cur);
		return acc;
	}, {} as GroupedBusTimetableData);
	return grouped;
}
