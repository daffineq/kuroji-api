export class DateUtils {
  private static readonly TIMEZONE = 'Europe/London';

  /**
   * Get current Unix timestamp in seconds (UTC)
   */
  static getCurrentTimestamp(): number {
    return Math.floor(Date.now() / 1000);
  }

  /**
   * Get current date in configured timezone
   */
  static getCurrentDate(): Date {
    return new Date(
      new Date().toLocaleString('en-US', {
        timeZone: this.TIMEZONE,
      }),
    );
  }

  /**
   * Convert any date to configured timezone
   */
  static toTimezoneDate(date: Date): Date {
    return new Date(
      date.toLocaleString('en-US', {
        timeZone: this.TIMEZONE,
      }),
    );
  }

  /**
   * Get start and end of day for a given date in configured timezone
   * Returns Unix timestamps in seconds (UTC)
   */
  static getDayRange(date: Date): { start: number; end: number } {
    // Get the date components in configured timezone
    const timezoneDateStr = date.toLocaleString('en-CA', {
      timeZone: this.TIMEZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    const [year, month, day] = timezoneDateStr.split('-').map(Number);

    // Create start and end of day timestamps for configured timezone
    // Use a direct approach: create the dates and convert properly to UTC
    const startOfDay = new Date(
      `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T00:00:00`,
    );
    const endOfDay = new Date(
      `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T23:59:59.999`,
    );

    // Apply timezone offset to convert to UTC
    const startOffset = this.getTimezoneOffset(startOfDay);
    const endOffset = this.getTimezoneOffset(endOfDay);

    return {
      start: Math.floor((startOfDay.getTime() - startOffset) / 1000),
      end: Math.floor((endOfDay.getTime() - endOffset) / 1000),
    };
  }

  /**
   * Get timezone offset in milliseconds for a given date
   */
  private static getTimezoneOffset(date: Date): number {
    const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    const timezoneDate = new Date(
      utcDate.toLocaleString('en-US', { timeZone: this.TIMEZONE }),
    );
    return timezoneDate.getTime() - utcDate.getTime();
  }

  /**
   * Get today's date range in configured timezone
   */
  static getTodayRange(): { start: number; end: number } {
    return this.getDayRange(new Date());
  }

  /**
   * Get date range for N days ago in configured timezone
   */
  static getDaysAgoRange(daysAgo: number): {
    start: number;
    end: number;
  } {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - daysAgo);
    return this.getDayRange(targetDate);
  }

  /**
   * Get date range spanning from N days in future to today in configured timezone
   */
  static getSpanRange(range: {
    days?: number | null;
    daysAgo?: number | null;
  }): {
    start: number;
    end: number;
  } {
    const days = range.days || 0;
    const daysAgo = range.daysAgo || 0;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);

    const startRange = this.getDayRange(startDate);
    const endRange = this.getDayRange(endDate);

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
   * Get future timestamp for N hours from current time
   */
  static getFutureHoursTimestamp(hoursAhead: number): number {
    const now = this.getCurrentTimestamp();
    return now + hoursAhead * 60 * 60;
  }

  /**
   * Get future timestamp for N minutes from current time
   */
  static getFutureMinutesTimestamp(minutesAhead: number): number {
    const now = this.getCurrentTimestamp();
    return now + minutesAhead * 60;
  }

  /**
   * Check if a Unix timestamp is in the future
   */
  static isFuture(timestamp: number): boolean {
    return timestamp > this.getCurrentTimestamp();
  }

  /**
   * Check if a Unix timestamp is in the past
   */
  static isPast(timestamp: number): boolean {
    return timestamp < this.getCurrentTimestamp();
  }

  /**
   * Check if a Unix timestamp is currently happening (within current minute)
   */
  static isNow(timestamp: number): boolean {
    const now = this.getCurrentTimestamp();
    const minuteStart = Math.floor(now / 60) * 60;
    const minuteEnd = minuteStart + 59;
    return timestamp >= minuteStart && timestamp <= minuteEnd;
  }

  /**
   * Get time difference in seconds between timestamp and now (positive if future, negative if past)
   */
  static getTimeDifferenceFromNow(timestamp: number): number {
    return timestamp - this.getCurrentTimestamp();
  }

  /**
   * Check if timestamp is within the next N seconds
   */
  static isWithinNextSeconds(timestamp: number, seconds: number): boolean {
    const now = this.getCurrentTimestamp();
    return timestamp >= now && timestamp <= now + seconds;
  }

  /**
   * Check if timestamp is within the next N minutes
   */
  static isWithinNextMinutes(timestamp: number, minutes: number): boolean {
    return this.isWithinNextSeconds(timestamp, minutes * 60);
  }

  /**
   * Check if timestamp is within the next N hours
   */
  static isWithinNextHours(timestamp: number, hours: number): boolean {
    return this.isWithinNextSeconds(timestamp, hours * 60 * 60);
  }

  /**
   * Check if timestamp is within the next N days
   */
  static isWithinNextDays(timestamp: number, days: number): boolean {
    return this.isWithinNextSeconds(timestamp, days * 24 * 60 * 60);
  }

  /**
   * Check if a timestamp is within a date range
   */
  static isWithinRange(timestamp: number, start: number, end: number): boolean {
    return timestamp >= start && timestamp <= end;
  }

  /**
   * Format timestamp for logging (displays in configured timezone)
   */
  static formatTimestamp(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleString('en-US', {
      timeZone: this.TIMEZONE,
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
   * Check if a timestamp falls within configured timezone business hours (9 AM - 6 PM)
   */
  static isBusinessHours(timestamp: number): boolean {
    const date = new Date(timestamp * 1000);
    const timezoneTime = date.toLocaleString('en-US', {
      timeZone: this.TIMEZONE,
      hour12: false,
      hour: '2-digit',
    });

    const hour = parseInt(timezoneTime);
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
   * Get the start of the current year in configured timezone
   */
  static getCurrentYearStart(): number {
    const timezoneDate = this.getCurrentDate();
    const startOfYear = new Date(timezoneDate.getFullYear(), 0, 1, 0, 0, 0, 0);
    const timezoneOffset = this.getTimezoneOffset(startOfYear);
    return Math.floor((startOfYear.getTime() - timezoneOffset) / 1000);
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
