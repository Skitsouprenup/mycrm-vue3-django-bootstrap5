import {Ref} from 'vue'

export const updatePaginationUrl = (
    pageAction: 'next' | 'prev' | 'init',
    currentPage: Ref<number>,
    pageSection: string
) => {
    let url = ''

    switch(pageAction) {
        case 'next':
            url = `/api/v1/${pageSection}?page=${currentPage.value}`
            break;
        case 'prev':
            url = `/api/v1/${pageSection}?page=${currentPage.value}`
            break;
        case 'init':
            url = `/api/v1/${pageSection}?page=${currentPage.value}`
            break;
    }

    return url
}

export const updatePagination = (
    next: boolean, 
    previous: boolean,
    currentPage: Ref<number>,
    paginationBtns: {showNext: boolean, showPrev: boolean}) => {

    if(next) {
        currentPage.value += 1
        paginationBtns.showNext = true
    } else paginationBtns.showNext = false

    if(previous) {
        currentPage.value -= 1
        paginationBtns.showPrev = true
    } else paginationBtns.showPrev = false
}
