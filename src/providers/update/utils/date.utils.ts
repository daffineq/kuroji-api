export class DateUtils {
  private static readonly LONDON_TIMEZONE = 'Europe/London';

  /**
   * Get current Unix timestamp in seconds (UTC)
   */
  static getCurrentTimestamp(): number {
    return Math.floor(Date.now() / 1000);
  }

  /**
   * Get current date in London timezone
   */
  static getLondonDate(): Date {
    return new Date(
      new Date().toLocaleString('en-US', {
        timeZone: this.LONDON_TIMEZONE,
      }),
    );
  }

  /**
   * Convert any date to London timezone
   */
  static toLondonDate(date: Date): Date {
    return new Date(
      date.toLocaleString('en-US', {
        timeZone: this.LONDON_TIMEZONE,
      }),
    );
  }

  /**
   * Get start and end of day for a given date in London timezone
   * Returns Unix timestamps in seconds (UTC)
   */
  static getLondonDayRange(date: Date): { start: number; end: number } {
    // Get the date components in London timezone
    const londonDateStr = date.toLocaleString('en-CA', {
      timeZone: this.LONDON_TIMEZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    const [year, month, day] = londonDateStr.split('-').map(Number);

    // Create start and end of day timestamps for London timezone
    // Use a direct approach: create the dates and convert properly to UTC
    const startOfDay = new Date(
      `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T00:00:00`,
    );
    const endOfDay = new Date(
      `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T23:59:59.999`,
    );

    // Apply London timezone offset to convert to UTC
    const startOffset = this.getLondonTimezoneOffset(startOfDay);
    const endOffset = this.getLondonTimezoneOffset(endOfDay);

    return {
      start: Math.floor((startOfDay.getTime() - startOffset) / 1000),
      end: Math.floor((endOfDay.getTime() - endOffset) / 1000),
    };
  }

  /**
   * Get London timezone offset in milliseconds for a given date
   */
  private static getLondonTimezoneOffset(date: Date): number {
    const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    const londonDate = new Date(
      utcDate.toLocaleString('en-US', { timeZone: this.LONDON_TIMEZONE }),
    );
    return londonDate.getTime() - utcDate.getTime();
  }

  /**
   * Get today's date range in London timezone
   */
  static getTodayLondonRange(): { start: number; end: number } {
    return this.getLondonDayRange(new Date());
  }

  /**
   * Get date range for N days ago in London timezone
   */
  static getDaysAgoLondonRange(daysAgo: number): {
    start: number;
    end: number;
  } {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - daysAgo);
    return this.getLondonDayRange(targetDate);
  }

  /**
   * Get date range spanning from N days ago to today in London timezone
   */
  static getWeekSpanLondonRange(daysAgo: number): {
    start: number;
    end: number;
  } {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);
    const endDate = new Date();

    const startRange = this.getLondonDayRange(startDate);
    const endRange = this.getLondonDayRange(endDate);

    return {
      start: startRange.start,
      end: endRange.end,
    };
  }

  /**
   * Get hour range spanning from N hours ago to now
   */
  static getHourSpanRange(hoursAgo: number): {
    start: number;
    end: number;
  } {
    const now = this.getCurrentTimestamp();

    const start = now - hoursAgo * 60 * 60;
    const end = now + hoursAgo * 60 * 60;

    return {
      start,
      end,
    };
  }

  /**
   * Get timestamp for N hours ago from current time
   */
  static getHoursAgoTimestamp(hoursAgo: number): number {
    const now = this.getCurrentTimestamp();
    return now - hoursAgo * 60 * 60;
  }

  /**
   * Get timestamp for N days ago from current time
   */
  static getDaysAgoTimestamp(daysAgo: number): number {
    const now = this.getCurrentTimestamp();
    return now - daysAgo * 24 * 60 * 60;
  }

  /**
   * Get future timestamp for N days from current time
   */
  static getFutureTimestamp(daysAhead: number): number {
    const now = this.getCurrentTimestamp();
    return now + daysAhead * 24 * 60 * 60;
  }

  /**
   * @deprecated Use getCurrentTimestamp() instead
   */
  static getLondonTimestamp(): number {
    return this.getCurrentTimestamp();
  }

  /**
   * @deprecated Use getHoursAgoTimestamp() instead
   */
  static getHoursAgoLondonTimestamp(hoursAgo: number): number {
    return this.getHoursAgoTimestamp(hoursAgo);
  }

  /**
   * @deprecated Use getDaysAgoTimestamp() instead
   */
  static getDaysAgoLondonTimestamp(daysAgo: number): number {
    return this.getDaysAgoTimestamp(daysAgo);
  }

  /**
   * @deprecated Use getFutureTimestamp() instead
   */
  static getFutureLondonTimestamp(daysAhead: number): number {
    return this.getFutureTimestamp(daysAhead);
  }

  /**
   * Check if a timestamp is within a date range
   */
  static isWithinRange(timestamp: number, start: number, end: number): boolean {
    return timestamp >= start && timestamp <= end;
  }

  /**
   * Format timestamp for logging (displays in London timezone)
   */
  static formatTimestamp(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleString('en-US', {
      timeZone: this.LONDON_TIMEZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  /**
   * Get time range with proper buffer for airing schedule queries
   * This helps catch anime that might be slightly outside the exact range
   */
  static getBufferedTimeRange(
    startTimestamp: number,
    endTimestamp: number,
    bufferHours: number = 2,
  ): {
    start: number;
    end: number;
  } {
    const buffer = bufferHours * 60 * 60; // Convert hours to seconds
    return {
      start: startTimestamp - buffer,
      end: endTimestamp + buffer,
    };
  }

  /**
   * Check if a timestamp falls within London business hours (9 AM - 6 PM)
   */
  static isLondonBusinessHours(timestamp: number): boolean {
    const date = new Date(timestamp * 1000);
    const londonTime = date.toLocaleString('en-US', {
      timeZone: this.LONDON_TIMEZONE,
      hour12: false,
      hour: '2-digit',
    });

    const hour = parseInt(londonTime);
    return hour >= 9 && hour < 18;
  }

  /**
   * Validate that a timestamp is reasonable (not too far in past/future)
   */
  static isValidTimestamp(timestamp: number): boolean {
    const now = this.getCurrentTimestamp();
    const oneYearAgo = now - 365 * 24 * 60 * 60;
    const oneYearFromNow = now + 365 * 24 * 60 * 60;

    return timestamp >= oneYearAgo && timestamp <= oneYearFromNow;
  }

  /**
   * Get the start of the current year in London timezone
   */
  static getCurrentYearStart(): number {
    const londonDate = this.getLondonDate();
    const startOfYear = new Date(londonDate.getFullYear(), 0, 1, 0, 0, 0, 0);
    const londonOffset = this.getLondonTimezoneOffset(startOfYear);
    return Math.floor((startOfYear.getTime() - londonOffset) / 1000);
  }

  /**
   * Parse a date with validation
   */
  static parseDate(dateInput: string | number | Date): Date | null {
    try {
      const date = new Date(dateInput);
      return isNaN(date.getTime()) ? null : date;
    } catch {
      return null;
    }
  }
}
