import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { useShallow } from "zustand/shallow";
import {
	Alert,
	AlertActions,
	AlertContent,
	AlertDescription,
	AlertIcon,
	AlertInfo,
	AlertTitle,
} from "../../../components/alert";
import { AppIcon } from "../../../components/app-icon";
import { Button } from "../../../components/button";
import { Checkbox } from "../../../components/checkbox";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "../../../components/dialog";
import { Field } from "../../../components/field";
import * as FieldController from "../../../components/field-controller";
import * as Form from "../../../components/form-primitive";
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
import { RadioOption } from "../../../components/radio-group";
import * as RhfForm from "../../../components/rhf-form";
import {
	SelectContent,
	SelectIcon,
	SelectItem,
	SelectRoot,
	SelectTrigger,
	SelectValue,
} from "../../../components/select";
import { Tooltip } from "../../../components/tooltip";
import * as VerticalTabs from "../../../components/vertical-tabs-primitive";
import { MarkdownContainer } from "../../markdown/components/markdown-container";
import { MarkdownRenderer } from "../../markdown/components/markdown-renderer";
import { useModalContext } from "../../modals/hooks";
import { showModal } from "../../modals/utils";
import { Notification, type NotificationLevel } from "../../notifications/components";
import { useDesignPlaygroundTabsStore } from "../stores";
import {
	ComponentPreview,
	ComponentPreviewContent,
	ComponentPreviewPanel,
} from "./component-preview";

const ButtonTabContent = () => {
	const [isDisabled, setIsDisabled] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	return (
		<ComponentPreview>
			<ComponentPreviewContent>
				<Button disabled={isDisabled} isLoading={isLoading}>
					Click me
				</Button>
			</ComponentPreviewContent>
			<ComponentPreviewPanel>
				<Field id="disabled" label="Disabled?">
					<Checkbox
						checked={isDisabled}
						onCheckedChange={(isChecked) => setIsDisabled(isChecked as boolean)}
					/>
				</Field>
				<Field id="loading" label="Loading?">
					<Checkbox
						checked={isLoading}
						onCheckedChange={(isChecked) => setIsLoading(isChecked as boolean)}
					/>
				</Field>
			</ComponentPreviewPanel>
		</ComponentPreview>
	);
};

const TooltipTabContent = () => {
	const [placement, setPlacement] = useState("top");

	return (
		<ComponentPreview>
			<ComponentPreviewContent>
				<Tooltip open label="Tooltip label" contentProps={{ side: placement as any }}>
					<Button>Trigger</Button>
				</Tooltip>
			</ComponentPreviewContent>
			<ComponentPreviewPanel>
				<Field id="placement" label="Placement">
					<SelectRoot value={placement} onValueChange={setPlacement}>
						<SelectTrigger>
							<SelectValue />
							<SelectIcon />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="top">Top</SelectItem>
							<SelectItem value="right">Right</SelectItem>
							<SelectItem value="bottom">Bottom</SelectItem>
							<SelectItem value="left">Left</SelectItem>
						</SelectContent>
					</SelectRoot>
				</Field>
			</ComponentPreviewPanel>
		</ComponentPreview>
	);
};

const NotificationTabContent = () => {
	const [level, setLevel] = useState<NotificationLevel>("info");

	return (
		<ComponentPreview>
			<ComponentPreviewContent>
				<Notification
					level={level}
					title="Notification title"
					message={"This is a notification"}
					onClose={() => {}}
				/>
			</ComponentPreviewContent>
			<ComponentPreviewPanel>
				<Field id="level" label="Level">
					<SelectRoot
						value={level}
						onValueChange={(value) => setLevel(value as NotificationLevel)}
					>
						<SelectTrigger>
							<SelectValue />
							<SelectIcon />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="info">Info</SelectItem>
							<SelectItem value="warning">Warning</SelectItem>
							<SelectItem value="error">Error</SelectItem>
						</SelectContent>
					</SelectRoot>
				</Field>
			</ComponentPreviewPanel>
		</ComponentPreview>
	);
};

const MenuTabContent = () => {
	return (
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
								<AppIcon icon="user" />
							</MenuItemIcon>
							<MenuItemLabel>Profile</MenuItemLabel>
						</MenuItem>
						<MenuItem>
							<MenuItemIcon>
								<AppIcon icon="credit-card" />
							</MenuItemIcon>
							<MenuItemLabel>Billing</MenuItemLabel>
						</MenuItem>
						<MenuItem>
							<MenuItemIcon>
								<AppIcon icon="settings" />
							</MenuItemIcon>
							<MenuItemLabel>Settings</MenuItemLabel>
						</MenuItem>
						<MenuItem>
							<MenuItemIcon>
								<AppIcon icon="bell" />
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
	);
};

