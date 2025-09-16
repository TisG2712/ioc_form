// IndexedDB Service for large data storage
class IndexedDBService {
  constructor() {
    this.dbName = 'IOCMonitorCache';
    this.dbVersion = 1;
    this.db = null;
  }

  // Khởi tạo database
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        console.error('IndexedDB error:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('IndexedDB initialized successfully');
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Tạo object stores
        if (!db.objectStoreNames.contains('mapData')) {
          const mapDataStore = db.createObjectStore('mapData', { keyPath: 'id' });
          mapDataStore.createIndex('category', 'category', { unique: false });
          mapDataStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        if (!db.objectStoreNames.contains('populationData')) {
          db.createObjectStore('populationData', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('wardsData')) {
          db.createObjectStore('wardsData', { keyPath: 'id' });
        }


        console.log('IndexedDB stores created');
      };
    });
  }

  // Lưu dữ liệu map
  async saveMapData(category, data) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['mapData'], 'readwrite');
      const store = transaction.objectStore('mapData');
      
      const item = {
        id: category,
        category: category,
        data: data,
        timestamp: Date.now(),
        size: JSON.stringify(data).length
      };

      const request = store.put(item);
      
      request.onsuccess = () => {
        console.log(`Saved map data for ${category}:`, item.size, 'bytes');
        resolve();
      };
      
      request.onerror = () => {
        console.error('Error saving map data:', request.error);
        reject(request.error);
      };
    });
  }

  // Lấy dữ liệu map
  async getMapData(category) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['mapData'], 'readonly');
      const store = transaction.objectStore('mapData');
      const request = store.get(category);
      
      request.onsuccess = () => {
        if (request.result) {
          console.log(`Loaded map data for ${category}:`, request.result.size, 'bytes');
          resolve(request.result.data);
        } else {
          resolve(null);
        }
      };
      
      request.onerror = () => {
        console.error('Error loading map data:', request.error);
        reject(request.error);
      };
    });
  }

  // Lấy tất cả dữ liệu map
  async getAllMapData() {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['mapData'], 'readonly');
      const store = transaction.objectStore('mapData');
      const request = store.getAll();
      
      request.onsuccess = () => {
        const allData = {};
        request.result.forEach(item => {
          allData[item.id] = item.data;
        });
        console.log('Loaded all map data:', Object.keys(allData));
        resolve(allData);
      };
      
      request.onerror = () => {
        console.error('Error loading all map data:', request.error);
        reject(request.error);
      };
    });
  }

  // Lưu dữ liệu population
  async savePopulationData(data) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['populationData'], 'readwrite');
      const store = transaction.objectStore('populationData');
      
      const item = {
        id: 'population',
        data: data,
        timestamp: Date.now(),
        size: JSON.stringify(data).length
      };

      const request = store.put(item);
      
      request.onsuccess = () => {
        console.log('Saved population data:', item.size, 'bytes');
        resolve();
      };
      
      request.onerror = () => {
        console.error('Error saving population data:', request.error);
        reject(request.error);
      };
    });
  }

  // Lấy dữ liệu population
  async getPopulationData() {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['populationData'], 'readonly');
      const store = transaction.objectStore('populationData');
      const request = store.get('population');
      
      request.onsuccess = () => {
        if (request.result) {
          console.log('Loaded population data:', request.result.size, 'bytes');
          resolve(request.result.data);
        } else {
          resolve(null);
        }
      };
      
      request.onerror = () => {
        console.error('Error loading population data:', request.error);
        reject(request.error);
      };
    });
  }

  // Lưu dữ liệu wards
  async saveWardsData(data) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['wardsData'], 'readwrite');
      const store = transaction.objectStore('wardsData');
      
      const item = {
        id: 'wards',
        data: data,
        timestamp: Date.now(),
        size: JSON.stringify(data).length
      };

      const request = store.put(item);
      
      request.onsuccess = () => {
        console.log('Saved wards data:', item.size, 'bytes');
        resolve();
      };
      
      request.onerror = () => {
        console.error('Error saving wards data:', request.error);
        reject(request.error);
      };
    });
  }

  // Lấy dữ liệu wards
  async getWardsData() {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['wardsData'], 'readonly');
      const store = transaction.objectStore('wardsData');
      const request = store.get('wards');
      
      request.onsuccess = () => {
        if (request.result) {
          console.log('Loaded wards data:', request.result.size, 'bytes');
          resolve(request.result.data);
        } else {
          resolve(null);
        }
      };
      
      request.onerror = () => {
        console.error('Error loading wards data:', request.error);
        reject(request.error);
      };
    });
  }



  // Xóa tất cả cache
  async clearAllCache() {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['mapData', 'populationData', 'wardsData'], 'readwrite');
      
      const clearPromises = [
        transaction.objectStore('mapData').clear(),
        transaction.objectStore('populationData').clear(),
        transaction.objectStore('wardsData').clear(),
      ];

      transaction.oncomplete = () => {
        console.log('All cache cleared from IndexedDB');
        resolve();
      };

      transaction.onerror = () => {
        console.error('Error clearing cache:', transaction.error);
        reject(transaction.error);
      };
    });
  }

  // Lấy thông tin cache
  async getCacheInfo() {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['mapData', 'populationData', 'wardsData'], 'readonly');
      
      const info = {
        mapDataCount: 0,
        populationDataSize: 0,
        wardsDataSize: 0,
        totalSize: 0
      };

      let completed = 0;
      const total = 3;

      const checkComplete = () => {
        completed++;
        if (completed === total) {
          resolve(info);
        }
      };

      // Count map data
      const mapDataCount = transaction.objectStore('mapData').count();
      mapDataCount.onsuccess = () => {
        info.mapDataCount = mapDataCount.result;
        checkComplete();
      };

      // Get population data size
      const populationData = transaction.objectStore('populationData').get('population');
      populationData.onsuccess = () => {
        info.populationDataSize = populationData.result?.size || 0;
        checkComplete();
      };

      // Get wards data size
      const wardsData = transaction.objectStore('wardsData').get('wards');
      wardsData.onsuccess = () => {
        info.wardsDataSize = wardsData.result?.size || 0;
        checkComplete();
      };


      transaction.onerror = () => {
        reject(transaction.error);
      };
    });
  }
}

// Export singleton instance
export const indexedDBService = new IndexedDBService();
