import type { PropsWithChildren, ReactNode } from "react";
import * as FieldPrimitive from "./field-primitive";

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
		<FieldPrimitive.Root id={id} hasDescription={!!description} hasError={!!error}>
			{label && <FieldPrimitive.Label>{label}</FieldPrimitive.Label>}
			{description && <FieldPrimitive.Description>{description}</FieldPrimitive.Description>}
			<FieldPrimitive.Control>{children}</FieldPrimitive.Control>
			{error && <FieldPrimitive.Error>{error}</FieldPrimitive.Error>}
		</FieldPrimitive.Root>
	);
};
