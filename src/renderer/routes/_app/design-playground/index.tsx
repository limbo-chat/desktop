import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/design-playground/")({
	component: DesignPlaygroundPage,
});

function DesignPlaygroundPage() {
	return "home";
}
