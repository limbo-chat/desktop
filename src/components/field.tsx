import type { PropsWithChildren, ReactNode } from "react";
import * as FieldPrimitives from "./field-primitives";

export interface FieldProps {
	id: string;
	label?: ReactNode;
	description?: ReactNode;
	error?: ReactNode;
}

export const Field = ({
	id,
	label,
	description,
	error,
	children,
}: PropsWithChildren<FieldProps>) => {
	return (
		<FieldPrimitives.Root
			id={id}
			isError={!!error}
			hasDescription={!!description}
			hasError={!!error}
		>
			{label && <FieldPrimitives.Label>{label}</FieldPrimitives.Label>}
			{description && (
				<FieldPrimitives.Description>{description}</FieldPrimitives.Description>
			)}
			<FieldPrimitives.Control>{children}</FieldPrimitives.Control>
			{error && <FieldPrimitives.Error>{error}</FieldPrimitives.Error>}
		</FieldPrimitives.Root>
	);
};
