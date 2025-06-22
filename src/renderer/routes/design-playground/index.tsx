import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/design-playground/")({
	component: DesignPlaygroundPage,
});

function DesignPlaygroundPage() {
	return "home";
}
