const APP_SHELL = {
    layout: "flex min-h-screen flex-col",
    sidebar: "hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col",
    outlet: "flex flex-1 flex-col md:pl-64"
}
const SIDEBAR = {
    layout: "flex flex-col h-full bg-gradient-to-t from-blue-900/80 to-blue-500/90 border-r border-cyan-500 w-64 p-4",
    navigation: "flex-1 space-y-1",
    navlink: "flex items-center gap-3 px-3 py-2 rounded-md text-cyan-50 hover:bg-cyan-500/50 transition-colors",
    active: "bg-cyan-500/50"
}
const MOBILE_NAV = {
    layout: "fixed inset-x-0 bottom-0 z-30 border-t border-cyan-500 bg-gradient-to-t from-blue-900/90 to-blue-700/90 transition-all duration-300 ease-in-out md:hidden",
}
const ICON = {
    size: {
        xs: "w-3 h-3",
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6",
        xl: "w-8 h-8"
    },
    color: {
        default: "text-cyan-400",
        light: "text-cyan-50",
        dark: "text-cyan-600"
    }
}
const TEXT = {
    sidebar: "text-sm font-medium"
}

export const theme = {
    shell: APP_SHELL,
    sidebar: SIDEBAR,
    mobnav: MOBILE_NAV,
    icon: ICON,
    text: TEXT
}

// ${theme.shell.layout}
// ${theme.shell.sidebar}
// ${theme.shell.outlet}

// ${theme.sidebar.layout}
// ${theme.sidebar.navigation}
// ${theme.sidebar.navlink}

// ${theme.icon.size.sm}


// ${theme.mobnav.layout}