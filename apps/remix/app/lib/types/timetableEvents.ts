export type TimeText = `${number}${number}:${number}${number}`;

export type TimeTableDay = {
	date: string;
	gym1: TimeTableEvent[];
	gym2: TimeTableEvent[];
	lectureRoom6: TimeTableEvent[];
};

export type TimeTableEvent = {
	startTime: TimeText;
	startMinute: number;
	finishTime: TimeText;
	finishMinute: number;
	lengthMinute: number;
	title: string;
	description?: string;
};

export type TimeTableEvents = {
	day1: TimeTableDay;
	day2: TimeTableDay;
};
