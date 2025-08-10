import clsx from "clsx";

export interface SectionProps extends React.ComponentProps<"div"> {
	/** an identifier for the section */
	id?: string;
}

export const Section = ({ id, className, ...props }: SectionProps) => {
	return <section className={clsx("section", className)} data-section={id} {...props} />;
};

export interface SectionHeaderProps extends React.ComponentProps<"div"> {}

export const SectionHeader = ({ className, ...props }: SectionHeaderProps) => {
	return <div className={clsx("section-header", className)} {...props} />;
};

export interface SectionTitleProps extends React.ComponentProps<"h2"> {}

export const SectionTitle = ({ className, ...props }: SectionTitleProps) => {
	return <h2 className={clsx("section-title", className)} {...props} />;
};

export interface SectionDescriptionProps extends React.ComponentProps<"p"> {}

export const SectionDescription = ({ className, ...props }: SectionDescriptionProps) => {
	return <p className={clsx("section-description", className)} {...props} />;
};

export interface SectionContentProps extends React.ComponentProps<"div"> {}

export const SectionContent = ({ className, ...props }: SectionContentProps) => {
	return <div className={clsx("section-content")} {...props} />;
};
