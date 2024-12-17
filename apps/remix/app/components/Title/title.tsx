import { cva } from "class-variance-authority";
import type React from "react";
import { cn } from "~/lib/utils/shadcn";
import styles from "./styles.module.css";
type TitleProps = {
	variant?: "primary" | "secondary";
	title: React.ReactNode;
	sub: React.ReactNode;
	className?: string;
};
const titleVariants = cva("font-inter", {
	variants: {
		variant: {
			primary: "text-xl lg:text-3xl font-black",
			secondary: "text-xl lg:text-3xl font-black",
		},
	},
	defaultVariants: {
		variant: "primary",
	},
});
const subVariants = cva("font-inter", {
	variants: {
		variant: {
			primary: `text-2xl lg:text-3xl font-bold absolute text-white font-inter top-[-1rem] -z-10 tracking-[0.7rem] mr-[-0.7rem] ${styles.edgingText}`,
			secondary:
				"tracking-[0.7rem] mr-[-0.7rem] -z-10 text-2xl lg:text-4xl font-bold absolute text-gray-200 top-[-1rem] first-letter:text-orange-200",
		},
	},
	defaultVariants: {
		variant: "primary",
	},
});
export function Title({ variant, className, ...props }: TitleProps) {
	return (
		<div
			className={cn(
				"w-full relative px-8 flex items-center justify-center my-5",
				className,
			)}
		>
			<hr className="ml-3 mr-10 flex-grow bg-black h-[2px]" />
			<h2 className={cn(subVariants({ variant: variant }))}>{props.sub}</h2>
			<h1 className={cn(titleVariants({ variant: variant }))}>{props.title}</h1>
			<hr className="mr-3 ml-10 flex-grow bg-black h-[2px]" />
		</div>
	);
}
