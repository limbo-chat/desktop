// hopefully this still gets tree shaken
import * as lucide from "lucide-react";
import type { FC } from "react";
import type * as limbo from "@limbo/api";

const appIconMap: Record<limbo.AppIcon, FC> = {
	"add": lucide.Plus,
	"remove": lucide.Minus,
	"minimize": lucide.Minimize2,
	"maximize": lucide.Maximize2,
	"panel-left": lucide.PanelLeft,
	"panel-left-close": lucide.PanelLeftClose,
	"panel-right": lucide.PanelRight,
	"panel-right-close": lucide.PanelRightClose,
	"close": lucide.X,
	"compose": lucide.PenSquare,
	"search": lucide.Search,
	"filter": lucide.Filter,
	"sort": lucide.ArrowUpDown,
	"save": lucide.Save,
	"edit": lucide.Edit,
	"delete": lucide.Trash2,
	"refresh": lucide.RefreshCcw,
	"send": lucide.ArrowUp,
	"stop": lucide.StopCircle,
	"download": lucide.Download,
	"upload": lucide.Upload,
	"share": lucide.Share2,
	"undo": lucide.Undo,
	"redo": lucide.Redo,
	"lock": lucide.Lock,
	"unlock": lucide.Unlock,
	"archive": lucide.Archive,
	"menu": lucide.EllipsisVertical,
	"copy": lucide.Copy,
	"check": lucide.Check,
	"collapse": lucide.ChevronUp,
	"expand": lucide.ChevronDown,
	"reply": lucide.Reply,
	"print": lucide.Printer,
	"help": lucide.HelpCircle,
	"text": lucide.Text,
	"text-wrap": lucide.WrapText,
	"visibility": lucide.Eye,
	"visibility-off": lucide.EyeOff,
	"volume": lucide.Volume2,
	"volume-off": lucide.VolumeX,
	"bell": lucide.Bell,
	"bell-off": lucide.BellOff,
	"power": lucide.Power,
	"power-off": lucide.PowerOff,
	"wifi": lucide.Wifi,
	"wifi-off": lucide.WifiOff,
	"heart": lucide.Heart,
	"heart-off": lucide.HeartOff,
	"user": lucide.User,
	"group": lucide.Users,
	"file": lucide.File,
	"folder": lucide.Folder,
	"document": lucide.FileText,
	"link": lucide.Link,
	"image": lucide.Image,
	"video": lucide.Video,
	"home": lucide.Home,
	"settings": lucide.Settings,
	"terminal": lucide.Terminal,
	"code": lucide.Code,
	"bug": lucide.Bug,
	"calendar": lucide.Calendar,
	"clock": lucide.Clock,
	"clipboard": lucide.Clipboard,
	"bolt": lucide.Bolt,
	"key": lucide.Key,
	"tag": lucide.Tag,
	"flag": lucide.Flag,
	"location": lucide.MapPin,
	"bookmark": lucide.Bookmark,
	"activity": lucide.Activity,
	"hammer": lucide.Hammer,
	"credit-card": lucide.CreditCard,
	"success": lucide.CheckCircle,
	"error": lucide.XCircle,
	"warning": lucide.AlertTriangle,
	"info": lucide.Info,
	"loading": lucide.Loader2Icon,
	"arrow-left": lucide.ArrowLeft,
	"arrow-right": lucide.ArrowRight,
	"arrow-up": lucide.ArrowUp,
	"arrow-down": lucide.ArrowDown,
	"back": lucide.ChevronLeft,
	"forward": lucide.ChevronRight,
} as const;

export interface AppIconProps extends React.HTMLAttributes<HTMLElement> {
	icon: limbo.AppIcon;
}

export const AppIcon = ({ icon, ...props }: AppIconProps) => {
	const Icon = appIconMap[icon];

	return <Icon data-icon={icon} {...props} />;
};

export interface ImageLikeRendererProps {
	imageLike: limbo.ImageLike;
}

export const ImageLikeRenderer = ({ imageLike }: ImageLikeRendererProps) => {
	if (typeof imageLike === "string") {
		return <AppIcon icon={imageLike} />;
	}

	return <img src={imageLike.source} alt={imageLike.alt} />;
};