const AlertTabContent = () => {
	return (
		<ComponentPreview>
			<ComponentPreviewContent>
				<Alert variant="info">
					<AlertIcon>
						<AppIcon icon="info" />
					</AlertIcon>
					<AlertContent>
						<AlertInfo>
							<AlertTitle>Alert title</AlertTitle>
							<AlertDescription>This is an alert description</AlertDescription>
						</AlertInfo>
						<AlertActions>
							<Button>Action</Button>
						</AlertActions>
					</AlertContent>
				</Alert>
			</ComponentPreviewContent>
		</ComponentPreview>
	);
};

const demoFormSchema = z.object({
	username: z.string().min(2).max(50),
	about: z
		.string()
		.min(10, {
			message: "Please provide at least 10 characters about yourself",
		})
		.max(500, {
			message: "Too long",
		}),
	firstName: z.string().min(1, { message: "First name is required" }),
	lastName: z.string().min(1, { message: "Last name is required" }),
	visibility: z.enum(["public", "unlisted", "private"]),
});

const FormTabContent = () => {
	const form = useForm({
		resolver: zodResolver(demoFormSchema),
		defaultValues: {
			visibility: "public",
		},
	});

	const handleSubmit = form.handleSubmit((data) => {
		console.log(data);
	});

	return (
		<FormProvider {...form}>
			<Form.Root onSubmit={handleSubmit}>
				<Form.Content>
					<Form.Section id="profile">
						<Form.SectionHeader>
							<Form.SectionTitle>Profile</Form.SectionTitle>
							<Form.SectionDescription>
								This information will be displayed publicly so be careful what you
								share
							</Form.SectionDescription>
						</Form.SectionHeader>
						<Form.SectionContent>
							<FieldController.Root id="username" name="username" label="Username">
								<FieldController.TextInput placeholder="limbo.com/johndoe" />
							</FieldController.Root>
							<FieldController.Root
								id="about"
								name="about"
								label="About"
								description="Write a few sentences about yourself"
							>
								<FieldController.Textarea placeholder="Textareas allow a user to write a lot of text" />
							</FieldController.Root>
						</Form.SectionContent>
					</Form.Section>
					<Form.Section id="personal-information">
						<Form.SectionHeader>
							<Form.SectionTitle>Personal information</Form.SectionTitle>
							<Form.SectionDescription>
								Use a permanent address where you can receive mail.
							</Form.SectionDescription>
						</Form.SectionHeader>
						<Form.SectionContent>
							<FieldController.Root
								id="first-name"
								name="firstName"
								label="First name"
							>
								<FieldController.TextInput placeholder="John" />
							</FieldController.Root>
							<FieldController.Root id="last-name" name="lastName" label="Last name">
								<FieldController.TextInput placeholder="Doe" />
							</FieldController.Root>
						</Form.SectionContent>
					</Form.Section>
					<Form.Section id="notifications">
						<Form.SectionHeader>
							<Form.SectionTitle>Notifications</Form.SectionTitle>
							<Form.SectionDescription>
								We'll always let you know about important changes, but you pick what
								else you want to hear about.
							</Form.SectionDescription>
						</Form.SectionHeader>
						<Form.SectionContent>
							<FieldController.Root
								id="visibility"
								name="visibility"
								label="Visibility"
							>
								<FieldController.RadioGroup>
									<RadioOption value="public" label="Public" />
									<RadioOption value="unlisted" label="Unlisted" />
									<RadioOption value="private" label="Private" />
								</FieldController.RadioGroup>
							</FieldController.Root>
						</Form.SectionContent>
					</Form.Section>
				</Form.Content>
				<Form.Footer>
					<Form.Actions>
						<RhfForm.ResetButton>Cancel</RhfForm.ResetButton>
						<Form.SubmitButton>Submit</Form.SubmitButton>
					</Form.Actions>
				</Form.Footer>
			</Form.Root>
		</FormProvider>
	);
};

const DemoDialog = () => {
	const modalCtx = useModalContext();

	return (
		<Dialog>
			<DialogHeader>
				<DialogTitle>Hello world!</DialogTitle>
				<DialogDescription>This is a dialog</DialogDescription>
			</DialogHeader>
			<DialogContent>
				<p>
					Amet sit nisi ut velit sit non quis. Velit quis qui est do irure nisi aute.
					Dolor do reprehenderit non. Lorem consequat ex irure quis dolore est. Est anim
					magna et irure consequat est id. Enim fugiat sint in sint adipisicing laborum
					veniam. Et ipsum adipisicing ipsum proident deserunt culpa ex. Quis tempor
					commodo commodo anim.
				</p>
			</DialogContent>
			<DialogFooter>
				<DialogActions>
					<Button onClick={modalCtx.close}>Close dialog</Button>
				</DialogActions>
			</DialogFooter>
		</Dialog>
	);
};

const DialogTabContent = () => {
	return (
		<Button
			onClick={() =>
				showModal({
					id: "demo-dialog",
					component: DemoDialog,
				})
			}
		>
			Open dialog
		</Button>
	);
};

