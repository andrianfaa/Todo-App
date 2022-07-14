const LocalStorage = {
  /**
   * Function to get data from local storage
   * @param key - Key to get value from local storage
   * @returns - Value of key
   */
  get: <T>(key: string): T | null => {
    const value = localStorage.getItem(key);

    if (value) return JSON.parse(value);

    return null;
  },

  /**
   * Function to set a value in local storage
   * @param key - key to store the value
   * @param value - value to store
   */
  set: <T>(key: string, value: T): void => localStorage.setItem(key, JSON.stringify(value)),

  /**
   * Function to remove a value from local storage
   * @param key - key to remove
   * @returns true if removed, false if not
   */
  remove: (key: string): boolean => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      return true;
    }

    return false;
  },

  /**
   * Clears all local storage
   * @returns {void}
   */
  clear: (): void => localStorage.clear(),
};

const SessionStorage = {
  /**
   * Function to get data from session storage
   * @param key - Key to get value from session storage
   * @returns - Value of key
   */
  get: <T>(key: string): T | null => {
    const value = sessionStorage.getItem(key);

    if (value) return JSON.parse(value);

    return null;
  },

  /**
   * Function to set a value in session storage
   * @param key - key to store the value
   * @param value - value to store
   */
  set: <T>(key: string, value: T): void => sessionStorage.setItem(key, JSON.stringify(value)),

  /**
   * Function to remove a value from session storage
   * @param key - key to remove
   * @returns true if removed, false if not
   */
  remove: (key: string): boolean => {
    if (sessionStorage.getItem(key)) {
      sessionStorage.removeItem(key);
      return true;
    }

    return false;
  },

  /**
   * Clears all session storage
   * @returns {void}
   */
  clear: (): void => sessionStorage.clear(),
};

export { LocalStorage, SessionStorage };
