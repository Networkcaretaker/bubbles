export const PageLayout = {
    page: "max-w-8xl mx-auto",
    header: "h-[8vh] md:h-[7vh] fixed",
    title: "flex items-center gap-2 h-full p-4",
    text: "text-2xl font-bold uppercase",
    content: "max-h-[82vh] overflow-y-scroll"
}
export const PageStyle = {
    header: "bg-blue-700/40",
    title_text: "text-2xl font-bold text-cyan-500",
    title_icon: "h-6 w-6 text-cyan-500"
}

export const CARD = {
    card: "p-4 bg-gradient-to-r from-blue-900/80 to-blue-500/90 rounded-xl border border-cyan-500 hover:border-cyan-300 transition-colors",
    header: "",
    title: "w-full",
    selection: "relative w-full h-12 cursor-pointer mt-[-3rem]",
    list_content: "my-4 p-2 text-cyan-500 space-y-2 text-sm",
    icon_list: "flex gap-2 items-center",
    tags: "inline-block px-1 text-xs font-medium rounded",
    name: "text-base font-medium text-white cursor-pointer",
    selected_name: "text-xl font-bold text-cyan-400 w-full cursor-pointer",
    contact_grid: "grid grid-cols-3 gap-1 items-center"
}

export const LIST = {
    y_space: "space-y-2"
}
export const CONTACT = {
    profile_initial: "rounded-full h-12 w-12 flex items-center justify-center font-light text-2xl"
}

export const ContentLayout = {
    content_space: "space-y-2"
}
export const CONTENT = {
    y_space: "space-y-2"
}

export const SYSTEM = {
    error: "text-red-700 text-center py-8",
    notice: "text-cyan-400 text-center py-8"
}

export const VIEW = {
    page: "max-w-8xl mx-auto",
    header: "h-[8vh] md:h-[7vh] bg-blue-700/40",
    title: "p-4 flex items-center gap-2 h-full text-2xl font-bold text-cyan-500",
    content: "max-h-[82vh] overflow-y-scroll",
    title_text: "text-2xl font-bold text-cyan-500",
    title_icon: "h-6 w-6 text-cyan-500"
}

export const FORM = {
    layout: "space-y-4 p-4 bg-blue-800/50 border border-cyan-500 rounded-lg",
    label: "block text-sm font-medium text-cyan-500 mb-1",
    input: "w-full px-3 py-2 border border-cyan-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500",
    action: "flex flex-col sm:flex-row gap-2 pt-2"
}

export const BUTTON = {
    layout: "p-2 flex items-center justify-center gap-1 cursor-pointer border rounded-md",
    solid: "p-2 flex items-center justify-center gap-2 cursor-pointer border rounded-md w-full transition-colors bg-gradient-to-t from-cyan-700 to-cyan-500 hover:from-cyan-600 hover:to-cyan-400 border-cyan-500 hover:border-cyan-300 text-cyan-200 hover:text-cyan-50",
    outline: "p-2 flex items-center justify-center gap-2 cursor-pointer border rounded-md w-full transition-colors bg-gradient-to-t from-blue-700/40 to-blue-800/40 hover:from-blue-600/50 hover:to-blue-500/50 border-cyan-500 hover:border-cyan-300 text-cyan-500 hover:text-cyan-300"
}

export const Theme = {
    system: SYSTEM,
    view: VIEW,
    form: FORM,
    button: BUTTON,
}
