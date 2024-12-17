import _greeting from "~/assets/greeting.yaml";
import GreatingCard from "~/components/Greating/Card";
import { Title } from "~/components/Title/title";
import type { GreetingType } from "~/lib/types/greeting";
const greetingInfo = _greeting as GreetingType[];

export default function GreattingPage() {
	return (
		<>
			<main>
				<Title title="ご挨拶" sub="greeting" variant="secondary" />
				<div className="flex flex-col items-center gap-10 lg:gap-20">
					{greetingInfo.map((sub) => (
						<GreatingCard
							key={sub.name}
							name={sub.name}
							body={sub.body}
							role={sub.role}
							en_role={sub.en_role}
						/>
					))}
				</div>
			</main>
		</>
	);
}
