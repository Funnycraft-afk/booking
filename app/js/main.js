// Табы

const onTabClick = function(idContainer, idElement) {
    
    for (let item of document.querySelectorAll(`[data-${idContainer}-name]`)) {
        item.classList.remove('active');
    }

    for (let item of document.querySelectorAll(`[data-${idContainer}-content]`)) {
        item.classList.remove('active');
    }

    document.querySelector(`[data-${idContainer}-name=${idElement}]`).classList.add('active')
    document.querySelector(`[data-${idContainer}-content=${idElement}]`).classList.add('active')
}

let tabsName = document.querySelectorAll('.tab-name')
tabsName.forEach((tab) => {
    tab.addEventListener('click', (event) =>{
        onTabClick(event.target.parentElement.id, event.target.dataset.featuresMenuName)
    })
})

// Слайдер отзывов
let mySwiper = new Swiper('.swiper-container', {
    speed: 400,
    loop: true,
    navigation: {
        nextEl: '.slide-info-right-btn',
        prevEl: '.slide-info-left-btn',
      },
});