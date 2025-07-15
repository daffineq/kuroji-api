export class DateUtils {
  private static readonly LONDON_TIMEZONE = 'Europe/London';

  /**
   * Get current timestamp in London timezone (Unix timestamp in seconds)
   */
  static getLondonTimestamp(): number {
    return Math.floor(this.getLondonDate().getTime() / 1000);
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
   * Returns Unix timestamps in seconds
   */
  static getLondonDayRange(date: Date): { start: number; end: number } {
    const londonDate = this.toLondonDate(date);

    const startOfDay = new Date(
      londonDate.getFullYear(),
      londonDate.getMonth(),
      londonDate.getDate(),
      0,
      0,
      0,
      0,
    );

    const endOfDay = new Date(
      londonDate.getFullYear(),
      londonDate.getMonth(),
      londonDate.getDate(),
      23,
      59,
      59,
      999,
    );

    return {
      start: Math.floor(startOfDay.getTime() / 1000),
      end: Math.floor(endOfDay.getTime() / 1000),
    };
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
   * Get timestamp for N hours ago from current London time
   */
  static getHoursAgoLondonTimestamp(hoursAgo: number): number {
    const now = this.getLondonTimestamp();
    return now - hoursAgo * 60 * 60;
  }

  /**
   * Get timestamp for N days ago from current London time
   */
  static getDaysAgoLondonTimestamp(daysAgo: number): number {
    const now = this.getLondonTimestamp();
    return now - daysAgo * 24 * 60 * 60;
  }

  /**
   * Get future timestamp for N days from current London time
   */
  static getFutureLondonTimestamp(daysAhead: number): number {
    const now = this.getLondonTimestamp();
    return now + daysAhead * 24 * 60 * 60;
  }

  /**
   * Check if a timestamp is within a date range
   */
  static isWithinRange(timestamp: number, start: number, end: number): boolean {
    return timestamp >= start && timestamp <= end;
  }

  /**
   * Format timestamp for logging
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
   * Validate that a timestamp is reasonable (not too far in past/future)
   */
  static isValidTimestamp(timestamp: number): boolean {
    const now = this.getLondonTimestamp();
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
    return Math.floor(startOfYear.getTime() / 1000);
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
