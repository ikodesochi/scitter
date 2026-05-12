// quests/questManager.js
import { getItemCount } from '../inventory/inventory.js';

let activeQuests = [];

export function setQuests(quests) {
    activeQuests = quests;
}

export function getActiveQuests() {
    return activeQuests.filter(q => !q.completed);
}

export function getCompletedQuests() {
    return activeQuests.filter(q => q.completed);
}

export function checkQuests() {
    let anyUpdated = false;
    
    for (let quest of activeQuests) {
        if (quest.completed) continue;
        
        const currentCount = getItemCount(quest.requiredItem);
        if (currentCount >= quest.requiredAmount) {
            quest.completed = true;
            anyUpdated = true;
            console.log(`✅ Квест выполнен: ${quest.name}`);
        }
    }
    
    return anyUpdated;
}

export function updateQuests() {
    checkQuests();
}

export function getQuestProgress(quest) {
    const current = getItemCount(quest.requiredItem);
    return { current, required: quest.requiredAmount };
}

export function resetQuests() {
    for (let quest of activeQuests) {
        quest.completed = false;
    }
}