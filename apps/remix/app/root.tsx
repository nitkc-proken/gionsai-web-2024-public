import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	json,
	useLoaderData,
} from "@remix-run/react";
import "./globals.css";
import { useRouteError } from "@remix-run/react";
import fontStyle from "~/assets/styles/fonts.css?url";
import ErrorPage from "~/components/ErrorPage/ErrorPage";
import type { PublicEnv } from "./@types/env";
import { PUBLIC_ENV } from "./lib/utils/env";

export async function loader() {
	return json({
		// ブラウザに公開する環境変数を入れる
		ENV:
			typeof document === "undefined"
				? ({
						APP_HOST: PUBLIC_ENV.APP_HOST as string,
						USE_MOCK: PUBLIC_ENV.USE_MOCK,
						DEBUG_DATE: PUBLIC_ENV.DEBUG_DATE,
					} satisfies PublicEnv)
				: {},
	});
}

export function ErrorBoundary() {
	const error = useRouteError();
	return <ErrorPage error={error} />;
}

export function Layout({ children }: { children: React.ReactNode }) {
	const data = useLoaderData<typeof loader>();
	return (
		<html lang="ja">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" sizes="32x32" />
				<link rel="icon" href="/icon-512.png" type="image/png" />
				<link rel="apple-touch-icon" href="/icon-180.png" />

				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin="anonymous"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Kiwi+Maru&display=swap&text=木更津高専祇園祭"
					rel="stylesheet"
				/>
				<link href={fontStyle} rel="stylesheet" />
				<link
					href="https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic&display=swap&text=あつまれこうせんの森"
					rel="stylesheet"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
					rel="stylesheet"
				/>

				<Meta />
				<Links />
			</head>
			<body>
				{children}
				<ScrollRestoration />
				{
					<script
						// 公開する環境変数をwindows.ENVにセット
						// biome-ignore lint/security/noDangerouslySetInnerHtml: https://remix.run/docs/en/main/guides/envvars#browser-environment-variables
						dangerouslySetInnerHTML={{
							__html: `window.ENV = ${JSON.stringify(data?.ENV)} ?? {/* ENV_SPA_REPLACE_HERE */}`,
						}}
					/>
				}
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	return <Outlet />;
}
// https://remix.run/docs/en/main/route/should-revalidate#never-reloading-the-root
export const shouldRevalidate = () => false;
