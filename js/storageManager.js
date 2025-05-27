export class StorageManager {
    constructor(key, defaultData) {
        this.key = key;
        this.defaultData = defaultData;
        this.data = this.loadData();
        
    };
    loadData() {
        const data = JSON.parse(localStorage.getItem(this.key)) || this.defaultData;
        return data;
    };
    saveData() {
        localStorage.setItem(this.key, JSON.stringify(this.data));
    };
    deleteData(){
        localStorage.removeItem(this.key);
    };
    getProperty(propertyKey) {
        if (!(propertyKey in this.data))
            throw new Error(`REQUESTED PROPERTY NULL FROM STORAGE, ${this.key}, ${propertyKey}`);
        return this.data[propertyKey]; // ✅ Return the actual stored value
    };
    setProperty(propertyKey, value) {
        if (!propertyKey)
            throw new Error(`THE PROPERTY YOU ARE TRYING TO MODIFY DOESNT EXIST IN STORAGE, ${this.key}, ${propertyKey}`);
        this.data[propertyKey] = value;
        this.saveData();
    };
};