import { PUBLIC_ENV } from "./env";

// 現在時刻を取得する関数 デバッグ用に環境変数で指定した日時を返す
export const getCurrentDate = () =>
	PUBLIC_ENV.DEBUG_DATE ? new Date(PUBLIC_ENV.DEBUG_DATE) : new Date();

// イベントの日時
export const EventDates = [
	new Date(2024, 11 - 1, 2),
	new Date(2024, 11 - 1, 4),
] as const;

// イベント中かどうかを返す関数
export const isDuringEvent = (date?: Date) => {
	const now = date ?? getCurrentDate();
	return EventDates[0] <= now && now < EventDates[1];
};
