const APP_SHELL = {
    layout: "flex min-h-screen flex-col",
    sidebar: "hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col",
    outlet: "flex flex-1 flex-col md:pl-64"
}
const SIDEBAR = {
    layout: "flex flex-col h-full bg-gradient-to-t from-brand-900/80 to-brand-500/90 border-r border-accent-500 w-64 p-4",
    navigation: "flex-1 space-y-1",
    navlink: "flex items-center gap-3 px-3 py-2 rounded-md text-accent-50 hover:bg-accent-500/50 transition-colors",
    active: "bg-accent-500/50"
}
const MOBILE_NAV = {
    layout: "fixed inset-x-0 bottom-0 z-30 border-t border-accent-500 bg-gradient-to-t from-brand-900/90 to-brand-700/90 transition-all duration-300 ease-in-out md:hidden",
}
const OUTLET = {
    page: "max-w-8xl",
    header: "h-[8vh] lg:h-[8vh] bg-brand-700/40",
    content: "max-h-[81vh] lg:max-h-[92vh] overflow-y-scroll p-3 space-y-2",
}
const HEADER = {
    layout: "p-3 flex items-center justify-between h-full",
    title: "flex items-center gap-2 h-full text-xl font-bold text-accent-400"
}
const CARD = {
    layout: "p-3 bg-gradient-to-r from-brand-900/80 to-brand-500/90 rounded-xl border border-accent-500 hover:border-accent-300 transition-colors",
    header: "h-12", // bg-danger-500/50 for debugging
    title_layout: "flex gap-2 items-center truncate justify-between",
    title_text: "text-md font-medium text-white",
    title_text_xp: "text-lg font-bold text-white",
    profile_initial: "rounded-full h-12 w-12 flex items-center justify-center font-light text-2xl bg-accent-600 text-accent-50",
    profile_layout: "flex gap-2 items-center",
    profile_tag: "text-xs text-accent-300 font-medium",
    selection_area: "relative w-full h-12 cursor-pointer mt-[-3rem]",
    content: "mt-3 space-y-3", //debug bg-danger-500/50
    content_section: "text-accent-50 space-y-2 text-xs",
    section_title: "text-sm font-medium text-accent-400",
    icon_list: "flex gap-2 items-center",
    item_list: "flex-1 space-y-2",
    item_index: "pl-3 border-l-2 border-accent-400 space-y-2",
    items: "flex items-center justify-between",
    item_text: "text-xs font-bold text-accent-50",
    item_sub_text: "text-xs font-medium text-muted-400 space-y-1",
    tags: "inline-block py-1 text-xs font-medium rounded text-xs font-medium text-accent-400",
    tag: "inline-block px-2 py-1 text-xs font-medium rounded text-xs font-medium text-accent-400 bg-accent-800",
    action_grid: "flex gap-1 items-center mt-3",
    timestamp: "flex justify-between text-xs text-accent-400",
}
const FORM = {
    layout: "space-y-3",
    label: "block text-xs font-medium text-accent-400 mb-1",
    input: "w-full px-3 py-2 border border-accent-500 rounded focus:outline-none focus:ring-2 focus:ring-brand-500 bg-brand-800/70 text-accent-50",
    inputText: "w-full px-3 py-2 border border-accent-50 rounded focus:outline-none focus:ring-2 focus:ring-brand-500",
    action: "flex flex-col sm:flex-row gap-2 pt-2",
    index: "p-2 rounded-lg bg-muted-800/30 border border-muted-700",
    sub_layout: "flex items-center gap-2 justify-between"
}
const ICON = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
}
const TEXT = {
    sidebar: "text-sm font-medium"
}
const BUTTON = {
    layout: "p-2 flex items-center justify-center gap-1 cursor-pointer border rounded-md",
    icon: "p-2 text-accent-400 hover:text-accent-200 bg-accent-800/50 hover:bg-accent-700/50 rounded-md",
    solid: "p-2 flex items-center justify-center gap-2 cursor-pointer border rounded-md w-full transition-colors bg-gradient-to-t from-accent-700 to-accent-500 hover:from-accent-600 hover:to-accent-400 border-accent-500 hover:border-accent-300 text-accent-200 hover:text-accent-50",
    outline: "p-2 flex items-center justify-center gap-2 cursor-pointer border rounded-md w-full transition-colors bg-gradient-to-t from-brand-700/60 to-brand-800/60 hover:from-brand-600/70 hover:to-brand-500/70 border-accent-500 hover:border-accent-300 text-accent-500 hover:text-accent-300",
}
export const SYSTEM = {
    error: "text-danger-700 text-center p-8",
    notice: "text-accent-400 text-center p-8"
}

export const theme = {
    shell: APP_SHELL,
    sidebar: SIDEBAR,
    mobnav: MOBILE_NAV,
    outlet: OUTLET,
    header: HEADER,
    card: CARD,
    form: FORM,
    icon: ICON,
    text: TEXT,
    button: BUTTON,
    system: SYSTEM,
}

// ${theme.shell.layout}
// ${theme.shell.sidebar}
// ${theme.shell.outlet}

// ${theme.sidebar.layout}
// ${theme.sidebar.navigation}
// ${theme.sidebar.navlink}

// ${theme.icon.size.sm}


// ${theme.mobnav.layout}