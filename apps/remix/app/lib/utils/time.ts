import { zeroPadding } from "./text";

// HH:MM形式の文字列
export type TimeText = `${number}${number}:${number}${number}`;
const MINUTES_IN_A_DAY = 24 * 60;

export function generateTimeTextList(
	minuteInterval: number,
	startAt = 0,
	endAt: number = MINUTES_IN_A_DAY,
) {
	let m = startAt;
	const texts: TimeText[] = [];
	while (m <= endAt) {
		texts.push(minuteToTimeText(m));
		m += minuteInterval;
	}
	return texts;
}

/**
 * 分を時間のテキスト形式（HH:MM）に変換する関数です。
 *
 * @export
 * @param {number} minute - 変換する分です。
 * @returns {TimeText} 指定された分数を時間のテキスト（HH:MM）形式に変換した結果。
 */
export function minuteToTimeText(minute: number): TimeText {
	return `${zeroPadding(Math.floor(minute / 60), 2) as `${number}${number}`}:${zeroPadding(minute % 60, 2) as `${number}${number}`}`;
}

export function timeTextToMinute(timeText: TimeText): number {
	const [hour, minute] = timeText.split(":");
	return Number(hour) * 60 + Number(minute);
}

export function convertToMinuteFromDate(date: Date): number {
	const [hour, minute] = [date.getHours(), date.getMinutes()];
	return hour * 60 + minute;
}
