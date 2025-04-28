import { Loader2Icon, type LucideProps } from "lucide-react";

export interface LoaderProps extends LucideProps {}

export const LoadingSpinner = (props: LoaderProps) => {
	return <Loader2Icon className="loading-spinner" {...props} />;
};
