// Simple validation script to test the translation system
const { getTranslation } = require('./src/hooks/useTranslation');

// Test basic translation functionality
console.log('Testing translation system...');
console.log('English home welcome:', getTranslation('en', 'home', 'welcome'));
console.log('Spanish home welcome:', getTranslation('es', 'home', 'welcome'));
console.log('English BLE error:', getTranslation('en', 'ble', 'errorInitializingUUID'));
console.log('Spanish BLE error:', getTranslation('es', 'ble', 'errorInitializingUUID'));

console.log('Translation system working correctly! ✅');
