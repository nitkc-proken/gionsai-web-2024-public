import { Settings } from "lucide-react";

export const Routes = {
	Home: {
		route: "/",
		name: "ホーム",
	},
	Greetings: {
		route: "/greetings",
		name: "ご挨拶",
	},
	EatingRules: {
		route: "/eating-rules",
		name: "飲食ルール",
	},
	Projects: {
		route: "/projects",
		name: "企画一覧",
	},
	ProjectDetail: {
		route: "/projects/$project",
		name: "企画詳細",
		params: ["project"],
	},
	Access: {
		route: "/access",
		name: "アクセス",
	},
	TimeTable: {
		route: "/timetable",
		name: "タイムテーブル",
	},
	Map: {
		route: "/map",
		name: "構内地図",
	},
	Sponsors: {
		route: "/sponsors",
		name: "ご協賛",
	},
	Register: {
		route: "/auth/register",
		name: "ユーザー登録",
	},
	Login: {
		route: "/auth/login",
		query: ["redirect"],
		name: "ログイン",
	},
	Logout: {
		route: "/auth/logout",
		name: "ログアウト",
	},
} as const satisfies Record<string, Route>;

export const DashboardRoutes = {
	Home: {
		route: "/dashboard",
		name: "ホーム",
	},
	Invite: {
		route: "/dashboard/invite/$code",
		name: "招待",
		params: ["code"],
	},
	Group: {
		route: "/dashboard/groups/$group",
		name: "団体",
		params: ["group"],
	},
	GroupMembers: {
		route: "/dashboard/groups/$group/members",
		name: "メンバー",
		params: ["group"],
	},
	Project: {
		route: "/dashboard/groups/$group/projects/$project",
		name: "企画",
		params: ["group", "project"],
	},
	ProjectNotification: {
		route: "/dashboard/groups/$group/projects/$project/notifications",
		name: "企画お知らせ",
		params: ["group", "project"],
	},
	User: {
		route: "/dashboard/user",
		name: "ユーザー情報・設定",
	},
	UserPassword: {
		route: "/dashboard/user/password",
		name: "パスワード変更",
	},
} as const satisfies Record<string, Route>;

export function generatePath<Q extends string[], P extends string[]>(
	route: Route<Q, P>,
	params: Record<P[number], string>,
	query?: Record<Q[number], string>,
): string;
export function generatePath<Q extends string[], P extends []>(
	route: Route<Q, P>,
	params?: undefined,
	query?: Record<Q[number], string>,
): string;

export function generatePath<Q extends string[], P extends string[]>(
	route: Route<Q, P>,
	params?: Record<P[number], string>,
	query?: Record<Q[number], string>,
) {
	let routePath: string = route.route;
	if (params) {
		routePath = Object.entries<string>(params).reduce<string>(
			(acc, [key, value]) => acc.replace(`$${key}`, value),
			routePath,
		);
	}
	if (query) {
		const queryString = new URLSearchParams(query).toString();
		routePath = `${routePath}?${queryString}`;
	}
	return routePath;
}

// 許可されたリダイレクト先
export const allowedRedirects = [
	...Object.values(Routes).map((route) => route.route as string),
	...Object.values(DashboardRoutes).map((route) => route.route as string),
];

export type Route<
	Q extends string[] = string[],
	P extends string[] = string[],
> = {
	route: `/${string}`;
	name: string;
	query?: Q;
	params?: P;
};
