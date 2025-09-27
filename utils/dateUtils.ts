/**
 * Formats a date object or string into a readable format
 * @param date - Date object or string to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }
    
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  /**
   * Formats a time object or string into a readable format
   * @param time - Date object, string, or undefined to format
   * @returns Formatted time string or null if no time provided
   */
  export const formatTime = (time: Date | string | undefined): string | null => {
    if (!time) return null;
    
    const timeObj = typeof time === 'string' ? new Date(time) : time;
    
    if (isNaN(timeObj.getTime())) {
      return 'Invalid time';
    }
    
    return timeObj.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };
  
  /**
   * Checks if a date is valid
   * @param date - Date to validate
   * @returns Boolean indicating if date is valid
   */
  export const isValidDate = (date: Date | string | undefined): boolean => {
    if (!date) return false;
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return !isNaN(dateObj.getTime());
  };