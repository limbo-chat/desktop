import { clsx } from "clsx";
import type { HTMLAttributes } from "react";

export interface StepProps extends HTMLAttributes<HTMLDivElement> {
	/** an identifier for the step */
	id?: string;
}

export const Step = ({ id, className, ...props }: StepProps) => {
	return <div className={clsx("step", className)} data-step={id} {...props} />;
};

export interface StepHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const StepHeader = ({ className, ...props }: StepHeaderProps) => {
	return <div className={clsx("step-header", className)} {...props} />;
};

export interface StepDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

export const StepDescription = ({ className, ...props }: StepDescriptionProps) => {
	return <p className={clsx("step-description", className)} {...props} />;
};

export interface StepTitleProps extends HTMLAttributes<HTMLDivElement> {}

export const StepTitle = ({ className, ...props }: StepTitleProps) => {
	return <div className={clsx("step-title", className)} {...props} />;
};

export interface StepIndicatorProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
	totalSteps: number;
	currentStep: number;
}

export const StepIndicator = ({
	className,
	totalSteps,
	currentStep,
	...props
}: StepIndicatorProps) => {
	return (
		<span className={clsx("step-indicator", className)} {...props}>
			{`(${currentStep}/${totalSteps})`}
		</span>
	);
};

export interface StepContentProps extends HTMLAttributes<HTMLDivElement> {}

export const StepContent = ({ className, ...props }: StepContentProps) => {
	return <div className={clsx("step-content", className)} {...props} />;
};

export interface StepFooterProps extends HTMLAttributes<HTMLDivElement> {}

export const StepFooter = ({ className, ...props }: StepFooterProps) => {
	return <div className={clsx("step-footer", className)} {...props} />;
};

export interface StepActionsProps extends HTMLAttributes<HTMLDivElement> {}

export const StepActions = ({ className, ...props }: StepActionsProps) => {
	return <div className={clsx("step-actions", className)} {...props} />;
};
