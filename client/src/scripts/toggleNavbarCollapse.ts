import { Collapse } from 'bootstrap'

const toggleNavbarCollapse = () => {
    /*
        add 'toggle: false' as options
        so that hide() doesn't collapse the
        navbar if it's hidden. I'm not sure if this is a bug. 
    */
    const bsCollapse = 
    new Collapse(document.getElementById('navmenu') as HTMLElement, { toggle: false })
    bsCollapse.hide()
}

export default toggleNavbarCollapse