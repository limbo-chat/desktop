import clsx from "clsx";

export interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
	/** an identifier for the section */
	id?: string;
}

export const Section = ({ id, className, ...props }: SectionProps) => {
	return <section className={clsx("section", className)} data-section={id} {...props} />;
};

export interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SectionHeader = ({ className, ...props }: SectionHeaderProps) => {
	return <div className={clsx("section-header", className)} {...props} />;
};

export interface SectionTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export const SectionTitle = ({ className, ...props }: SectionTitleProps) => {
	return <h2 className={clsx("section-title", className)} {...props} />;
};

export interface SectionDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const SectionDescription = ({ className, ...props }: SectionDescriptionProps) => {
	return <p className={clsx("section-description", className)} {...props} />;
};

export interface SectionContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SectionContent = ({ className, ...props }: SectionContentProps) => {
	return <div className={clsx("section-content")} {...props} />;
};
