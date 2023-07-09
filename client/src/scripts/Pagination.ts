import {Ref} from 'vue'

export const updatePaginationUrl = (
    pageAction: 'next' | 'prev' | 'init',
    currentPage: number,
    pageSection: string
) => {
    let url = ''

    switch(pageAction) {
        case 'next':
            url = `/api/v1/${pageSection}?page=${currentPage}`
            break;
        case 'prev':
            url = `/api/v1/${pageSection}?page=${currentPage}`
            break;
        case 'init':
            url = `/api/v1/${pageSection}?page=${currentPage}`
            break;
    }

    return url
}

export const updatePagination = (
    next: boolean, 
    previous: boolean,
    currentPage: Ref<number>,
    paginationBtns: {showNext: boolean, showPrev: boolean},
    pageAction: 'next' | 'prev' | 'init' ) => {

    if(pageAction === 'next' || pageAction === 'init')
        currentPage.value += 1
    if(pageAction === 'prev')
        currentPage.value -= 1

    if(next) paginationBtns.showNext = true
    else paginationBtns.showNext = false
    
    if(previous) paginationBtns.showPrev = true
    else paginationBtns.showPrev = false
}
