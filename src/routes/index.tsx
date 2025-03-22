import { createFileRoute } from "@tanstack/react-router";
import { Button } from "../components/button";

export const Route = createFileRoute("/")({
	component: HomePage,
});

function HomePage() {
	return (
		<div className="p-lg">
			<Button onClick={() => console.log("clicked")}>test</Button>
		</div>
	);
}
