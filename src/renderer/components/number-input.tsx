import { useEffect, useState } from "react";
import clsx from "clsx";
import { AppIcon } from "./app-icon";
import { IconButton } from "./icon-button";

export type NumberInputMode = "integer" | "float";

export interface NumberInputProps {
	placeholder?: string;
	value?: number | null;
	min?: number;
	max?: number;
	stepSize?: number;
	mode?: NumberInputMode;
	allowDecimal?: boolean;
	className?: string;
	onChange: (value: number | null) => void;
	ref?: React.Ref<HTMLInputElement>;
}

export const NumberInput = ({
	placeholder,
	mode = "integer",
	value,
	min,
	max,
	stepSize = 1,
	onChange,
	className,
	ref,
}: NumberInputProps) => {
	const [rawValue, setRawValue] = useState("");

	const setValue = (val: number) => {
		onChange(val);
	};

	const clampValue = (val: number) => {
		if (mode === "integer") {
			val = Math.round(val);
		}

		if (typeof min === "number") {
			val = Math.max(val, min);
		}

		if (typeof max === "number") {
			val = Math.min(val, max);
		}

		return val;
	};

	const increment = () => {
		if (typeof value !== "number") {
			setValue(clampValue(0));

			return;
		}

		const nextValue = value + stepSize;

		setValue(clampValue(nextValue));
	};

	const decrement = () => {
		if (typeof value !== "number") {
			setValue(clampValue(0));

			return;
		}

		const nextValue = value - stepSize;

		setValue(clampValue(nextValue));
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setRawValue(e.target.value);

		if (e.target.value === "") {
			onChange(null);

			return;
		}

		const parsedValue = parseFloat(e.target.value);

		if (isNaN(parsedValue)) {
			return;
		}

		setValue(clampValue(parsedValue));
	};

	const handleBlur = () => {
		if (typeof value === "number") {
			setRawValue(value.toString());
		} else {
			setRawValue("");
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		switch (e.key) {
			case "ArrowUp":
				e.preventDefault();
				increment();
				break;
			case "ArrowDown":
				e.preventDefault();
				decrement();
				break;
		}
	};

	useEffect(() => {
		setRawValue(typeof value === "number" ? value.toString() : "");
	}, [value]);

	return (
		<div className={clsx("number-input-container", className)}>
			<input
				className="number-input"
				type="text"
				inputMode="numeric"
				placeholder={placeholder}
				value={rawValue}
				onChange={handleChange}
				onBlur={handleBlur}
				onKeyDown={handleKeyDown}
				ref={ref}
			/>
			<div className="number-input-controls">
				<IconButton
					className="number-input-control"
					aria-label="Increment"
					onClick={increment}
				>
					<AppIcon icon="increment" />
				</IconButton>
				<IconButton
					className="number-input-control"
					aria-label="Decrement"
					onClick={decrement}
				>
					<AppIcon icon="decrement" />
				</IconButton>
			</div>
		</div>
	);
};
