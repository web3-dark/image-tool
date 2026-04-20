/**
 * ImagePro Logo 组件
 * 设计理念：简洁、现代、充满活力
 */

export function LogoIcon({ size = 40, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 外层圆形背景 */}
      <circle cx="50" cy="50" r="48" fill="#3b82f6" />

      {/* 内层浅色背景 */}
      <circle cx="50" cy="50" r="42" fill="#dbeafe" />

      {/* 图片框架 - 中心矩形 */}
      <rect x="24" y="28" width="52" height="44" rx="6" fill="none" stroke="#3b82f6" strokeWidth="4" />

      {/* 图片山峰 */}
      <path
        d="M 24 58 L 38 42 L 52 52 L 76 28"
        fill="none"
        stroke="#3b82f6"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 图片高光点 */}
      <circle cx="32" cy="36" r="5" fill="#3b82f6" />

      {/* 压缩指示符 - 右下角小箭头 */}
      <g transform="translate(70, 62)">
        <circle cx="0" cy="0" r="8" fill="#3b82f6" />
        <path
          d="M -3 3 L 0 0 L 3 3 M 0 0 L 0 5"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

export function LogoText({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl',
  };

  return (
    <div className={`font-black ${sizeClasses[size]} ${className}`}>
      <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">ImagePro</span>
    </div>
  );
}

export function Logo({ size = 'md', showText = true, className = '' }) {
  const iconSize = size === 'sm' ? 36 : size === 'lg' ? 64 : 48;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <LogoIcon size={iconSize} />
      {showText && <LogoText size={size} />}
    </div>
  );
}
