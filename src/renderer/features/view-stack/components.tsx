import { viewStackContext } from "./contexts";
import { useViewStackState } from "./hooks";
import type { View, ViewComponentProps } from "./types";

export interface ViewStackProps {
	views: Record<string, React.FunctionComponent<ViewComponentProps<any>>>;
	defaultView: View;
}

export const ViewStack = ({ views, defaultView }: ViewStackProps) => {
	const viewStack = useViewStackState();
	const view = viewStack.top ?? defaultView;
	const ViewComponent = views[view.id];

	return (
		<viewStackContext.Provider value={viewStack}>
			<div className="view-stack" data-view={view.id}>
				{ViewComponent && <ViewComponent view={view} />}
			</div>
		</viewStackContext.Provider>
	);
};
