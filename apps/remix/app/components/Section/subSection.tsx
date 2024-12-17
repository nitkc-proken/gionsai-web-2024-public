import type { SectionProps } from "./section";

export function SubSection(props: SectionProps) {
	return (
		<div className={props.className}>
			<div className="flex flex-col items-center lg:block">
				<div className="relative lg:mt-10 lg:block flex justify-center">
					<h3 className="tracking-widest whitespace-nowrap -z-10 text-2xl lg:text-5xl font-bold absolute text-gray-200 font-inter top-[-1rem] lg:top-[-2rem] first-letter:text-orange-200">
						{props.sub}
					</h3>
					<h2 className="text-xl lg:text-3xl font-black font-inter">
						{props.main}
					</h2>
				</div>
			</div>
			{props.children}
		</div>
	);
}
