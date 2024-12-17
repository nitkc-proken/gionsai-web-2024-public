import { createContext, useContext } from "react";
import type { Event, Events } from "~/generated/types/events.schema";
import type { TimeTableEvent, TimeTableEvents } from "../types/timetableEvents";
import { type TimeText, generateTimeTextList, timeTextToMinute } from "./time";

type TimeTextWithMinute = TimeText & { minute: number };

export class TimetableView {
	readonly startAtMinute: number;
	readonly endAtMinute: number;
	readonly timeTextList: TimeTextWithMinute[];
	/**
	 * @param {TimeText} [startAt="00:00"] - The start time in time format.
	 * @param {TimeText} [endAt="24:00"] - The end time in time format.
	 * @param {number} [scale=0.1] - The scale value in rem.
	 * @param {number} [minuteInterval=30] - The interval between minutes.
	 * @param {number} [timeTextHeight=1] - The height of the time text in rem.
	 *
	 * @ignore 自動Docs作成便利ね〜
	 */
	constructor(
		startAt: TimeText = "00:00",
		endAt: TimeText = "24:00",
		public scale = 0.1, //rem
		public minuteInterval = 30, //min
		public timeTextHeight = 1, //rem
	) {
		this.startAtMinute = timeTextToMinute(startAt);
		this.endAtMinute = timeTextToMinute(endAt);
		this.timeTextList = generateTimeTextList(
			this.minuteInterval,
			this.startAtMinute,
			this.endAtMinute,
		).map((t) => Object.assign(t, { minute: timeTextToMinute(t) }));
	}
	get timeTextHeightStyle() {
		return `${this.timeTextHeight}rem`;
	}

	get top() {
		return `${this.scale * this.minuteInterval}rem`;
	}

	fromTop(minute: number) {
		return `${
			(minute - this.startAtMinute) * this.scale +
			(this.timeTextHeight / 2 +
				(minute - this.startAtMinute) / this.minuteInterval)
		}rem`;
	}

	height(minute: number) {
		return `${minute * this.scale + (minute / this.minuteInterval) * this.timeTextHeight}rem`;
	}
}

export const TimetableContext = createContext(new TimetableView());

export function useTimetable() {
	return useContext(TimetableContext);
}

function eventToTimeTableEvent(e: Event): TimeTableEvent {
	const startMinute = timeTextToMinute(e.startTime);
	const finishMinute = timeTextToMinute(e.finishTime);
	return {
		...e,
		startMinute,
		finishMinute,
		lengthMinute: finishMinute - startMinute,
	};
}

export function eventsToTimeTableEvents(events: Events): TimeTableEvents {
	return {
		day1: {
			date: events.day1.date,
			gym1: events.day1.gym1.map(eventToTimeTableEvent),
			gym2: events.day1.gym2.map(eventToTimeTableEvent),
			lectureRoom6: events.day1.lectureRoom6.map(eventToTimeTableEvent),
		},
		day2: {
			date: events.day2.date,
			gym1: events.day2.gym1.map(eventToTimeTableEvent),
			gym2: events.day2.gym2.map(eventToTimeTableEvent),
			lectureRoom6: events.day2.lectureRoom6.map(eventToTimeTableEvent),
		},
	};
}
