import { type LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Routes, generatePath } from "../const/links";
import { UserRepository } from "../repositories/userRepository";
import type { Group, User } from "../types/user";

export function dashboardLoader<T>(): { user: User } & T;
export function dashboardLoader<T>(
	loader: (params: LoaderFunctionArgs, user: User) => Promise<T> | T,
): {
	user: User;
} & T;

// dashboard共通のloader関数
// ログインしていない場合はログインページにリダイレクトする
// ログインしている場合は、loader関数を実行し、その結果をuserと合わせてjsonで返す
export function dashboardLoader<T>(
	loader?: (params: LoaderFunctionArgs, user: User) => Promise<T> | T,
) {
	return async (args: LoaderFunctionArgs) => {
		const { request, params } = args;
		const path = new URL(request.url).pathname;
		const userResult = await UserRepository.getMemberData(
			request.headers.get("Cookie") ?? "",
		);
		if (!userResult.success) {
			return redirect(
				generatePath(Routes.Login, undefined, {
					redirect: path,
				}),
			);
		}
		const user = userResult.data;

		return json({
			user,
			...(loader ? await loader(args, user) : {}),
		});
	};
}
