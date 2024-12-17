import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Check, InfoIcon, Link2, MapPin } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "~/components/ui/carousel";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "~/components/ui/tooltip";
import { ProjectRepository } from "~/lib/repositories/projectRepository";

import noImage from "~/assets/images/no-image.webp";
import { NotificationCard } from "~/components/Notification/NotificationCard";
import notificationRepository from "~/lib/repositories/notificationRepository";
import { PUBLIC_ENV } from "~/lib/utils/env";

export async function loader({ params }: LoaderFunctionArgs) {
	const projectAlias = params.alias;
	if (!projectAlias)
		throw new Response(null, {
			status: 404,
			statusText: "Not Found",
		});
	const project = await ProjectRepository.getProject(projectAlias);
	if (!project)
		throw new Response(null, {
			status: 404,
			statusText: "Not Found",
		});
	const notifications = await notificationRepository.getProjectNotifications(
		project.alias,
	);
	return { project, notifications };
}
export const meta: MetaFunction<typeof loader> = ({ data, location }) => {
	if (!data) return [{}];
	const { project } = data;
	const titleElements = [
		{ title: project.name },
		{
			name: "twitter:title",
			content: project.name,
		},
		{
			property: "og:title",
			content: project.name,
		},
	];
	const descriptionElements = [
		{
			name: "description",
			content: project.description,
		},
		{
			name: "twitter:description",
			content: project.description,
		},
		{
			property: "og:description",
			content: project.description,
		},
	];
	const imageElements = project.ogpImage
		? [
				{
					name: "twitter:image",
					content: project.ogpImage.path,
				},
				{
					property: "og:image",
					content: project.ogpImage.path,
				},
				{
					name: "twitter:card",
					content: "summary_large_image",
				},
			]
		: [];
	return [
		...titleElements,
		...descriptionElements,
		...imageElements,
		{ property: "og:type", content: "website" },
		{ property: "og:site_name", content: "木更津高専 祇園祭" },
		{ property: "og:locale", content: "ja_JP" },
		{
			property: "og:url",
			content: `${PUBLIC_ENV.APP_HOST}${location.pathname}`,
		},
	];
};
export default function ProjectDetail() {
	const { project, notifications: loaderNotifications } =
		useLoaderData<typeof loader>();
	const [notifications, setNotifications] = useState(loaderNotifications);
	const [isCopied, setIsCopied] = useState(false);
	const onCopy = () => {
		navigator.clipboard.writeText(window.location.href);
		setIsCopied(true);
		setTimeout(() => {
			setIsCopied(false);
		}, 2000);
	};

	return (
		<main className="container max-w-6xl space-y-10">
			<div className="flex w-full mt-5 lg:mt-10 flex-wrap lg:flex-nowrap gap-5">
				<div>
					<h2 className="text-xl">{project.group.name}</h2>
					<h1 className="text-3xl font-bold">
						{project.name}{" "}
						<TooltipProvider delayDuration={0}>
							<Tooltip open={isCopied ? true : undefined}>
								<TooltipTrigger asChild>
									<Button variant="outline" size="icon" onClick={onCopy}>
										{isCopied ? <Check /> : <Link2 />}
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>{isCopied ? "URLをコピーしました！" : "URLをコピー"}</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</h1>
					<Button variant={"outline"} asChild>
						<Link to={`/map?p=${project.alias}`} className="hover:underline">
							<MapPin className="inline" /> {project.location}
						</Link>
					</Button>
				</div>
				<div className="lg:flex-grow" />
				<div className="bg-slate-700 text-white flex-grow lg:flex-grow-0 w-full lg:w-fit lg:px-10 py-3 lg:py-5 rounded-3xl text-center ">
					<div>{project.category.name}</div>
					<div className="text-xl lg:text-3xl">{project.alias}</div>
				</div>
			</div>
			<Carousel className="w-[calc(100vw_-_7rem)] max-w-3xl m-auto">
				<CarouselContent>
					<CarouselItem>
						<img
							src={project.thumbnail?.path ?? noImage}
							alt={project.thumbnail?.alt}
						/>
						{project.images.map((image) => (
							<img
								key={image.id}
								src={image.path}
								alt={image.alt}
								className="w-full h-auto"
							/>
						))}
					</CarouselItem>
				</CarouselContent>
				{project.images.length > 0 && (
					<>
						<CarouselPrevious />
						<CarouselNext />
					</>
				)}
			</Carousel>
			{project.category.prefix === "E" && (
				<Alert className="max-w-3xl m-auto">
					<InfoIcon className="h-4 w-4" />
					<AlertTitle>食品企画についての注意点</AlertTitle>
					<AlertDescription>
						<ul className="list-disc list-outside">
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
					</AlertDescription>
				</Alert>
			)}
			<p>{project.description}</p>
			<NotificationCard
				className="max-w-3xl m-auto h-96"
				header={project.name}
				notifications={notifications}
				onUpdate={async () => {
					const updatedNotifications =
						await notificationRepository.getProjectNotifications(project.alias);
					setNotifications(updatedNotifications);
				}}
			/>
		</main>
	);
}
