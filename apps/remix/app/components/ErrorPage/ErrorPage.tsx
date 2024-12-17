import { Link, isRouteErrorResponse } from "@remix-run/react";
import { Header } from "~/components/header";
import MobileBottombar from "~/components/mobileBottombar";
import { LinkButton } from "./../LinkButton/linkButton";
export type ErrorContentProps = {
	title: string;
	message: string;
};

export type ErProps = {
	error: unknown;
};

function ErContent({ title, message }: ErrorContentProps) {
	return (
		<div className={"flex justify-center mt-6 lg:mt-10"}>
			<div className="text-center">
				<h1 className={"text-2xl md:text-3xl"}>{title}</h1>
				<p className={"text-sm md:text-base mt-6"}>{message}</p>
				<LinkButton className={"mt-12"} to={"/"}>
					トップページに戻る
				</LinkButton>
			</div>
		</div>
	);
}

export default function ErrorPage({ error }: ErProps) {
	let message = "何らかのエラーが発生しました。";
	let title = "エラー";
	if (isRouteErrorResponse(error)) {
		title = `${error.status} ${error.statusText}`;
		switch (error.status) {
			case 400:
				message = "サーバーがリクエストを処理できませんでした。";
				break;
			case 401:
				message = "認証に失敗しました。";
				break;
			case 403:
				message = "許可がありません。";
				break;
			case 404:
				message =
					"ページが見つかりませんでした。\nページが移動したか削除された可能性があります。";
				break;
			case 500:
				message = "サーバーでエラーが発生しました。";
				break;
			default:
				message = "何らかのエラーが発生しました。";
				break;
		}
	}

	return (
		<>
			<Header />
			<ErContent title={title} message={message} />
			<div className="h-20 lg:hidden" />
			<MobileBottombar
				onNotificationClick={() => {
					//TODO: Implement notification click
				}}
			/>
		</>
	);
}
