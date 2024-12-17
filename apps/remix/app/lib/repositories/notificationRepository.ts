import { rpc } from "~/lib/utils/hc";
import type { Notification } from "../types/notification";
import { mock, mockWithArray } from "../utils/mock";
type NotificationRepository = {
	getAllNotifications(): Promise<Notification[]>;
	getProjectNotifications(projectAlias: string): Promise<Notification[]>;
};

const NotificationRepositoryImpl = {
	async getAllNotifications() {
		const res = await rpc.api.notifications.$get({
			query: {
				order: "desc",
			},
		});
		if (!res.ok) {
			return [];
		}
		const result = await res.json();
		if (!result) {
			return [];
		}

		return result;
	},
	async getProjectNotifications(projectAlias: string) {
		const res = await rpc.api.notifications.$get({
			query: {
				order: "desc",
				project: projectAlias,
			},
		});
		if (!res.ok) {
			return [];
		}
		const result = await res.json();
		if (!result) {
			return [];
		}

		return result;
	},
} satisfies NotificationRepository;

// モック実装
const NotificationRepositoryMock = mockWithArray<
	Notification,
	NotificationRepository
>(
	"notification", // ← この文字列はモックの名前。モックのデータを保存するために使われる。一意な名前にすること。
	// ↓dbは配列。これにデータを入れたり削除したりすれば疑似DBのようになる。
	(db) =>
		({
			async getAllNotifications() {
				return db;
			},
			async getProjectNotifications(projectId: number | string) {
				return db.filter((i) => i.projectId === Number(projectId));
			},
		}) satisfies NotificationRepository,
	// 最初から入れておくデータ(空でもいい)
	[
		{
			id: 1,
			title: "テスト用1",
			projectId: 10,
			project: {
				id: 10,
				name: "プログラミング研究同好会",
				alias: "A-07",
				location: "第二研究棟 1階 スポーツ化学実験室",
			},
			content: "祇園祭webはプログラミング研究同好会によって制作されました。",
			visible: true,
			createdAt: new Date().toString(),
			updatedAt: new Date().toString(),
		},
		{
			id: 2,
			title: "テスト用2",
			projectId: 99,
			project: {
				id: 10,
				name: "テスト規格",
				alias: "Z-99",
				location: "テスト用",
			},
			content: "テストメッセージ",
			visible: true,
			createdAt: new Date().toString(),
			updatedAt: new Date().toString(),
		},
	],
);

// mock は .env 内の環境変数 `USE_MOCK` によってモックを使うかどうか切り替える関数
export default mock(NotificationRepositoryImpl, NotificationRepositoryMock);
