import { Link } from "@remix-run/react";
import noImage from "~/assets/images/no-image.webp";
import type { PartialProject } from "~/lib/types/project";

type ProjectCardProps = {
	project: PartialProject;
};

export function ProjectCard({ project }: ProjectCardProps) {
	return (
		<Link to={`/projects/${project.alias}`}>
			<div className="bg-elevated rounded-md p-3 flex max-h-min shadow-md transition duration-75 ease-in-out hover:shadow-xl hover:-translate-y-1">
				<img
					src={project.thumbnail?.path ?? noImage}
					alt={project.name}
					className="w-1/3 lg:w-[40%] aspect-[5_/_3] h-auto my-auto rounded-md mr-5"
				/>
				<div className="w-full min-h-max flex flex-col justify-between">
					<div className="text-lg font-bold">{project.name}</div>
					<div className="text-sm text-gray-500 text-ellipsis">
						{project.description}
					</div>
					<div className="flex-grow" />
					<div className="text-sm text-gray-500">{project.location}</div>
					<div className="text-sm text-gray-500">{project.group.name}</div>
				</div>
			</div>
		</Link>
	);
}
