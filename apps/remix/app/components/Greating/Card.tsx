type GreatingCardProps = {
	name: string;
	role: string;
	body: string;
	en_role: string;
};

function SepLine() {
	return (
		<div className="flex items-center">
			<div className="border-t-2 border-orange-400 w-8" />
			<div className="border-t-2 border-gray-600 w-1/3" />
		</div>
	);
}

export default function GreatingCard({
	name,
	role,
	body,
	en_role,
}: GreatingCardProps) {
	return (
		<div
			className={
				"bg-gray-200 w-11/12 md:w-full md:max-w-2xl sm:max-w-3xl py-2 px-4 lg:px-8 lg:py-6 shadow-[10px_10px_0px] shadow-gray-400 z-30"
			}
		>
			<h3 className="font-genshin-gothic lg:text-2xl">{en_role}</h3>
			<h2 className="font-genshin-gothic text-2xl lg:mt-4 lg:text-5xl">
				{name}
			</h2>
			<h3 className="font-genshin-gothic lg:text-2xl lg:my-4">{role}</h3>
			<SepLine />
			<p
				className={
					"font-genshin-gothic mt-4 lg:mt-9 w-full text-sm whitespace-pre-wrap"
				}
			>
				{body}
			</p>
		</div>
	);
}
