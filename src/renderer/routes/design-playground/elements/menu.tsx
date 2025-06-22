import { createFileRoute } from "@tanstack/react-router";
import {
	BellIcon,
	CreditCardIcon,
	PaintBucketIcon,
	PersonStanding,
	SettingsIcon,
	UserIcon,
} from "lucide-react";
import { Button } from "../../../components/button";
import {
	MenuContent,
	MenuItem,
	MenuItemIcon,
	MenuItemLabel,
	MenuRoot,
	MenuSection,
	MenuSectionContent,
	MenuSectionHeader,
	MenuSectionLabel,
	MenuTrigger,
} from "../../../components/menu";

export const Route = createFileRoute("/design-playground/elements/menu")({
	component: MenuElementPage,
});

function MenuElementPage() {
	return (
		<div className="menu-element-page">
			<MenuRoot>
				<MenuTrigger>
					<Button>Open menu</Button>
				</MenuTrigger>
				<MenuContent>
					<MenuSection>
						<MenuSectionHeader>
							<MenuSectionLabel>My account</MenuSectionLabel>
						</MenuSectionHeader>
						<MenuSectionContent>
							<MenuItem>
								<MenuItemIcon>
									<UserIcon />
								</MenuItemIcon>
								<MenuItemLabel>Profile</MenuItemLabel>
							</MenuItem>
							<MenuItem>
								<MenuItemIcon>
									<CreditCardIcon />
								</MenuItemIcon>
								<MenuItemLabel>Billing</MenuItemLabel>
							</MenuItem>
							<MenuItem>
								<MenuItemIcon>
									<SettingsIcon />
								</MenuItemIcon>
								<MenuItemLabel>Settings</MenuItemLabel>
							</MenuItem>
							<MenuItem>
								<MenuItemIcon>
									<BellIcon />
								</MenuItemIcon>
								<MenuItemLabel>Notifications</MenuItemLabel>
							</MenuItem>
						</MenuSectionContent>
					</MenuSection>
					<MenuSection>
						<MenuSectionHeader>
							<MenuSectionLabel>Team</MenuSectionLabel>
						</MenuSectionHeader>
						<MenuSectionContent>
							<MenuItem>
								<MenuItemLabel>Members</MenuItemLabel>
							</MenuItem>
							<MenuItem>
								<MenuItemLabel>Settings</MenuItemLabel>
							</MenuItem>
							<MenuItem>
								<MenuItemLabel>Billing</MenuItemLabel>
							</MenuItem>
						</MenuSectionContent>
					</MenuSection>
					<MenuSection>
						<MenuSectionContent>
							<MenuItem>
								<MenuItemLabel>Sign out</MenuItemLabel>
							</MenuItem>
						</MenuSectionContent>
					</MenuSection>
				</MenuContent>
			</MenuRoot>
		</div>
	);
}
