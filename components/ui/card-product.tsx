import * as React from "react";
``;
import { cn } from "@/lib/utils";

const ProductCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      `rounded-xl border bg-card text-card-foreground shadow 
      min-w-[150px] max-w-[150px]  lg:w-[240px] lg:max-w-[240px] lg:h-[400px]`,
      className
    )}
    {...props}
  />
));
ProductCard.displayName = "Card";

const ProductCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
ProductCardHeader.displayName = "CardHeader";

const ProductCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
ProductCardTitle.displayName = "CardTitle";

const ProductCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
ProductCardDescription.displayName = "CardDescription";

const ProductCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
ProductCardContent.displayName = "CardContent";

const ProductCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
ProductCardFooter.displayName = "CardFooter";

export {
  ProductCard,
  ProductCardHeader,
  ProductCardFooter,
  ProductCardTitle,
  ProductCardDescription,
  ProductCardContent,
};
