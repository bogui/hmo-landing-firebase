import { computed, signal } from '@angular/core';

/**
 * Utility to detect dark mode preference and provide theme-aware image paths
 * Supports both Tailwind's class-based dark mode and system preference
 */
export class ImageUtils {
  /**
   * Signal that tracks dark mode state
   * Checks both document class and system preference
   */
  private static readonly isDarkModeSignal = signal<boolean>(
    typeof document !== 'undefined'
      ? document.documentElement.classList.contains('dark') ||
          (document.documentElement.classList.contains('dark') === false &&
            window.matchMedia('(prefers-color-scheme: dark)').matches)
      : false
  );

  /**
   * Initialize dark mode detection
   * Must be called from browser context
   */
  static init(): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    // Check initial state
    this.updateDarkModeState();

    // Listen for system preference changes
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeQuery.addEventListener('change', () => {
      this.updateDarkModeState();
    });

    // Watch for class changes on document element (for Tailwind class-based dark mode)
    const observer = new MutationObserver(() => {
      this.updateDarkModeState();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
  }

  /**
   * Update dark mode state signal
   */
  private static updateDarkModeState(): void {
    if (typeof document === 'undefined') {
      return;
    }

    const hasDarkClass = document.documentElement.classList.contains('dark');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Tailwind class takes precedence, otherwise use system preference
    this.isDarkModeSignal.set(
      hasDarkClass || (!document.documentElement.classList.contains('light') && prefersDark)
    );
  }

  /**
   * Get the current dark mode state
   */
  static isDarkMode(): boolean {
    return this.isDarkModeSignal();
  }

  /**
   * Get theme-aware image path
   * @param baseName - Base name of the image (e.g., 'dashboard' or 'inventory')
   * @param extension - Image extension (default: 'png')
   * @returns Path to the appropriate image based on current theme
   */
  static getThemeImage(baseName: string, extension: string = 'png'): string {
    const theme = this.isDarkMode() ? 'dark' : 'light';
    return `/images/${baseName}_${theme}.${extension}`;
  }

  /**
   * Get a signal for theme-aware image path that updates when theme changes
   * @param baseName - Base name of the image (e.g., 'dashboard' or 'inventory')
   * @param extension - Image extension (default: 'png')
   * @returns Signal that contains the current theme-aware image path
   */
  static getThemeImageSignal(baseName: string, extension: string = 'png') {
    return computed(() => {
      const theme = this.isDarkModeSignal() ? 'dark' : 'light';
      return `/images/${baseName}_${theme}.${extension}`;
    });
  }
}

// Initialize on module load if in browser context
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  ImageUtils.init();
}
