import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '~/lib/utils';

const TickerVariants = cva(
  'mb-1 text-sm font-medium leading-none tracking-tight',
  {
    variants: {
      variant: {
        default: 'text-foreground',
        positive: 'text-positive',
        negative: 'text-negative',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const Ticker = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // 'relative [&>svg~*]:pl-7 [&>svg]:translate-y-1/2 [&>svg]:absolute [&>svg]:left-0 [&>svg]:top-0 [&>svg]:text-muted-foreground',
      className,
    )}
    {...props}
  />
));
Ticker.displayName = 'Ticker';

const TickerTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement> & VariantProps<typeof TickerVariants>
>(({ className, variant, ...props }, ref) => (
  <h4
    ref={ref}
    className={cn(TickerVariants({ variant }), className)}
    {...props}
  >
    {props.children}
  </h4>
));
TickerTitle.displayName = 'TickerTitle';

const TickerDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'text-xs [&_p]:leading-relaxed text-muted-foreground',
      className,
    )}
    {...props}
  />
));
TickerDescription.displayName = 'TickerDescription';

export { Ticker, TickerDescription, TickerTitle };
