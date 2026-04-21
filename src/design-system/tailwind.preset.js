/**
 * Tools Design System · Tailwind Preset
 * 把 tokens.css 中的 CSS 变量暴露为 Tailwind utility class。
 *
 * 颜色变量为 RGB 三元组（如 "10 132 255"），通过
 *   rgb(var(--color-X) / <alpha-value>)
 * 包装以支持 Tailwind 的 /N 透明度修饰符（bg-primary/5 等）。
 *
 * 使用方式：
 *   // tailwind.config.js
 *   module.exports = {
 *     presets: [require('../shared/design-system/tailwind.preset.js')],
 *     content: ['./index.html', './src/**\/*.{js,jsx,ts,tsx}'],
 *   }
 */

const rgb = (token) => `rgb(var(${token}) / <alpha-value>)`

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        // 主色
        primary: {
          DEFAULT: rgb('--color-primary'),
          hover:   rgb('--color-primary-hover'),
          muted:   rgb('--color-primary-muted'),
          fg:      rgb('--color-primary-fg'),
        },
        // 表面
        bg:             rgb('--color-bg'),
        surface:        rgb('--color-surface'),
        'surface-muted':rgb('--color-surface-muted'),
        // 边框
        border:        rgb('--color-border'),
        'border-strong':rgb('--color-border-strong'),
        // 文字
        foreground:        rgb('--color-foreground'),
        'foreground-muted':rgb('--color-foreground-muted'),
        muted:             rgb('--color-muted'),
        // 语义
        success: rgb('--color-success'),
        warning: rgb('--color-warning'),
        danger:  rgb('--color-danger'),
        // 货币
        money:        rgb('--color-money'),
        'money-accent':rgb('--color-money-accent'),
      },
      fontFamily: {
        sans: 'var(--font-sans)',
        mono: 'var(--font-mono)',
      },
      fontSize: {
        xs:   ['var(--text-xs)',   { lineHeight: 'var(--text-xs-lh)' }],
        sm:   ['var(--text-sm)',   { lineHeight: 'var(--text-sm-lh)' }],
        base: ['var(--text-base)', { lineHeight: 'var(--text-base-lh)' }],
        lg:   ['var(--text-lg)',   { lineHeight: 'var(--text-lg-lh)' }],
        xl:   ['var(--text-xl)',   { lineHeight: 'var(--text-xl-lh)' }],
        '2xl':['var(--text-2xl)',  { lineHeight: 'var(--text-2xl-lh)' }],
        '3xl':['var(--text-3xl)',  { lineHeight: 'var(--text-3xl-lh)' }],
        '4xl':['var(--text-4xl)',  { lineHeight: 'var(--text-4xl-lh)' }],
      },
      spacing: {
        1:  'var(--space-1)',
        2:  'var(--space-2)',
        3:  'var(--space-3)',
        4:  'var(--space-4)',
        6:  'var(--space-6)',
        8:  'var(--space-8)',
        12: 'var(--space-12)',
        16: 'var(--space-16)',
      },
      borderRadius: {
        sm:   'var(--radius-sm)',
        md:   'var(--radius-md)',
        lg:   'var(--radius-lg)',
        xl:   'var(--radius-xl)',
        full: 'var(--radius-full)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
      transitionTimingFunction: {
        out:    'var(--ease-out)',
        spring: 'var(--ease-spring)',
      },
      transitionDuration: {
        fast: '150ms',
        base: '250ms',
        slow: '350ms',
      },
      maxWidth: {
        'container-sm': 'var(--container-sm)',
        'container-md': 'var(--container-md)',
        'container-lg': 'var(--container-lg)',
        'container-xl': 'var(--container-xl)',
      },
    },
  },
}
