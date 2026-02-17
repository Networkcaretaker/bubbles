export const PageLayout = {
    page: "max-w-8xl mx-auto",
    header: "h-[8vh] md:h-[8vh] fixed",
    title: "flex items-center gap-2 h-full p-4",
    text: "text-2xl font-bold uppercase",
    content: "max-h-[82vh] md:max-h-[92vh] overflow-y-scroll"
}
export const PageStyle = {
    header: "bg-gradient-to-r from-blue-900/70 to-blue-600/70",
    title_text: "text-2xl font-bold text-cyan-500",
    title_icon: "h-6 w-6 text-cyan-500"
}

export const CARD = {
    layout: "p-3 bg-gradient-to-r from-blue-900/80 to-blue-500/90 rounded-xl border border-cyan-500 hover:border-cyan-300 transition-colors",
    header: "h-12", // bg-red-500/50 for debugging
    title_layout: "flex gap-2 items-center truncate justify-between",
    profile_initial: "rounded-full h-12 w-12 flex items-center justify-center font-light text-2xl bg-cyan-600 text-cyan-50",
    title_text: "text-md font-medium text-white",
    title_text_xp: "text-lg font-bold text-white",
    profile_layout: "flex gap-2 items-center",
    profile_tag: "text-xs text-cyan-300 font-medium",
    selection_area: "relative w-full h-12 cursor-pointer mt-[-3rem]",
    list_text: "",
    content: "mt-3",
    content_section: "text-cyan-50 space-y-2 text-xs",
    section_title: "text-sm font-medium text-cyan-400",
    page_section_title: "text-sm font-medium text-cyan-400", //old
    icon_list: "flex gap-2 items-center",
    item_list: "flex-1 space-y-2",
    item_index: "pl-3 border-l-2 border-cyan-400 space-y-2",
    items: "flex items-center justify-between mb-2",
    item_text: "text-xs font-bold text-cyan-50",
    item_sub_text: "text-xs font-medium text-gray-400 space-y-1",
    tags: "inline-block py-1 text-xs font-medium rounded text-xs font-medium text-cyan-400",
    tag: "inline-block px-2 py-1 text-xs font-medium rounded text-xs font-medium text-cyan-400 bg-cyan-800",
    action_grid: "flex gap-1 items-center mt-3",
    timestamp: "flex justify-between text-xs text-cyan-400",
    

    list_title_text: "text-lg font-medium text-white", //old
    selected_list_title_text: "text-xl font-bold text-white", //old
    card: "p-3 bg-gradient-to-r from-blue-900/80 to-blue-500/90 rounded-xl border border-cyan-500 hover:border-cyan-300 transition-colors", //old
    title: "w-full",
    list_content: "my-4 p-2 text-cyan-50 space-y-2 text-xs",
    contact_list: "flex gap-2 items-center", //old
    selection: "relative w-full h-12 cursor-pointer mt-[-4rem]", //old
    job_list: "flex-1 mt-3",
    name: "text-base font-medium text-white cursor-pointer",
    selected_name: "text-xl font-bold text-white w-full cursor-pointer",
    contact_grid: "flex gap-1 items-center" //old
}

export const LIST = {
    y_space: "space-y-2"
}
export const CONTACT = {
    profile_initial: "rounded-full h-12 w-12 flex items-center justify-center font-light text-2xl bg-cyan-600 text-cyan-50"
}

export const ContentLayout = {
    content_space: "space-y-2"
}


export const SYSTEM = {
    error: "text-red-700 text-center p-8",
    notice: "text-cyan-400 text-center p-8"
}

export const VIEW = {
    page: "max-w-8xl",
    header: "h-[8vh] lg:h-[8vh] bg-blue-700/40",
    title: "p-4 flex items-center gap-2 h-full text-2xl font-bold text-cyan-400",
    content: "max-h-[81vh] lg:max-h-[92vh] overflow-y-scroll",
    title_text: "text-xl font-bold text-cyan-400",//old
    title_icon: "h-5 w-5 text-cyan-400"//old
}

export const HEADER = {
    title: "flex items-center gap-2 h-full text-xl font-bold text-cyan-400",
    layout: "p-3 flex items-center justify-between h-full"
}

export const CONTENT = {
    layout: "p-3",
    list: "space-y-2",
    y_space: "space-y-2"
}

export const FORM = {
    layout: "space-y-3",
    label: "block text-xs font-medium text-cyan-400 mb-1",
    input: "w-full px-3 py-2 border border-cyan-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-800/70 text-cyan-50",
    inputText: "w-full px-3 py-2 border border-cyan-50 rounded focus:outline-none focus:ring-2 focus:ring-blue-500",
    action: "flex flex-col sm:flex-row gap-2 pt-2",
    index: "p-2 rounded-lg bg-gray-800/30 border border-gray-700",
    sub_layout: "flex items-center gap-2 justify-between"

}

export const BUTTON = {
    layout: "p-2 flex items-center justify-center gap-1 cursor-pointer border rounded-md",
    icon: "p-2 text-cyan-400 hover:text-cyan-200 bg-cyan-800/50 hover:bg-cyan-700/50 rounded-md",
    solid: "p-2 flex items-center justify-center gap-2 cursor-pointer border rounded-md w-full transition-colors bg-gradient-to-t from-cyan-700 to-cyan-500 hover:from-cyan-600 hover:to-cyan-400 border-cyan-500 hover:border-cyan-300 text-cyan-200 hover:text-cyan-50",
    outline: "p-2 flex items-center justify-center gap-2 cursor-pointer border rounded-md w-full transition-colors bg-gradient-to-t from-blue-700/60 to-blue-800/60 hover:from-blue-600/70 hover:to-blue-500/70 border-cyan-500 hover:border-cyan-300 text-cyan-500 hover:text-cyan-300",
}

export const ICON = {
    xs: "w-3 h-3 text-cyan-400",
    sm: "w-4 h-4 text-cyan-400",
    md: "w-5 h-5 text-cyan-400 ",
    lg: "w-6 h-6 text-cyan-400",
    xl: "w-8 h-8 text-cyan-400"
}

export const BACKGROUND = {
    light: "relative w-full h-screen overflow-hidden bg-gradient-to-b from-blue-100 to-blue-200",
    dark: "relative w-full h-screen overflow-hidden bg-gradient-to-b from-blue-900 to-blue-950",
}

export const Theme = {
    background: BACKGROUND,
    system: SYSTEM,
    view: VIEW,
    header: HEADER,
    content: CONTENT,
    card: CARD,
    form: FORM,
    button: BUTTON,
    icon: ICON
}
