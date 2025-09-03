import clsx from "clsx";
import { AppIcon } from "./app-icon";
import { IconButton } from "./icon-button";

export interface SearchInputProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
	ref?: React.RefObject<HTMLInputElement | null>;
	value: string;
	onChange: (value: string) => void;
}

export const SearchInput = ({ value, onChange, className, ref, ...props }: SearchInputProps) => {
	return (
		<div className={clsx("search-input-container", className)}>
			<div className="search-input-icon">
				<AppIcon icon="search" />
			</div>
			<input
				type="search"
				className="search-input"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				ref={ref}
				{...props}
			/>
			{value.length > 0 && (
				<IconButton
					className="search-input-clear-button"
					aria-label="Clear search"
					onClick={() => onChange("")}
				>
					<AppIcon icon="close" />
				</IconButton>
			)}
		</div>
	);
};
