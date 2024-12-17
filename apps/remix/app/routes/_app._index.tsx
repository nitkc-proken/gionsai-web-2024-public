import type {
	LinksFunction,
	LoaderFunctionArgs,
	MetaFunction,
} from "@remix-run/node";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import { BookOpen, ExternalLink, SquarePen } from "lucide-react";
import { LinkButton } from "~/components/LinkButton/linkButton";
import { Section } from "~/components/Section/section";
import { SubSection } from "~/components/Section/subSection";
import { Routes } from "~/lib/const/links";
import Logo from "../assets/images/top/gionsai_logo_white.webp";

import { SuperProjectAlias } from "@common/const/project";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { NotificationCard } from "~/components/Notification/NotificationCard";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "~/components/ui/carousel";
import notificationRepository from "~/lib/repositories/notificationRepository";

export const links: LinksFunction = () => {
	return [
		{
			rel: "preload",
			href: Logo,
			as: "image",
		},
	];
};

export const meta: MetaFunction = () => {
	return [
		{ title: "木更津高専 祇園祭 - ホーム" },
		{ name: "description", content: "木更津高専 祇園祭2024 Webサイト" },
	];
};
export async function loader({ params }: LoaderFunctionArgs) {
	const superNotifications =
		await notificationRepository.getProjectNotifications(SuperProjectAlias);
	const allNotifications = await notificationRepository.getAllNotifications();
	return { superNotifications, allNotifications };
}
export default function Index() {
	const loaderData = useLoaderData<typeof loader>();
	const [superNotifications, setSuperNotifications] = useState(
		loaderData.superNotifications,
	);
	const [allNotifications, setAllNotifications] = useState(
		loaderData.allNotifications,
	);
	return (
		<main>
			<div className="flex justify-center items-center">
				<Carousel
					plugins={[
						Autoplay({
							delay: 4000,
							stopOnInteraction: false,
						}),
						Fade(),
					]}
					opts={{
						loop: true,
						containScroll: false,
					}}
					className="w-[100vw]"
				>
					<CarouselContent className="max-h-[40vh] sm:max-h-full h-[calc(100vh-4rem)]">
						<CarouselItem>
							<img
								src={Logo}
								className="m-auto w-2/3 max-w-lg h-full object-contain invert"
							/>
						</CarouselItem>
						<CarouselItem>
							<img
								src={"https://placehold.jp/1280x903.png"}
								loading="lazy"
								className="w-full h-full m-auto object-cover"
							/>
						</CarouselItem>
						<CarouselItem>
							<img
								src={"https://placehold.jp/1280x903.png"}
								loading="lazy"
								className="w-full h-full m-auto object-cover"
							/>
						</CarouselItem>
						<CarouselItem>
							<img
								src={"https://placehold.jp/1280x903.png"}
								loading="lazy"
								className="w-full h-full m-auto object-cover"
							/>
						</CarouselItem>
						<CarouselItem>
							<img
								src={"https://placehold.jp/1280x903.png"}
								loading="lazy"
								className="w-full h-full m-auto object-cover"
							/>
						</CarouselItem>
						<CarouselItem>
							<img
								src={"https://placehold.jp/1280x903.png"}
								loading="lazy"
								className="w-full h-full m-auto object-cover"
							/>
						</CarouselItem>
					</CarouselContent>
				</Carousel>

				<div className="absolute hidden lg:flex w-full mt-[70vh] h-[calc(100vh-4rem-70vh)] ">
					<div
						className={
							"rounded-xl shadow-md py-5 flex w-2/5 m-auto justify-evenly relative backdrop-blur-xl bg-white/20"
						}
					>
						<div className="text-center">
							<h2 className="text-3xl font-bold border-b-[1px] border-gray-400 m-auto mb-2 w-fit">
								Day 1
							</h2>
							<h3 className="font-bold text-2xl 2xl:text-3xl">
								11/2 <span className="text-lg 2xl:text-xl">Sat</span>
							</h3>
							<p className="font-light text-lg 2xl:text-xl">10:00 ~ 16:00</p>
						</div>
						<div className="absolute bottom-7 w-[1px] h-9 bg-black" />
						<div className="text-center">
							<h2 className="text-3xl font-bold border-b-[1px] border-gray-400 m-auto mb-2 w-fit">
								Day 2
							</h2>
							<h3 className="font-bold text-2xl 2xl:text-3xl">
								11/3 <span className="text-lg 2xl:text-xl">Sun</span>
							</h3>
							<p className="font-light text-lg 2xl:text-xl">10:00 ~ 16:00</p>
						</div>
					</div>
				</div>
			</div>
			<Section main="開催日程" sub="schedule" className="lg:hidden mt-5 px-3">
				<div className="flex justify-around relative">
					<div className="text-center">
						<h2 className="text-xl font-bold border-b-[1px] border-gray-400 m-auto mb-2 w-fit">
							Day 1
						</h2>
						<h3 className="font-bold text-xl">
							11/2 <span className="text-base">Sat</span>
						</h3>
						<p className="font-extralight">10:00 ~ 16:00</p>
					</div>
					<div className="absolute bottom-2 w-[1px] h-9 bg-black" />
					<div className="text-center">
						<h2 className="text-xl font-bold border-b-[1px] border-gray-400 m-auto mb-2 w-fit">
							Day 2
						</h2>
						<h3 className="font-bold text-xl">
							11/3 <span className="text-base">Sun</span>
						</h3>
						<p className="font-extralight">10:00 ~ 16:00</p>
					</div>
				</div>
			</Section>
			<Section
				main="お知らせ"
				sub="announcement"
				className="mt-10 lg:mt-5 px-3 lg:pr-20"
			>
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
					<NotificationCard
						className="h-80 lg:h-[30rem] grow w-full "
						header={"本部からのお知らせ"}
						notifications={superNotifications}
						onUpdate={async () => {
							const newNotifications =
								await notificationRepository.getProjectNotifications(
									SuperProjectAlias,
								);
							setSuperNotifications(newNotifications);
						}}
					/>
					<NotificationCard
						showProjectName
						className="h-80 lg:h-[30rem] grow w-full"
						header={"企画からのお知らせ"}
						notifications={allNotifications}
						onUpdate={async () => {
							const newNotifications =
								await notificationRepository.getAllNotifications();
							setAllNotifications(newNotifications);
						}}
					/>
				</div>
			</Section>
			<div className="mt-5 lg:mt-0 mx-3 space-y-12 lg:space-y-20 lg:grid lg:grid-cols-2 lg:items-start self-stretch lg:gap-20 lg:gap-y-28">
				<Section main="今年の祇園祭テーマ" sub="theme" className="self-center">
					<h1 className="text-3xl font-zenmaru text-center lg:text-left font-semibold my-8">
						あつまれこうせんの森
					</h1>
					<p className="font-genshin-gothic-mono font-light text-sm lg:text-md xl:text-lg 2xl:text-xl leading-loose m-auto lg:m-0 max-w-md lg:max-w-2xl ">
						どなたでもお越しいただける祇園祭では、木更津高専の雰囲気や特徴を知ることができます。
						また、飲食企画やステージ企画もあります！木更津高専に興味のある小・中学生から近所の方までお誘いあわせの上ぜひお越しください。
					</p>
				</Section>
				<img
					src={"https://placehold.jp/1191x1684.png"}
					alt="祇園祭ポスター"
					className="h-[50vh] lg:h-fit lg:p-10 lg:w-[100vh] lg:max-h-[80vh] object-contain m-auto"
					loading="lazy"
				/>
				<Section main="お願いと注意事項" sub="precautions">
					<ol className="ml-8 lg:my-5 list-decimal space-y-2 lg:space-y-4 font-genshin-gothic-mono font-light text-sm lg:text-md xl:text-lg 2xl:text-xl">
						<li>構内は年齢を問わず禁煙・禁酒です。</li>
						<li>エレベーターのご利用はなるべくお控えください。</li>
						<li>展示物校内施設は丁寧に扱うようにお願いします。</li>
						<li>
							ゴミは校内に設置されたゴミ箱への分別回収にご協力をお願いします。
						</li>
						<li>
							構内の事故に関して祇園祭実行委員は一切の責任を負いかねます。
						</li>
						<li>
							例年忘れ物が多数ございます。お帰りの際はお手回り品をご確認ください。
						</li>
						<li>食べ歩きはご遠慮ください。</li>
						<li>
							混雑が予想される場所では、十分に周囲にご注意頂き、その場で立ち止まらないなど混雑回避にご協力下さい。
						</li>
						<li>
							その他不明な点やトラブルが発生した場合は、腕章をつけたスタッフ、または受付にお問い合わせください。
						</li>
					</ol>
				</Section>
				<SubSection
					main="飲食ルール"
					sub="eating rules"
					className="h-full mx-2 lg:mr-16"
				>
					<ul className="ml-8 my-5 list-disc space-y-2 lg:space-y-4 font-genshin-gothic-mono font-light text-sm lg:text-md xl:text-lg 2xl:text-xl">
						<li>
							天候によって食品企画会場内の配置が変更になる場合がございます。
						</li>
						<li>
							今年度は飲食スペースとして一般研究棟B1階食堂をご用意しております。
							屋内では飲食スペース以外での食事は禁止ですのでお気を付けください。
						</li>
						<li>購入した食品は、持ち帰らずお早めにお召し上がりください。</li>
						<li>
							食物アレルギーをお持ちの方は、原材料に関する情報を
							開示いたしますので、販売者までお声がけください。
						</li>
						<li>
							飲食スペースは限られております。譲り合ってご利用いただきますようお願いいたします。
						</li>
					</ul>
				</SubSection>
				<Section
					main="その他リンク"
					sub="others & links"
					className="h-min pt-5 lg:pt-0 pb-10"
				>
					<div className="flex-grow">
						<div className="grid grid-cols-2 justify-items-center my-3 gap-5 w-fit m-auto">
							<LinkButton to={Routes.Projects.route}>企画一覧</LinkButton>
							<LinkButton to={Routes.TimeTable.route}>
								タイムテーブル
							</LinkButton>
							<LinkButton to={Routes.Greetings.route}>ご挨拶</LinkButton>
							<LinkButton to={Routes.Access.route}>アクセス</LinkButton>
						</div>
						<div className="hidden lg:block ml-1 my-5 lg:my-12 h-[1px] w-32 shrink-0 bg-black" />
						<SubSection
							main="パンフレット"
							sub="pamphlet"
							className="mt-10 lg:mt-5 ml-1"
						>
							<div className="my-5 m-auto w-fit">
								<LinkButton
									to=""
									className="space-x-2"
								>
									<BookOpen className="inline mr-2" />
									パンフレット(PDF)はこちら
									<ExternalLink className="inline" size={15} />
								</LinkButton>
							</div>
						</SubSection>
						<div className="hidden lg:block ml-1 my-5 lg:my-12 h-[1px] w-32 shrink-0 bg-black" />
						<SubSection
							main="アンケート"
							sub="questionnaire"
							className="mt-10 lg:mt-5 ml-1"
						>
							<div className="my-5 m-auto w-fit">
								<LinkButton to="">
									<SquarePen className="inline mr-2" />
									アンケートフォームはこちら
								</LinkButton>
							</div>
						</SubSection>
						<div className="hidden lg:block ml-1 my-5 lg:my-12 h-[1px] w-32 shrink-0 bg-black" />
						<SubSection
							main="協賛"
							sub="sponsor"
							className="mt-10 lg:mt-5 ml-1"
						>
							<div className="my-5 m-auto w-fit">
								<LinkButton to="/sponsors" className="">
									協賛企業一覧はこちら
								</LinkButton>
							</div>
						</SubSection>
					</div>
				</Section>
			</div>
		</main>
	);
}
