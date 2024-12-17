import { Link } from "@remix-run/react";
import type { RemixLinkProps } from "@remix-run/react/dist/components";
import React from "react";
import styles from "./styles.module.css";
export const LinkButton = React.forwardRef<HTMLAnchorElement, RemixLinkProps>(
	({ className, ...props }, ref) => {
		return (
			<Link
				className={`${styles.linkButton}${className ? ` ${className}` : ""}`}
				ref={ref}
				{...props}
			/>
		);
	},
);
