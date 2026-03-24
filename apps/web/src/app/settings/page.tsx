"use client";

import {
  Users,
  Puzzle,
  User,
  Settings,
  Zap,
  CreditCard,
  Sparkles,
  Download,
  Shield,
  Palette,
} from "lucide-react";
import { useState, Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { pageContainerClassName, pageMaxWidth } from "@/lib/layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { teamMembers } from "@/data/mock";
import { cn, selectHandler } from "@/lib/utils";
import { TeamMemberCard } from "@/components/ui/TeamMemberCard";
import { IntegrationCard } from "@/components/ui/IntegrationCard";
import { PlatformIcon, type Platform } from "@/components/ui/PlatformIcon";
import { useTheme } from "next-themes";

// Mock user data (replace with actual auth when ClerkProvider is set up)
const mockUser = {
  id: "user_2xyz123abc",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  imageUrl: "",
  createdAt: new Date("2024-01-15"),
  lastSignInAt: new Date("2024-03-19"),
  emailVerified: true,
  twoFactorEnabled: false,
};

const tabs = [
  {
    id: "account",
    label: "Account",
    icon: User,
    title: "Account",
    description: "Manage your personal information",
  },
  {
    id: "connections",
    label: "Connections",
    icon: Puzzle,
    title: "Connections",
    description: "Manage your social media connections",
  },
  {
    id: "team",
    label: "Team",
    icon: Users,
    title: "Team Members",
    description: "Manage your team and permissions",
  },
  {
    id: "billing",
    label: "Billing",
    icon: CreditCard,
    title: "Billing",
    description: "Manage your subscription and payments",
  },
  {
    id: "preferences",
    label: "Preferences",
    icon: Settings,
    title: "Preferences",
    description: "Customize your app experience",
  },
  {
    id: "security",
    label: "Security",
    icon: Shield,
    title: "Security",
    description: "Manage your security settings",
  },
] as const;

type TabId = (typeof tabs)[number]["id"];

function AccountTab() {
    const [fullName, setFullName] = useState(() => {
      if (mockUser.firstName && mockUser.lastName) {
        return `${mockUser.firstName} ${mockUser.lastName}`;
      }
      return mockUser.firstName || mockUser.email.split('@')[0] || "";
    });
    const [jobTitle, setJobTitle] = useState("User");
    const [originalFullName] = useState(() => {
      if (mockUser.firstName && mockUser.lastName) {
        return `${mockUser.firstName} ${mockUser.lastName}`;
      }
      return mockUser.firstName || mockUser.email.split('@')[0] || "";
    });
    const [originalJobTitle] = useState("User");
    const [avatarUrl, setAvatarUrl] = useState(mockUser.imageUrl || "");
    const [email] = useState(mockUser.email || "");
    const [userId] = useState(mockUser.id || "");

  const hasChanges =
    fullName !== originalFullName || jobTitle !== originalJobTitle;

  const handleAvatarClick = () => {
    // Would trigger Clerk's avatar upload in production
    console.log("Open avatar upload");
  };

const handleSave = async () => {
      // Update user profile
      console.log("Profile updated:", fullName);
    };

    // Get user initials for fallback
    const getInitials = () => {
      if (mockUser.firstName && mockUser.lastName) {
        return `${mockUser.firstName[0]}${mockUser.lastName[0]}`.toUpperCase();
      }
      if (mockUser.firstName) {
        return mockUser.firstName[0].toUpperCase();
      }
      if (mockUser.email) {
        return mockUser.email[0].toUpperCase();
      }
      return "U";
    };

  return (
    <div className="flex flex-col gap-6">
      <Card className="border-border/50">
        <CardContent className="p-6 flex flex-col gap-6">
          <div>
            <p className="font-display font-semibold text-base">Profile</p>
            <p className="text-sm text-muted-foreground">
              Manage your personal information.
            </p>
          </div>

          {/* Clickable Avatar */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleAvatarClick}
              className="relative group cursor-pointer"
            >
<Avatar className="size-16 ring-2 ring-border group-hover:ring-primary transition-all">
                  <AvatarImage src={mockUser.imageUrl} />
                  <AvatarFallback>{getInitials()}</AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs font-medium">Change</span>
                </div>
              </button>
              <div>
                <p className="text-sm font-medium">Profile Photo</p>
                <p className="text-xs text-muted-foreground">
                  Upload a profile photo
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label className="text-sm">First Name</Label>
                <Input
                  value={mockUser.firstName || ""}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-10 font-medium"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-sm">Last Name</Label>
                <Input
                  value={mockUser.lastName || ""}
                  className="h-10 font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Email</Label>
              <Input
                value={email}
                type="email"
                className="h-10 bg-muted/50 cursor-not-allowed font-medium"
                disabled
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed
              </p>
            </div>

          {/* Account Info */}
          <div className="space-y-2">
            <Label className="text-sm">Account ID</Label>
            <div className="flex items-center gap-2">
              <Input
                value={userId}
                readOnly
                className="h-10 bg-muted/50 font-mono text-xs"
              />
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0"
                onClick={() => {
                  navigator.clipboard.writeText(userId);
                }}
              >
                <Sparkles className="size-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Your unique account identifier
            </p>
          </div>

          {/* Save Button - Only show when there are changes */}
          {hasChanges && (
            <div className="flex justify-end pt-2">
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardContent className="p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="size-4 text-amber-500" />
              <div>
                <p className="font-display font-semibold text-sm">Plan Usage</p>
                <p className="text-xs text-muted-foreground">
                  Pro Plan • Resets monthly
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Upgrade
            </Button>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">AI Generations</span>
                <span className="font-medium">847 / 1,000</span>
              </div>
              <Progress value={84.7} className="h-2" />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Scheduled Posts</span>
                <span className="font-medium">23 / 50</span>
              </div>
              <Progress value={46} className="h-2" />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  Connected Accounts
                </span>
                <span className="font-medium">5 / 10</span>
              </div>
              <Progress value={50} className="h-2" />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Storage Used</span>
                <span className="font-medium">2.3 GB / 5 GB</span>
              </div>
              <Progress value={46} className="h-2" />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Team Members</span>
                <span className="font-medium">3 / 5</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardContent className="p-4 space-y-3">
          <div>
            <p className="font-display font-semibold text-sm">Notifications</p>
            <p className="text-xs text-muted-foreground">
              Configure how you receive notifications.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-1">
              <div>
                <p className="text-sm font-medium">Email Notifications</p>
                <p className="text-xs text-muted-foreground">
                  Receive daily digest of activity
                </p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between py-1">
              <div>
                <p className="text-sm font-medium">Push Notifications</p>
                <p className="text-xs text-muted-foreground">
                  Browser push notifications
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display font-semibold text-sm text-destructive">
                Danger Zone
              </p>
              <p className="text-xs text-muted-foreground">
                Irreversible and destructive actions.
              </p>
            </div>
<Button
                variant="destructive"
                size="sm"
                onClick={() => console.log("Delete account")}
              >
                Manage Account
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Contact support to delete your account
            </p>
          </CardContent>
        </Card>

        {/* Account Info Card */}
        <Card className="border-border/50">
          <CardContent className="p-4 space-y-3">
            <div>
              <p className="font-display font-semibold text-sm">Account Information</p>
              <p className="text-xs text-muted-foreground">
                Your account details
              </p>
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account Created</span>
                <span className="font-medium">
                  {mockUser.createdAt ? new Date(mockUser.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Sign In</span>
                <span className="font-medium">
                  {mockUser.lastSignInAt ? new Date(mockUser.lastSignInAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email Verified</span>
                <span className={mockUser.emailVerified
                  ? 'font-medium text-green-600'
                  : 'font-medium text-amber-600'}>
                  {mockUser.emailVerified ? '✓ Verified' : 'Pending'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">2FA Enabled</span>
                <span className="font-medium">
                  {mockUser.twoFactorEnabled ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

      {/* Account Info Card */}
      <Card className="border-border/50">
        <CardContent className="p-4 space-y-3">
          <div>
            <p className="font-display font-semibold text-sm">Account Information</p>
            <p className="text-xs text-muted-foreground">
              Your account details from Clerk
            </p>
          </div>
<div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account Created</span>
                <span className="font-medium">
                  {mockUser.createdAt ? new Date(mockUser.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Sign In</span>
                <span className="font-medium">
                  {mockUser.lastSignInAt ? new Date(mockUser.lastSignInAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email Verified</span>
                <span className={mockUser.emailVerified
                  ? 'font-medium text-green-600'
                  : 'font-medium text-amber-600'}>
                  {mockUser.emailVerified ? '✓ Verified' : 'Pending'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">2FA Enabled</span>
                <span className="font-medium">
                  {mockUser.twoFactorEnabled ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TeamTab() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div />
        <Button size="sm">Invite</Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {teamMembers.map((m) => (
          <TeamMemberCard
            key={m.id}
            id={m.id}
            name={m.name}
            role={m.role}
            email={m.email}
            avatar={m.avatar}
            online={m.online}
            tasksCompleted={m.tasksCompleted}
          />
        ))}
      </div>
    </div>
  );
}

function ConnectionsTab() {
  const [connections, setConnections] = useState([
    {
      id: "instagram",
      name: "Instagram",
      platform: "instagram" as Platform,
      connected: true,
      handle: "@acme.studio",
      followers: "48.2K",
      posts: 342,
      color: "bg-pink-500/10",
    },
    {
      id: "tiktok",
      name: "TikTok",
      platform: "tiktok" as Platform,
      connected: true,
      handle: "@acmestudio",
      followers: "125.8K",
      posts: 89,
      color: "bg-gray-900/10",
    },
    {
      id: "whatsapp",
      name: "WhatsApp",
      platform: "whatsapp" as Platform,
      connected: false,
      handle: null,
      followers: null,
      posts: null,
      color: "bg-green-500/10",
    },
    {
      id: "facebook",
      name: "Facebook",
      platform: "facebook" as Platform,
      connected: true,
      handle: "Acme Corp",
      followers: "23.4K",
      posts: 156,
      color: "bg-blue-600/10",
    },
    {
      id: "youtube",
      name: "YouTube",
      platform: "youtube" as Platform,
      connected: true,
      handle: "Acme Studio",
      followers: "72.1K",
      posts: 128,
      color: "bg-red-600/10",
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      platform: "linkedin" as Platform,
      connected: false,
      handle: null,
      followers: null,
      posts: null,
      color: "bg-blue-700/10",
    },
    {
      id: "twitter",
      name: "X (Twitter)",
      platform: "twitter" as Platform,
      connected: true,
      handle: "@AcmeStudio",
      followers: "31.4K",
      posts: 1204,
      color: "bg-black/10",
    },
    {
      id: "threads",
      name: "Threads",
      platform: "threads" as Platform,
      connected: false,
      handle: null,
      followers: null,
      posts: null,
      color: "bg-black/10",
    },
    {
      id: "reddit",
      name: "Reddit",
      platform: "reddit" as Platform,
      connected: false,
      handle: null,
      followers: null,
      posts: null,
      color: "bg-orange-600/10",
    },
    {
      id: "pinterest",
      name: "Pinterest",
      platform: "pinterest" as Platform,
      connected: false,
      handle: null,
      followers: null,
      posts: null,
      color: "bg-red-700/10",
    },
    {
      id: "bluesky",
      name: "Bluesky",
      platform: "bluesky" as Platform,
      connected: false,
      handle: null,
      followers: null,
      posts: null,
      color: "bg-blue-400/10",
    },
    {
      id: "google",
      name: "Google Business",
      platform: "google" as Platform,
      connected: false,
      handle: null,
      followers: null,
      posts: null,
      color: "bg-blue-500/10",
    },
    {
      id: "telegram",
      name: "Telegram",
      platform: "telegram" as Platform,
      connected: false,
      handle: null,
      followers: null,
      posts: null,
      color: "bg-blue-500/10",
    },
    {
      id: "snapchat",
      name: "Snapchat",
      platform: "snapchat" as Platform,
      connected: false,
      handle: null,
      followers: null,
      posts: null,
      color: "bg-yellow-400/10",
    },
  ]);

  const [disconnectDialog, setDisconnectDialog] = useState<{
    open: boolean;
    platformId: string;
    platformName: string;
  }>({
    open: false,
    platformId: "",
    platformName: "",
  });

  const connectedPlatforms = connections.filter((c) => c.connected);
  const availablePlatforms = connections.filter((c) => !c.connected);

  const toggleConnection = (id: string) => {
    setConnections((prev) =>
      prev.map((conn) => {
        if (conn.id === id) {
          if (conn.connected) {
            const platform = connections.find((c) => c.id === id);
            setDisconnectDialog({
              open: true,
              platformId: id,
              platformName: platform?.name || "",
            });
            return conn;
          } else {
            return {
              ...conn,
              connected: true,
              handle: `@${conn.name.toLowerCase()}`,
              followers: `${Math.floor(Math.random() * 100 + 10)}K`,
              posts: Math.floor(Math.random() * 500 + 50),
            };
          }
        }
        return conn;
      }),
    );
  };

  const confirmDisconnect = () => {
    setConnections((prev) =>
      prev.map((conn) => {
        if (conn.id === disconnectDialog.platformId) {
          return {
            ...conn,
            connected: false,
            handle: null,
            followers: null,
            posts: null,
          };
        }
        return conn;
      }),
    );
    setDisconnectDialog({ open: false, platformId: "", platformName: "" });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Connected Platforms */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <p className="font-display font-semibold text-sm">Connected</p>
          <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
            {connectedPlatforms.length}
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {connectedPlatforms.map((conn) => (
            <IntegrationCard
              key={conn.id}
              {...conn}
              onToggle={toggleConnection}
            />
          ))}
        </div>
      </div>

      {/* Available Platforms */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <p className="font-display font-semibold text-sm">Available</p>
          <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
            {availablePlatforms.length}
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {availablePlatforms.map((conn) => (
            <IntegrationCard
              key={conn.id}
              {...conn}
              onToggle={toggleConnection}
            />
          ))}
        </div>
      </div>

      <AlertDialog
        open={disconnectDialog.open}
        onOpenChange={(open) =>
          setDisconnectDialog({ ...disconnectDialog, open })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Disconnect {disconnectDialog.platformName}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to disconnect your{" "}
              {disconnectDialog.platformName} account? This will stop posting to
              this platform.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDisconnect}
              className="bg-destructive hover:bg-destructive/90"
            >
              Disconnect
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

type FirstDayOfWeek = "sunday" | "monday";
type TimeFormat = "12h" | "24h";

const timezones = [
  { value: "UTC", label: "UTC (Coordinated Universal Time)" },
  { value: "America/New_York", label: "Eastern Time (ET) - New York" },
  { value: "America/Chicago", label: "Central Time (CT) - Chicago" },
  { value: "America/Denver", label: "Mountain Time (MT) - Denver" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT) - Los Angeles" },
  { value: "Europe/London", label: "GMT - London" },
  { value: "Europe/Paris", label: "CET - Paris" },
  { value: "Europe/Berlin", label: "CET - Berlin" },
  { value: "Asia/Jakarta", label: "WIB - Jakarta" },
  { value: "Asia/Makassar", label: "WITA - Makassar" },
  { value: "Asia/Jayapura", label: "WIT - Jayapura" },
  { value: "Asia/Singapore", label: "SGT - Singapore" },
  { value: "Asia/Tokyo", label: "JST - Tokyo" },
  { value: "Asia/Shanghai", label: "CST - Shanghai" },
  { value: "Asia/Dubai", label: "GST - Dubai" },
  { value: "Australia/Sydney", label: "AEDT - Sydney" },
];

// Accent colors from archive
const accentColors = [
  { name: "Default", value: "default", color: "bg-foreground" },
  { name: "Blue", value: "blue", color: "bg-blue-500" },
  { name: "Green", value: "green", color: "bg-green-500" },
  { name: "Purple", value: "purple", color: "bg-purple-500" },
  { name: "Orange", value: "orange", color: "bg-orange-500" },
  { name: "Pink", value: "pink", color: "bg-pink-500" },
  { name: "Red", value: "red", color: "bg-red-500" },
  { name: "Cyan", value: "cyan", color: "bg-cyan-500" },
] as const;

const themeOptions = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
] as const;

function PreferencesTab() {
  const { theme, setTheme } = useTheme();
  const [firstDayOfWeek, setFirstDayOfWeek] =
    useState<FirstDayOfWeek>("monday");
  const [timezone, setTimezone] = useState("Asia/Jakarta");
  const [timeFormat, setTimeFormat] = useState<TimeFormat>("24h");
  const [selectedColor, setSelectedColor] = useState("default");
  const [animatedDock, setAnimatedDock] = useState(true);
  const [projectName, setProjectName] = useState("Acme Corp");
  const [publicStats, setPublicStats] = useState(false);

  return (
    <div className="space-y-4">
      {/* General Settings from Archive */}
      <Card className="border-border/50">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <p className="text-sm font-semibold">General</p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Project name</Label>
            <Input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium">Public stats</p>
              <p className="text-xs text-muted-foreground">
                Share your project statistics publicly
              </p>
            </div>
            <Switch
              checked={publicStats}
              onCheckedChange={setPublicStats}
            />
          </div>
        </CardContent>
      </Card>

      {/* Appearance Settings from Archive */}
      <Card className="border-border/50">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <p className="text-sm font-semibold">Appearance</p>
          </div>

          {/* Theme */}
          <div className="flex flex-col gap-3">
            <p className="text-xs text-muted-foreground">Theme</p>
            <div className="grid grid-cols-3 gap-3">
              {themeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-lg border p-3 transition-colors",
                    theme === option.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/50"
                  )}
                >
                  <div
                    className={cn(
                      "h-6 w-6 rounded-full border",
                      option.value === "light" && "bg-white border-gray-200",
                      option.value === "dark" && "bg-gray-900 border-gray-700",
                      option.value === "system" && "bg-gradient-to-r from-white to-gray-900 border-gray-400"
                    )}
                  />
                  <span className="text-xs font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Accent Color */}
          <div className="flex flex-col gap-3">
            <p className="text-xs text-muted-foreground">Accent Color</p>
            <div className="flex flex-wrap gap-2">
              {accentColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setSelectedColor(color.value)}
                  className={cn(
                    "group relative flex h-8 w-8 items-center justify-center rounded-full transition-transform hover:scale-110",
                    selectedColor === color.value && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                  )}
                  title={color.name}
                >
                  <div className={cn("h-6 w-6 rounded-full", color.color)} />
                </button>
              ))}
            </div>
          </div>

          {/* Animated Dock */}
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium">Animated Dock</p>
              <p className="text-xs text-muted-foreground">
                Enable or disable the animated dock effect
              </p>
            </div>
            <Switch
              checked={animatedDock}
              onCheckedChange={setAnimatedDock}
            />
          </div>
        </CardContent>
      </Card>

      {/* Original Calendar Settings */}
      <Card className="border-border/50">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display font-semibold text-sm">
                Calendar Settings
              </p>
              <p className="text-xs text-muted-foreground">
                Customize your calendar view preferences.
              </p>
            </div>
            <Button size="sm">Save</Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">First Day of Week</Label>
              <Select
                value={firstDayOfWeek}
                onValueChange={(v) => setFirstDayOfWeek(v as FirstDayOfWeek)}
              >
                <SelectTrigger className="w-full h-8 text-sm font-medium">
                  <SelectValue placeholder="Select first day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sunday">Sunday</SelectItem>
                  <SelectItem value="monday">Monday</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Timezone</Label>
              <Select value={timezone} onValueChange={selectHandler(setTimezone, "Asia/Jakarta")}>
                <SelectTrigger className="w-full h-8 text-sm font-medium">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Time Format</Label>
            <div className="flex items-center gap-3">
              <Select
                value={timeFormat}
                onValueChange={(v) => setTimeFormat(v as TimeFormat)}
              >
                <SelectTrigger className="w-[160px] h-8 text-sm font-medium">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12h">12 Hour (AM/PM)</SelectItem>
                  <SelectItem value="24h">24 Hour</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-xs text-muted-foreground">
                Preview: {timeFormat === "12h" ? "3:30 PM" : "15:30"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const billingHistory = [
  {
    id: 1,
    date: "Mar 1, 2024",
    amount: "$29.00",
    status: "Paid",
    invoice: "INV-2024-0301",
  },
  {
    id: 2,
    date: "Feb 1, 2024",
    amount: "$29.00",
    status: "Paid",
    invoice: "INV-2024-0201",
  },
  {
    id: 3,
    date: "Jan 1, 2024",
    amount: "$29.00",
    status: "Paid",
    invoice: "INV-2024-0101",
  },
  {
    id: 4,
    date: "Dec 1, 2023",
    amount: "$29.00",
    status: "Paid",
    invoice: "INV-2023-1201",
  },
];

function BillingTab() {
  return (
    <div className="flex flex-col gap-6">
      {/* Current Plan */}
      <Card className="border-border/50">
        <CardContent className="p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-display font-semibold">Pro Plan</p>
                <p className="text-xs text-muted-foreground">
                  $29/month • Renews on Apr 1, 2024
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Change Plan
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
              >
                Cancel
              </Button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-4">
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground">AI Generations</p>
              <p className="text-sm font-medium">847 / 1,000</p>
              <Progress value={84.7} className="h-1 mt-1.5" />
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground">Scheduled Posts</p>
              <p className="text-sm font-medium">23 / 50</p>
              <Progress value={46} className="h-1 mt-1.5" />
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground">
                Connected Accounts
              </p>
              <p className="text-sm font-medium">5 / 10</p>
              <Progress value={50} className="h-1 mt-1.5" />
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground">Team Members</p>
              <p className="text-sm font-medium">3 / 5</p>
              <Progress value={60} className="h-1 mt-1.5" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card className="border-border/50">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display font-semibold text-sm">
                Payment Method
              </p>
              <p className="text-xs text-muted-foreground">
                Manage your payment details
              </p>
            </div>
            <Button variant="outline" size="sm">
              Update
            </Button>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-800 rounded-md">
              <CreditCard className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">•••• •••• •••• 4242</p>
              <p className="text-xs text-muted-foreground">Expires 12/2025</p>
            </div>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
              Default
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card className="border-border/50">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display font-semibold text-sm">
                Billing History
              </p>
              <p className="text-xs text-muted-foreground">
                Download past invoices
              </p>
            </div>
          </div>
          <div className="space-y-1">
            {billingHistory.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2 hover:bg-muted/30 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-20">
                    {item.date}
                  </span>
                  <span className="text-sm font-medium">{item.invoice}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm">{item.amount}</span>
                  <span className="text-xs text-green-600 bg-green-500/10 px-1.5 py-0.5 rounded">
                    {item.status}
                  </span>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Security Tab from Archive
function SecurityTab() {
  return (
    <div className="space-y-5">
      <Card className="border-border/50">
        <CardContent className="p-5 space-y-3">
          <p className="text-sm font-semibold">Password</p>
          <div className="flex flex-col gap-3">
            <div className="space-y-2">
              <Label>Current password</Label>
              <Input type="password" />
            </div>
            <div className="space-y-2">
              <Label>New password</Label>
              <Input type="password" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button size="sm">Update</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardContent className="p-5 space-y-3">
          <p className="text-sm font-semibold">Two-factor authentication</p>
          <div className="flex items-center gap-3">
            <Switch />
            <span className="text-sm text-muted-foreground">Disabled</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SettingsPage() {
      const [activeTab, setActiveTab] = useState<TabId>("account");
      const activeTabData = tabs.find((tab) => tab.id === activeTab);

      return (
        <div className="mx-auto w-full max-w-[1024px] px-5 py-4 pb-24 space-y-6">
          <div className="text-center">
            <h1 className="font-display text-xl font-bold tracking-tight">
              {activeTabData?.title || "Settings"}
            </h1>
            <p className="text-xs text-muted-foreground">
              {activeTabData?.description || "Manage your settings"}
            </p>
          </div>

          <div className="flex gap-6">
            <nav className="w-[130px] shrink-0 space-y-0.5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition-colors",
                  activeTab === tab.id
                    ? "bg-muted font-semibold text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex-1 min-w-0">
            <Suspense fallback={<SettingsTabSkeleton />}>
              {activeTab === "account" && <AccountTab />}
              {activeTab === "connections" && <ConnectionsTab />}
              {activeTab === "team" && <TeamTab />}
              {activeTab === "billing" && <BillingTab />}
              {activeTab === "preferences" && <PreferencesTab />}
              {activeTab === "security" && <SecurityTab />}
            </Suspense>
          </div>
        </div>
      </div>
    );
  }

function SettingsTabSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-32 bg-muted/30 rounded-lg" />
      <div className="h-32 bg-muted/30 rounded-lg" />
    </div>
  );
}
