import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/design-playground/design-system/colors")({
	component: DesignSystemColorsPage,
});

const ColorSwatch = () => {
	return <div className="color-swatch" />;
};

function DesignSystemColorsPage() {
	return <div>Hello "/design-playground/design-system/colors"!</div>;
}
