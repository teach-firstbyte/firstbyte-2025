"use client";

import { useState, useEffect } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { ArrowUpRight, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ElementType, ComponentPropsWithoutRef } from "react";

interface AnimatedGlowButtonProps<T extends ElementType> {
  as?: T;
  color?: string;
  glowColor?: string;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
  href?: string;
  isDisabled?: boolean;
}

export function AnimatedGlowButton<T extends ElementType = "button">({
  as,
  className,
  color = "green",
  glowColor,
  title,
  description,
  icon,
  children,
  href,
  isDisabled = false,
  ...props
}: AnimatedGlowButtonProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof AnimatedGlowButtonProps<T>>) {
  const [isHovered, setIsHovered] = useState(false);
  const glowControls = useAnimationControls();
  
  // Determine color values based on the color prop
  const getColorValues = () => {
    switch (color) {
      case 'green':
        return {
          from: 'rgba(22, 163, 74, 0.4)',
          via: 'rgba(34, 197, 94, 0.4)',
          to: 'rgba(22, 163, 74, 0.4)',
          solidFrom: 'rgb(22, 163, 74)',
          solidVia: 'rgb(34, 197, 94)',
          solidTo: 'rgb(22, 163, 74)',
          radialColor: 'rgba(22, 163, 74, 0.2)',
          maskFill: 'rgba(22, 163, 74, 0.25)',
          particleColor: 'bg-green-600/90',
          particleColor2: 'bg-green-500/90',
          textShadow: 'rgba(22,163,74,0.3)',
          bg: 'bg-green-600',
          bgGlow: 'bg-green-500',
        };
      case 'blue':
        return {
          from: 'rgba(37, 99, 235, 0.4)',
          via: 'rgba(96, 165, 250, 0.4)',
          to: 'rgba(37, 99, 235, 0.4)',
          solidFrom: 'rgb(37, 99, 235)',
          solidVia: 'rgb(96, 165, 250)',
          solidTo: 'rgb(37, 99, 235)',
          radialColor: 'rgba(37, 99, 235, 0.2)',
          maskFill: 'rgba(37, 99, 235, 0.25)',
          particleColor: 'bg-blue-600/90',
          particleColor2: 'bg-blue-500/90',
          textShadow: 'rgba(37,99,235,0.3)',
          bg: 'bg-blue-600',
          bgGlow: 'bg-blue-500',
        };
      case 'purple':
        return {
          from: 'rgba(147, 51, 234, 0.4)',
          via: 'rgba(168, 85, 247, 0.4)',
          to: 'rgba(147, 51, 234, 0.4)',
          solidFrom: 'rgb(147, 51, 234)',
          solidVia: 'rgb(168, 85, 247)',
          solidTo: 'rgb(147, 51, 234)',
          radialColor: 'rgba(147, 51, 234, 0.2)',
          maskFill: 'rgba(147, 51, 234, 0.25)',
          particleColor: 'bg-purple-600/90',
          particleColor2: 'bg-purple-500/90',
          textShadow: 'rgba(147,51,234,0.3)',
          bg: 'bg-purple-600',
          bgGlow: 'bg-purple-500',
        };
      default:
        return {
          from: 'rgba(22, 163, 74, 0.4)',
          via: 'rgba(34, 197, 94, 0.4)',
          to: 'rgba(22, 163, 74, 0.4)',
          solidFrom: 'rgb(22, 163, 74)',
          solidVia: 'rgb(34, 197, 94)',
          solidTo: 'rgb(22, 163, 74)',
          radialColor: 'rgba(22, 163, 74, 0.2)',
          maskFill: 'rgba(22, 163, 74, 0.25)',
          particleColor: 'bg-green-600/90',
          particleColor2: 'bg-green-500/90',
          textShadow: 'rgba(22,163,74,0.3)',
          bg: 'bg-green-600',
          bgGlow: 'bg-green-500',
        };
    }
  };

  const colorValues = getColorValues();
  
  // Custom glow color override
  const customGlowColor = glowColor ? {
    from: `${glowColor}40`,
    via: `${glowColor}40`,
    to: `${glowColor}40`,
    solidFrom: glowColor,
    solidVia: glowColor,
    solidTo: glowColor,
    radialColor: `${glowColor}20`,
    maskFill: `${glowColor}25`,
    particleColor: 'bg-foreground/90',
    particleColor2: 'bg-foreground/80',
    textShadow: `${glowColor}30`,
    bg: 'bg-foreground',
    bgGlow: 'bg-foreground/80',
  } : null;

  const colors = customGlowColor || colorValues;

  useEffect(() => {
    glowControls.start({
      opacity: isHovered ? [0.25, 0.45, 0.25] : [0.07, 0.2, 0.07],
      scale: isHovered ? [1.01, 1.04, 1.01] : [1, 1.02, 1],
      transition: {
        duration: isHovered ? 2 : 4,
        repeat: Number.POSITIVE_INFINITY,
        ease: 'easeInOut',
      },
    });
  }, [isHovered, glowControls]);

  // If we have title and description, use the card layout
  const hasCardLayout = Boolean(title || description);

  // Common event handlers
  const handleHoverStart = () => !isDisabled && setIsHovered(true);
  const handleHoverEnd = () => !isDisabled && setIsHovered(false);
  
  // Determine which element type to use
  const Component = as || (href ? 'a' : 'button');
  
  // Common props for all component types
  const componentProps = {
    className: cn("relative", className),
    onMouseEnter: handleHoverStart,
    onMouseLeave: handleHoverEnd,
    ...(href && { href, target: "_blank", rel: "noopener noreferrer" }),
    ...(Component === 'button' && { disabled: isDisabled }),
    ...props
  } as any;

  // Render component with either card or simple button layout
  const renderCardLayout = () => {
    return (
      <div
        className={cn('group relative w-full', {
          'cursor-not-allowed opacity-60': isDisabled,
        })}
      >
        <motion.div
          className="group relative w-full"
          onHoverStart={handleHoverStart}
          onHoverEnd={handleHoverEnd}
          whileTap={!isDisabled ? { scale: 0.98 } : undefined}
        >
          <motion.div
            className={`absolute inset-0 rounded-xl bg-gradient-to-r from-${color}-600/40 via-${color}-400/40 to-${color}-600/40 blur-xl`}
            style={{
              backgroundImage: `linear-gradient(to right, ${colors.from}, ${colors.via}, ${colors.to})`,
            }}
            animate={glowControls}
          />

          {isHovered && !isDisabled && (
            <>
              <motion.div
                className={`absolute left-1/4 top-0 h-1 w-1 rounded-full ${colors.particleColor}`}
                animate={{
                  y: [0, -15],
                  opacity: [0, 0.7, 0],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
              <motion.div
                className={`absolute left-2/4 top-0 h-1.5 w-1.5 rounded-full ${colors.particleColor2}`}
                animate={{
                  y: [0, -20],
                  opacity: [0, 0.7, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: 0.3,
                }}
              />
            </>
          )}

          <div
            className={cn("relative flex w-full items-center overflow-hidden rounded-xl border border-border bg-card/90 p-4 backdrop-blur-sm", className)}
          >
            <motion.div
              className="absolute inset-0 opacity-50"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${colors.radialColor}, transparent 60%)`,
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.15, 0.25, 0.15],
              }}
              transition={{
                duration: 5,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
              }}
            />

            <svg
              className="absolute inset-0 h-full w-full opacity-20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={`${colors.solidFrom}00`} />
                  <stop offset="50%" stopColor={colors.solidVia} />
                  <stop offset="100%" stopColor={`${colors.solidTo}00`} />
                </linearGradient>
                <mask id={`mask-${color}`}>
                  <motion.rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    fill={`url(#gradient-${color})`}
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: 'easeInOut',
                    }}
                  />
                </mask>
              </defs>
              <rect
                x="0"
                y="0"
                width="100%"
                height="100%"
                fill={colors.maskFill}
                mask={`url(#mask-${color})`}
              />
            </svg>

            <div className={`relative z-10 mr-4 flex h-12 w-12 items-center justify-center rounded-lg ${colors.bg}`}>
              <motion.div
                className={`absolute inset-0 rounded-lg ${colors.bgGlow} opacity-70 blur-md`}
                animate={{
                  opacity: isHovered && !isDisabled ? [0.4, 0.7, 0.4] : [0.3, 0.5, 0.3],
                  scale: isHovered && !isDisabled ? [1, 1.1, 1] : [1, 1.05, 1],
                }}
                transition={{
                  duration: isHovered ? 2 : 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'easeInOut',
                }}
              />
              <motion.div
                animate={{
                  rotate: isHovered && !isDisabled ? [0, 3, 0, -3, 0] : 0,
                }}
                transition={{
                  duration: 2.5,
                  repeat: isHovered && !isDisabled ? Number.POSITIVE_INFINITY : 0,
                  ease: 'easeInOut',
                }}
              >
                {icon || <Shield className="relative z-10 h-6 w-6 text-white" />}
              </motion.div>
            </div>

            <div className="z-10 flex-1 text-left">
              <motion.h3
                className="text-sm font-medium text-foreground"
                animate={{
                  textShadow: isHovered && !isDisabled
                    ? [
                        '0 0 0px rgba(255,255,255,0)',
                        `0 0 5px ${colors.textShadow}`,
                        '0 0 0px rgba(255,255,255,0)',
                      ]
                    : 'none',
                }}
                transition={{
                  duration: 2.5,
                  repeat: isHovered && !isDisabled ? Number.POSITIVE_INFINITY : 0,
                }}
              >
                {title || children}
              </motion.h3>
              {description && (
                <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                  {description}
                </p>
              )}
            </div>

            <motion.div
              animate={{
                x: isHovered && !isDisabled ? [0, 3, 0] : 0,
                opacity: isHovered && !isDisabled ? [0.7, 0.9, 0.7] : 0.7,
              }}
              transition={{
                x: {
                  duration: 2,
                  repeat: isHovered && !isDisabled ? Number.POSITIVE_INFINITY : 0,
                  ease: 'easeInOut',
                },
                opacity: {
                  duration: 2,
                  repeat: isHovered && !isDisabled ? Number.POSITIVE_INFINITY : 0,
                  ease: 'easeInOut',
                },
              }}
              className="z-10"
            >
              <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  };

  const renderSimpleButton = () => {
    return (
      <div
        className={cn('group relative', {
          'cursor-not-allowed opacity-60': isDisabled,
        })}
      >
        <motion.div
          className="group relative"
          onHoverStart={handleHoverStart}
          onHoverEnd={handleHoverEnd}
          whileTap={!isDisabled ? { scale: 0.98 } : undefined}
        >
          <motion.div
            className="absolute inset-0 rounded-xl"
            style={{
              backgroundImage: `linear-gradient(to right, ${colors.from}, ${colors.via}, ${colors.to})`,
              opacity: 0.4,
              filter: 'blur(8px)',
            }}
            animate={glowControls}
          />

          {isHovered && !isDisabled && (
            <>
              <motion.div
                className={`absolute left-1/4 top-0 h-1 w-1 rounded-full ${colors.particleColor}`}
                animate={{
                  y: [0, -15],
                  opacity: [0, 0.7, 0],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
              <motion.div
                className={`absolute left-2/4 top-0 h-1.5 w-1.5 rounded-full ${colors.particleColor2}`}
                animate={{
                  y: [0, -20],
                  opacity: [0, 0.7, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: 0.3,
                }}
              />
            </>
          )}

          <div
            className={cn(
              "relative flex items-center justify-center overflow-hidden rounded-[20px] border border-border/40 bg-card/90 py-2.5 px-5 text-sm backdrop-blur-sm transition-all",
              className
            )}
          >
            {renderButtonContent()}
          </div>
        </motion.div>
      </div>
    );
  };

  const renderButtonContent = () => {
    return (
      <>
        <motion.div
          className="absolute inset-0 opacity-50"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${colors.radialColor}, transparent 60%)`,
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          }}
        />

        <svg
          className="absolute inset-0 h-full w-full opacity-20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={`${colors.solidFrom}00`} />
              <stop offset="50%" stopColor={colors.solidVia} />
              <stop offset="100%" stopColor={`${colors.solidTo}00`} />
            </linearGradient>
            <mask id={`mask-${color}`}>
              <motion.rect
                x="0"
                y="0"
                width="100%"
                height="100%"
                fill={`url(#gradient-${color})`}
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'easeInOut',
                }}
              />
            </mask>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill={colors.maskFill}
            mask={`url(#mask-${color})`}
          />
        </svg>

        <motion.span
          className="relative z-10 flex items-center justify-center gap-1.5"
          animate={{
            textShadow: isHovered && !isDisabled
              ? [
                  '0 0 0px rgba(255,255,255,0)',
                  `0 0 5px ${colors.textShadow}`,
                  '0 0 0px rgba(255,255,255,0)',
                ]
              : 'none',
          }}
          transition={{
            duration: 2.5,
            repeat: isHovered && !isDisabled ? Number.POSITIVE_INFINITY : 0,
          }}
        >
          {children}
        </motion.span>
      </>
    );
  };

  return (
    <Component {...componentProps}>
      {hasCardLayout ? renderCardLayout() : renderSimpleButton()}
    </Component>
  );
} 