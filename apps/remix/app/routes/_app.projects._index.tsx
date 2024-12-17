import { type MetaFunction, json } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { Search, X } from "lucide-react";
import { useRef, useState } from "react";
import { Title } from "~/components/Title/title";
import { ProjectCard } from "~/components/projectCard";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { ProjectRepository } from "~/lib/repositories/projectRepository";
import type { Category, PartialProject } from "~/lib/types/project";

export const meta: MetaFunction = () => {
	return [
		{ title: "木更津高専 祇園祭 - 企画一覧" },
		{
			name: "description",
			content: "木更津高専 祇園祭2024 Webサイト 企画の一覧・検索",
		},
	];
};

async function getProjects(search?: string, category?: string) {
	const projects = await ProjectRepository.listProjects(
		search,
		category === "UNSELECTED" ? undefined : category,
	);
	const projectsMap = projects.reduce(
		(acc, project) => {
			const index = acc.findIndex(
				(e) => e.category.prefix === project.category.prefix,
			);
			if (index === -1) {
				acc.push({
					category: project.category,
					projects: [project],
				});
			} else {
				acc[index].projects.push(project);
			}
			return acc;
		},
		[] as {
			category: Category;
			projects: PartialProject[];
		}[],
	);
	return { projectsMap };
}

export async function action({ request }: { request: Request }) {
	const formData = await request.formData();
	const search = String(formData.get("search"));
	const category = String(formData.get("category"));
	const result = await getProjects(search, category);
	return json(result);
}

export async function loader() {
	const result = await getProjects();
	return json(result);
}

export default function Projects() {
	const formRef = useRef<HTMLFormElement>(null);
	const [category, setCategory] = useState<Category["prefix"]>("UNSELECTED");
	const [search, setSearch] = useState<string>("");
	const { projectsMap: loaderResult } = useLoaderData<typeof loader>();
	const { projectsMap: actionResult } = useActionData<typeof action>() ?? {};
	const projectsMap = actionResult ?? loaderResult;
	return (
		<main className="container">
			<Title title="企画一覧" sub="projects" variant="secondary" />
			<div className="p-5 bg-elevated rounded-md">
				<Form
					className="flex flex-wrap gap-5 items-end"
					method="POST"
					ref={formRef}
				>
					<div className="flex-grow  w-full flex">
						<div className="text-lg">企画の絞り込み・検索</div>
						<div className="flex-grow" />
						<Button
							type="reset"
							variant={"ghost"}
							className="text-red-500 hover:text-red-600"
							onClickCapture={() => {
								formRef.current?.reset();
								setCategory("UNSELECTED");
								setSearch("");
								formRef.current?.submit();
							}}
						>
							<X />
							クリア
						</Button>
					</div>
					<div className="flex-grow lg:flex-grow-0">
						カテゴリー
						<Select
							name="category"
							value={category}
							onValueChange={setCategory}
						>
							<SelectTrigger className="min-w-[180px] w-full lg:w-[180px]">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value={"UNSELECTED"}>未選択</SelectItem>
								{loaderResult.map((e) => (
									<SelectItem key={e.category.prefix} value={e.category.prefix}>
										{e.category.prefix} - {e.category.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<div />
					</div>
					<div className="flex-grow">
						キーワード検索
						<Input
							placeholder="検索するキーワードを入力"
							name="search"
							value={search}
							onInput={(e) => {
								setSearch(e.currentTarget.value);
							}}
						/>
					</div>
					<Button className="flex-grow lg:flex-grow-0">
						<Search className="mr-5" />
						検索
					</Button>
				</Form>
			</div>
			{projectsMap.length > 0 ? (
				projectsMap.map((e, i) => (
					<div key={e.category.prefix} className="mt-5">
						{i > 0 && <hr />}
						<div className="text-xl py-5 bg-white font-bold text-center w-full sticky top-0 z-50">
							{e.category.prefix} - {e.category.name}
						</div>
						<div className="mx-4 grid grid-cols-1 gap-3 lg:gap-10 lg:grid-cols-2 ">
							{e.projects.map((project) => (
								<ProjectCard key={project.id} project={project} />
							))}
						</div>
					</div>
				))
			) : (
				<p className="text-center text-xl my-5">
					該当する企画は見つかりませんでした
				</p>
			)}
		</main>
	);
}
