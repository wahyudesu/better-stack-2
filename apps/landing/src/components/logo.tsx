import type React from "react";

export const LogoIcon = (props: React.ComponentProps<"img">) => (
	<img src="/logo.png" alt="Logo" {...props} />
);

export const Logo = (props: React.ComponentProps<"img">) => (
	<img src="/logo.png" alt="Better Stack" {...props} />
);
