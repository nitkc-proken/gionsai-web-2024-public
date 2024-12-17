import type { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { MapIcon, MapPin, Pin } from "lucide-react";
import React, { useEffect, useState } from "react";
import { ClientOnly } from "remix-utils/client-only";
import _greeting from "~/assets/greeting.yaml";
import { Title } from "~/components/Title/title";
import { SchoolMap } from "~/components/map.client";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";
import { Separator } from "~/components/ui/separator";
import { MapRepository } from "~/lib/repositories/mapRepository";
import { ProjectRepository } from "~/lib/repositories/projectRepository";
import { imageFullURL } from "~/lib/utils/image";
import { cn } from "~/lib/utils/shadcn";

export async function loader({ request }: LoaderFunctionArgs) {
	// map?p={エイリアス} でプロジェクトを指定している場合はそのプロジェクトを取得
	const url = new URL(request.url);
	const projectAlias = url.searchParams.get("p");
	const project = projectAlias
		? await ProjectRepository.getProject(projectAlias)
		: undefined;

	const json = await MapRepository.getMap();

	return {
		buildings: json.map(({ floors, ...e }) => ({
			...e,
			floors: floors.map(({ mapImage, ...f }) => ({
				...f,
				mapImage: imageFullURL(mapImage),
			})),
		})),
		project,
	};
}

type DetailMapType = {
	buildingName: string;
	floorName: string | null;
	image: string;
};

export default function MapPage() {
	const { buildings, project } = useLoaderData<typeof loader>();

	const [highlightedProject] = useState<string | undefined>(
		project?.alias?.toString(),
	);

	const [selectedBuildingId, setSelectedBuildingId] = useState<
		number | undefined
	>(project?.floor.building.id);

	useEffect(() => {
		if (!highlightedProject) {
			return;
		}
		const el = document.getElementById(highlightedProject);
		if (el) {
			el.scrollIntoView(false);
		}
	}, [highlightedProject]);
	const [detailMapImage, setDetailMapImage] = useState<
		DetailMapType | undefined
	>(undefined);

	// 地図上の建物をクリックしたときの処理
	const onClickBuilding = (buildingId: number) => {
		setSelectedBuildingId(buildingId);
		const el = document.getElementById(`b${buildingId}`);
		if (el) {
			el.scrollIntoView();
		}
	};

	return (
		<main className="container md:px-10 lg:px-20">
			<Title title={"構内地図"} sub="map" variant="secondary" />
			<p>マップのピンをクリックするとその建物の企画を見ることができます。</p>
			<p>
				<MapPin className="inline" />
				を押すとその建物をマップ上で中心に表示します。
			</p>
			<div className="h-lvh lg:grid lg:grid-cols-2 gap-5 lg:grid-rows-subgrid lg:h-screen">
				<div className="mb-10">
					<ClientOnly>
						{() => (
							<SchoolMap
								buildings={buildings}
								className="max-h-[35vh] lg:max-h-none m-auto"
								onSelectedBuildingChanged={onClickBuilding}
								selectedBuildingId={selectedBuildingId}
							/>
						)}
					</ClientOnly>
				</div>
				<div className="h-[50vh] lg:h-[70vh] space-y-2 overflow-y-scroll scroll-smooth">
					{buildings.map((building) => (
						<div key={building.id} id={`b${building.id}`}>
							<h1 className="py-1 h-10 flex items-center gap-5 text-center sticky top-0 bg-white z-20">
								<Button
									variant={"outline"}
									size={"icon"}
									onClick={() => {
										setSelectedBuildingId(building.id);
									}}
								>
									<MapPin />
								</Button>
								{building.name}
								<div className="flex-grow" />
								<div>
									{building.floors.map(
										(f) =>
											f.name && (
												<Link
													key={f.id}
													to={`#f${f.id}`}
													className="p-1 text-blue-500 hover:underline"
												>
													{f.name}
												</Link>
											),
									)}
								</div>
							</h1>
							{building.floors.map((floor) => (
								<React.Fragment key={floor.id}>
									<div className="flex items-center mt-5 mb-2 bg-white sticky py-1 top-10 z-10">
										<h2 className="text-sm">{floor.name}</h2>
										<hr className="mx-5 flex-grow bg-black h-[2px]" />
										<Button
											size={"sm"}
											onClick={() =>
												setDetailMapImage({
													buildingName: building.name,
													floorName: floor.name,
													image: floor.mapImage.path,
												})
											}
										>
											<MapIcon className="mr-2" />
											詳細地図を開く
										</Button>
									</div>
									<div id={`f${floor.id}`} key={floor.id} className="space-y-2">
										{floor.projects.map((project) => (
											<Link
												to={`/projects/${project.alias}`}
												key={project.id}
												id={project.alias}
												className={cn(
													"py-2 px-2 bg-elevated rounded-lg flex gap-2 items-center hover:shadow-xl hover:-translate-y-1",
													highlightedProject === project.alias &&
														"bg-yellow-200",
												)}
											>
												<div className="min-w-fit">{project.alias}</div>
												<div>
													<span className="text-sm">{project.group.name}</span>
													<div>{project.name}</div>
												</div>
											</Link>
										))}
									</div>
								</React.Fragment>
							))}
							<Separator />
						</div>
					))}
				</div>
			</div>
			{/* 詳細地図のダイアログ */}
			<Dialog
				open={!!detailMapImage}
				onOpenChange={(o) => {
					if (!o) {
						setDetailMapImage(undefined);
					}
				}}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{detailMapImage?.buildingName} {detailMapImage?.floorName}
						</DialogTitle>
						<DialogDescription>
							{detailMapImage && <img src={detailMapImage.image} />}
						</DialogDescription>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</main>
	);
}
