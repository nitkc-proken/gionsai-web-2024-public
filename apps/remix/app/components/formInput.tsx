import { type ReactNode, useId } from "react";
import { cn } from "~/lib/utils/shadcn";
import { Input, type InputProps } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea, type TextareaProps } from "./ui/textarea";
type FormItemBase = {
	className?: string;
	label: ReactNode;
	helpText?: ReactNode;
	errorMessage?: ReactNode;
	right?: ReactNode;
};
type FormInputProps = InputProps & FormItemBase;
export function FormInput({
	className,
	label,
	helpText,
	errorMessage,
	id,
	...props
}: FormInputProps) {
	return (
		<div className={cn("text-left", className)}>
			<Label htmlFor={id}>{label}</Label>
			<div className="relative">
				<Input id={id} {...props} />
				{props.right && (
					<div className="absolute top-0 right-0">{props.right}</div>
				)}
			</div>
			<div className="text-slate-500">{helpText}</div>
			<div className="text-red-700 min-h-[1rem]">{errorMessage}</div>
		</div>
	);
}
type FormTextAreaProps = TextareaProps & FormItemBase;
export function FormTextArea({
	className,
	label,
	helpText,
	errorMessage,
	id,
	...props
}: FormTextAreaProps) {
	return (
		<div className={cn("text-left", className)}>
			<Label htmlFor={id}>{label}</Label>
			<div className="relative">
				<Textarea id={id} {...props} />
				{props.right && (
					<div className="absolute top-0 right-0">{props.right}</div>
				)}
			</div>
			<div className="text-slate-500">{helpText}</div>
			<div className="text-red-700 min-h-[1rem]">{errorMessage}</div>
		</div>
	);
}
