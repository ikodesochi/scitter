// inventory/inventory.js

// Хранилище предметов
export let inventory = {
    cheese: 0,
    bone: 0,
    chest: 0,
    escape: 0
};

// Добавить предметы
export function addItem(item, count = 1) {
    if (inventory.hasOwnProperty(item)) {
        inventory[item] += count;
        console.log(`+${count} ${item} (теперь: ${inventory[item]})`);
    } else {
        console.warn(`Неизвестный предмет: ${item}`);
    }
}

// Убрать предметы
export function removeItem(item, count = 1) {
    if (inventory.hasOwnProperty(item)) {
        inventory[item] = Math.max(0, inventory[item] - count);
        console.log(`-${count} ${item} (осталось: ${inventory[item]})`);
    }
}

// Получить количество предмета
export function getItemCount(item) {
    return inventory[item] || 0;
}

// Сбросить инвентарь (новая игра)
export function resetInventory() {
    inventory = {
        cheese: 0,
        bone: 0,
        chest: 0,
        escape: 0
    };
}

// Получить копию инвентаря (для отображения)
export function getInventory() {
    return { ...inventory };
}