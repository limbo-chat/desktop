import { useCustomStylesLoader, useCustomStylesSubscriber } from "./hooks";

export const CustomStylesController = () => {
	useCustomStylesLoader();
	useCustomStylesSubscriber();

	return null;
};
