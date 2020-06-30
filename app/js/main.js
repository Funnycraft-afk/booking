// Табы

const onTabClick = function(idContainer, idElement) {
    let dataAttr = `data-${idContainer}`;
    
    for (let item of document.querySelectorAll(`[${dataAttr}-name]`)) {
        item.classList.remove('active');
    }

    for (let item of document.querySelectorAll(`[${dataAttr}-tab]`)) {
        item.classList.remove('active');
    }

    document.querySelector(`[${dataAttr}-name=${idElement}]`).classList.add('active')
    document.querySelector(`[${dataAttr}-tab=${idElement}]`).classList.add('active')
}

let tabsName = document.querySelectorAll('.tab-name')
tabsName.forEach((tab) => {
    tab.addEventListener('click', (event) =>{
        onTabClick(event.target.parentElement.id, event.target.dataset.menuTabsName)
    })
})