const markdownContent = `

# Markdown playground

See how your custom styles affect this page

---

# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

## Emphasis

*This is italic text*

**This is bold text**

~~Strikethrough~~

[this is a link](https://github.com/limbo-llm)

> This is a blockquote
>> Nested blockquote

## Horizontal rule

---

## Lists

### Unordered

- Lorem ipsum dolor sit amet
- Consectetur adipiscing elit
- Integer molestie lorem at massa

### Orderered

1. Limbo supports custom styles
2. Limbo plugins can override markdown elements
3. Limbo plugins can register tools and models

## Tables

| Option | Description |
| ------ | ----------- |
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |

## Images
![random image 1](https://picsum.photos/500/300)
![random image 2](https://picsum.photos/500/400)

## Code

### TypeScript land

\`\`\`typescript
// single line comment

/*
	multi line comment
	second line
*/

/**
 * JSDoc comment
 * 
 * @param message - The message to print
 * @returns void
*/

function print(message: string): void {
	console.log(message);
}

const message = \`2 + 2 = \${2 + 2};\`

print(message);
\`\`\`

\`\`\`tsx
/* Remix page */

import { useState } from "react";
import { useLoaderData, type LoaderFunctionArgs } from "react-router";

export function loader(args: LoaderFunctionArgs) {
	const time = new Date().toISOString();

	return {
		time
	}
}

export default function HomePage() {
	const { time } = useLoaderData<typeof loader>();
	const [count, setCount] = useState(0);

	return (
		<div>
			<h1>Welcome to the Home Page</h1>
			<span>Current time: {time}</span>
			<button onClick={() => setCount(prev => prev + 1)}>{count}</button>
		</div>
	);
}
\`\`\`

### Rust land

\`\`\`rust
enum Message {
    Hello,
}

fn main() {
    let msg = Message::Hello;

    match msg {
        Message::Hello => println!("Hello, world!"),
    }
}
\`\`\`

### Python land

\`\`\`python
# this is a comment
def hello_world():
	print("Hello World!")
\`\`\`
`;

const MarkdownTabContent = () => {
	return (
		<MarkdownContainer>
			<MarkdownRenderer content={markdownContent} />
		</MarkdownContainer>
	);
};

export const DesignPlaygroundTabs = () => {
	const designPlaygroundTabsStore = useDesignPlaygroundTabsStore(
		useShallow((state) => ({
			activeTab: state.activeTab,
			setActiveTab: state.setActiveTab,
		}))
	);

	return (
		<VerticalTabs.Root
			defaultValue="button"
			value={designPlaygroundTabsStore.activeTab ?? undefined}
			onValueChange={designPlaygroundTabsStore.setActiveTab}
		>
			<VerticalTabs.List>
				<VerticalTabs.ListSection>
					<VerticalTabs.ListSectionContent>
						<VerticalTabs.ListSectionHeader>
							<VerticalTabs.ListSectionTitle>Atoms</VerticalTabs.ListSectionTitle>
						</VerticalTabs.ListSectionHeader>
						<VerticalTabs.ListSectionContent>
							<VerticalTabs.ListSectionItem value="button">
								Button
							</VerticalTabs.ListSectionItem>
							<VerticalTabs.ListSectionItem value="tooltip">
								Tooltip
							</VerticalTabs.ListSectionItem>
							<VerticalTabs.ListSectionItem value="notification">
								Notification
							</VerticalTabs.ListSectionItem>
							<VerticalTabs.ListSectionItem value="menu">
								Menu
							</VerticalTabs.ListSectionItem>
							<VerticalTabs.ListSectionItem value="alert">
								Alert
							</VerticalTabs.ListSectionItem>
							<VerticalTabs.ListSectionItem value="form">
								Form
							</VerticalTabs.ListSectionItem>
							<VerticalTabs.ListSectionItem value="dialog">
								Dialog
							</VerticalTabs.ListSectionItem>
							<VerticalTabs.ListSectionItem value="markdown">
								Markdown
							</VerticalTabs.ListSectionItem>
						</VerticalTabs.ListSectionContent>
					</VerticalTabs.ListSectionContent>
				</VerticalTabs.ListSection>
			</VerticalTabs.List>
			<VerticalTabs.Content value="button">
				<ButtonTabContent />
			</VerticalTabs.Content>
			<VerticalTabs.Content value="tooltip">
				<TooltipTabContent />
			</VerticalTabs.Content>
			<VerticalTabs.Content value="notification">
				<NotificationTabContent />
			</VerticalTabs.Content>
			<VerticalTabs.Content value="menu">
				<MenuTabContent />
			</VerticalTabs.Content>
			<VerticalTabs.Content value="alert">
				<AlertTabContent />
			</VerticalTabs.Content>
			<VerticalTabs.Content value="form">
				<FormTabContent />
			</VerticalTabs.Content>
			<VerticalTabs.Content value="dialog">
				<DialogTabContent />
			</VerticalTabs.Content>
			<VerticalTabs.Content value="markdown">
				<MarkdownTabContent />
			</VerticalTabs.Content>
		</VerticalTabs.Root>
	);
};
