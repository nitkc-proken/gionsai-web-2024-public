import type { PropsWithChildren } from "react";
import { cn } from "~/lib/utils/shadcn";
import styles from "./styles.module.css";
export type SectionProps = {
	main: React.ReactNode;
	readonly sub: string;
	className?: string;
} & PropsWithChildren;

export function Section(props: SectionProps) {
	return (
		<div className={cn("flex overflow-hidden", props.className)}>
			<h2
				className={cn(
					"hidden lg:flex text-7xl justify-between whitespace-pre gap-1",
					styles.sectionTitleMainSub,
					styles.sectionTitleMainSubPc,
				)}
			>
				{Array.from(props.sub).map((sub, index) => (
					<span
						key={`${sub}${
							// biome-ignore lint/suspicious/noArrayIndexKey: 並び順が変更されることは想定されていないため
							index
						}`}
					>
						{sub}
					</span>
				))}
			</h2>
			<div className="max-w-full flex flex-col flex-grow">
				<hr className="hidden lg:block border-2 border-orange-300 w-20 mb-2" />
				<div className={styles.sectionTitleWrapper}>
					<hr className={`${styles.sectionTitleDivider} lg:hidden`} />
					<div className={styles.sectionTitleMain}>
						<h2
							className={cn(
								"lg:hidden text-2xl absolute -top-5",
								styles.sectionTitleMainSub,
								styles.sectionTitleMainSubSp,
							)}
						>
							{props.sub}
						</h2>
						<h1 className="text-xl lg:text-3xl font-black font-inter">
							{props.main}
						</h1>
					</div>
					<hr className={styles.sectionTitleDivider} />
				</div>
				<hr className="border-2 border-orange-300 w-16 m-auto mb-5 lg:hidden" />
				{props.children}
			</div>
		</div>
	);
}
