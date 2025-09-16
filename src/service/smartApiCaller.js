// Service để gọi API một cách thông minh, tránh too many requests

class SmartApiCaller {
  constructor() {
    this.requestQueue = [];
    this.isProcessing = false;
    this.requestDelay = 10000; // 10 giây delay giữa các request (tăng từ 5 giây)
    this.maxConcurrentRequests = 3; // Tối đa 3 request đồng thời
    this.activeRequests = 0;
    this.rateLimitCooldown = 15 * 60 * 1000; // 15 phút cooldown khi bị rate limit (tăng từ 10 phút)
  }

  // Thêm request vào queue
  async addRequest(requestFunction, priority = 'normal') {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({
        requestFunction,
        priority,
        resolve,
        reject,
        timestamp: Date.now()
      });

      // Sắp xếp queue theo priority
      this.requestQueue.sort((a, b) => {
        const priorityOrder = { high: 0, normal: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });

      // Bắt đầu xử lý queue nếu chưa đang xử lý
      if (!this.isProcessing) {
        this.processQueue();
      }
    });
  }

  // Xử lý queue
  async processQueue() {
    if (this.isProcessing || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.requestQueue.length > 0 && this.activeRequests < this.maxConcurrentRequests) {
      const request = this.requestQueue.shift();
      
      // Kiểm tra rate limit cooldown
      const lastRateLimitTime = localStorage.getItem('api_rate_limit_time');
      const now = Date.now();
      
      if (lastRateLimitTime && (now - parseInt(lastRateLimitTime)) < this.rateLimitCooldown) {
        console.log('Rate limit cooldown active, delaying request');
        // Đưa request lại vào đầu queue
        this.requestQueue.unshift(request);
        // Đợi một chút rồi thử lại
        setTimeout(() => this.processQueue(), 30000);
        return;
      }

      this.executeRequest(request);
    }

    this.isProcessing = false;
  }

  // Thực thi request
  async executeRequest(request) {
    this.activeRequests++;
    
    try {
      console.log(`Executing API request (${request.priority} priority)`);
      
      // Thêm delay giữa các request
      if (this.activeRequests > 1) {
        await this.delay(this.requestDelay);
      }

      const result = await request.requestFunction();
      request.resolve(result);
      
    } catch (error) {
      console.error('API request failed:', error);
      
      // Nếu bị rate limit, lưu timestamp và delay
      if (error.message.includes('429') || error.message.includes('Too Many Requests')) {
        localStorage.setItem('api_rate_limit_time', Date.now().toString());
        console.log('Rate limit detected, setting cooldown');
        
        // Đưa request lại vào queue với priority thấp hơn
        request.priority = 'low';
        this.requestQueue.unshift(request);
      } else {
        request.reject(error);
      }
    } finally {
      this.activeRequests--;
      
      // Tiếp tục xử lý queue
      setTimeout(() => this.processQueue(), this.requestDelay);
    }
  }

  // Delay function
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Tăng delay khi bị rate limit
  increaseDelay() {
    this.requestDelay = Math.min(this.requestDelay * 1.5, 10000); // Tối đa 10 giây
    console.log(`Increased request delay to ${this.requestDelay}ms`);
  }

  // Giảm delay khi không bị rate limit
  decreaseDelay() {
    this.requestDelay = Math.max(this.requestDelay * 0.9, 1000); // Tối thiểu 1 giây
    console.log(`Decreased request delay to ${this.requestDelay}ms`);
  }

  // Lấy thông tin queue
  getQueueInfo() {
    return {
      queueLength: this.requestQueue.length,
      activeRequests: this.activeRequests,
      isProcessing: this.isProcessing,
      requestDelay: this.requestDelay
    };
  }

  // Xóa tất cả request trong queue
  clearQueue() {
    this.requestQueue.forEach(request => {
      request.reject(new Error('Queue cleared'));
    });
    this.requestQueue = [];
    console.log('API request queue cleared');
  }
}

// Tạo singleton instance
const smartApiCaller = new SmartApiCaller();

export default smartApiCaller;

// Helper function để gọi API với delay
export const callApiWithDelay = async (apiFunction, delay = 5000) => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const result = await apiFunction();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }, delay);
  });
};

// Helper function để gọi nhiều API với delay giữa các request
export const callMultipleApisWithDelay = async (apiFunctions, delayBetweenRequests = 5000) => {
  const results = [];
  
  for (let i = 0; i < apiFunctions.length; i++) {
    try {
      console.log(`Calling API ${i + 1}/${apiFunctions.length}`);
      const result = await apiFunctions[i]();
      results.push(result);
      
      // Delay giữa các request (trừ request cuối)
      if (i < apiFunctions.length - 1) {
        console.log(`Waiting ${delayBetweenRequests}ms before next request...`);
        await new Promise(resolve => setTimeout(resolve, delayBetweenRequests));
      }
    } catch (error) {
      console.error(`API ${i + 1} failed:`, error);
      results.push(null);
    }
  }
  
  return results;
};

// Helper function để gọi API với retry
export const callApiWithRetry = async (apiFunction, maxRetries = 3, delayBetweenRetries = 10000) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`API call attempt ${attempt}/${maxRetries}`);
      const result = await apiFunction();
      return result;
    } catch (error) {
      lastError = error;
      console.error(`API call attempt ${attempt} failed:`, error);
      
      // Nếu bị rate limit, tăng delay
      if (error.message.includes('429') || error.message.includes('Too Many Requests')) {
        const delay = delayBetweenRetries * attempt;
        console.log(`Rate limit detected, waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else if (attempt < maxRetries) {
        console.log(`Waiting ${delayBetweenRetries}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delayBetweenRetries));
      }
    }
  }
  
  throw lastError;
};
