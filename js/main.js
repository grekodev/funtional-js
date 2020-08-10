const compose = (...functions) => data =>
    functions.reduceRight((value, func) => func(value), data)
/* {
    tag: h1,
    attr: {
        class: 'title'
    }
} */

const attrsToString = (obj = {}) => {
    const keys = Object.keys(obj)
    const attrs = []
    for (let i = 0; i < keys.length; i++) {
        let attr = keys[i]
        attrs.push(`${attr}="${obj[attr]}"`)
    }
    const string = attrs.join('')
    return string
}

/* const attrsToString = (obj = {}) => {
    Object.keys(obj)
    .map(attr => `${attr}="${obj[attr]}"`)
    .join('')
} */

const tagAttrs = obj => (content = "") =>
    `<${obj.tag}${obj.attrs ? ' ' : ''}${attrsToString(obj.attrs)}>${content}</${obj.tag}>`

/* const tag = t => {
    if (typeof t === 'string') {
        return tagAttrs({ tag: t })
    } else {
        return tagAttrs(t)
    }
} */

const tag = t => typeof t === 'string' ? tagAttrs({ tag: t }): tagAttrs(t)

const tableCell = tag('td')
const tableCells = items => items.map(tableCell).join('')

const tableRowTag = tag('tr')
const tableRow = items => compose(tableRowTag, tableCells)(items)

const trashIcon = tag({tag: 'i', attrs: {class:'fas fa-trash-alt'}})('X')

const IS_INVALID = 'is-invalid'
const description = document.getElementById('description')
const carbs = document.getElementById('carbs')
const calories = document.getElementById('calories')
const protein = document.getElementById('protein')

const totalCalories = document.getElementById('total-calories')
const totalCarbs = document.getElementById('total-carbs')
const totalProtein = document.getElementById('total-protein')
const listItems = document.getElementById('list-items')

let list = []

const inputs = [description, carbs, calories, protein]

const addKeyDownListener = (elem) => {
    elem.addEventListener('keydown', () => elem.classList.remove(IS_INVALID))
}
const validInputs = (elem) => {
    elem.value ? '' : elem.classList.add(IS_INVALID)
}

const isValid = elem => elem.value
const isFormValid = () =>
    isValid(description) && isValid(carbs) && isValid(calories) && isValid(protein)


inputs.forEach(addKeyDownListener)

const validateInputs = () => {
    inputs.forEach(validInputs)
    if (isFormValid()) {
        add()
    }
}

const add = () => {
    const newItem = {
        description: description.value,
        calories: parseInt(calories.value),
        carbs: parseInt(carbs.value),
        protein: parseInt(protein.value),
    }
    list.push(newItem)
    renderItems();
    inputs.forEach(cleanInputs)
    updateTotals()
}

const updateTotals = () => {
    let calories = 0, carbs = 0, protein = 0;
    list.map(item => {
        calories += item.calories,
            carbs += item.carbs,
            protein += item.protein
    })
    totalCalories.textContent = calories
    totalCarbs.textContent = carbs
    totalProtein.textContent = protein
}
const cleanInputs = (elem) => {
    elem.value = ''
}

const renderItems = () =>{
    listItems.innerHTML = ''
    list.map((item, index) => {
        const removeButton = tag({
            tag: 'button',
            attrs:{
                class: 'btn btn-outline-danger', 
                onclick: `removeItem(${index})`
            }
        })(trashIcon)
        listItems.innerHTML += tableRow([item.description, item.calories, item.carbs, item.protein, removeButton])
    })
}

const removeItem = index => {
    list.splice(index,1)
    updateTotals()
    renderItems()
}