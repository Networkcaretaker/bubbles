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
const OUTLET = {
    page: "max-w-8xl",
    header: "h-[8vh] lg:h-[8vh] bg-blue-700/40",
    content: "max-h-[81vh] lg:max-h-[92vh] overflow-y-scroll p-3 space-y-2",
}
const HEADER = {
    layout: "p-3 flex items-center justify-between h-full",
    title: "flex items-center gap-2 h-full text-xl font-bold text-cyan-400"
}
const CARD = {
    layout: "p-3 bg-gradient-to-r from-blue-900/80 to-blue-500/90 rounded-xl border border-cyan-500 hover:border-cyan-300 transition-colors",
    header: "h-12", // bg-red-500/50 for debugging
    title_layout: "flex gap-2 items-center truncate justify-between",
    title_text: "text-md font-medium text-white",
    title_text_xp: "text-lg font-bold text-white",
    profile_initial: "rounded-full h-12 w-12 flex items-center justify-center font-light text-2xl bg-cyan-600 text-cyan-50",
    profile_layout: "flex gap-2 items-center",
    profile_tag: "text-xs text-cyan-300 font-medium",
    selection_area: "relative w-full h-12 cursor-pointer mt-[-3rem]",
    content: "mt-3 space-y-3 bg-red-500/50", //debug
    content_section: "text-cyan-50 space-y-2 text-xs",
    section_title: "text-sm font-medium text-cyan-400",
    icon_list: "flex gap-2 items-center",
    item_list: "flex-1 space-y-2",
    item_index: "pl-3 border-l-2 border-cyan-400 space-y-2",
    items: "flex items-center justify-between",
    item_text: "text-xs font-bold text-cyan-50",
    item_sub_text: "text-xs font-medium text-gray-400 space-y-1",
    tags: "inline-block py-1 text-xs font-medium rounded text-xs font-medium text-cyan-400",
    tag: "inline-block px-2 py-1 text-xs font-medium rounded text-xs font-medium text-cyan-400 bg-cyan-800",
    action_grid: "flex gap-1 items-center mt-3",
    timestamp: "flex justify-between text-xs text-cyan-400",
}
const FORM = {
    layout: "space-y-3",
    label: "block text-xs font-medium text-cyan-400 mb-1",
    input: "w-full px-3 py-2 border border-cyan-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-800/70 text-cyan-50",
    inputText: "w-full px-3 py-2 border border-cyan-50 rounded focus:outline-none focus:ring-2 focus:ring-blue-500",
    action: "flex flex-col sm:flex-row gap-2 pt-2",
    index: "p-2 rounded-lg bg-gray-800/30 border border-gray-700",
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
    icon: "p-2 text-cyan-400 hover:text-cyan-200 bg-cyan-800/50 hover:bg-cyan-700/50 rounded-md",
    solid: "p-2 flex items-center justify-center gap-2 cursor-pointer border rounded-md w-full transition-colors bg-gradient-to-t from-cyan-700 to-cyan-500 hover:from-cyan-600 hover:to-cyan-400 border-cyan-500 hover:border-cyan-300 text-cyan-200 hover:text-cyan-50",
    outline: "p-2 flex items-center justify-center gap-2 cursor-pointer border rounded-md w-full transition-colors bg-gradient-to-t from-blue-700/60 to-blue-800/60 hover:from-blue-600/70 hover:to-blue-500/70 border-cyan-500 hover:border-cyan-300 text-cyan-500 hover:text-cyan-300",
}
export const SYSTEM = {
    error: "text-red-700 text-center p-8",
    notice: "text-cyan-400 text-center p-8"
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