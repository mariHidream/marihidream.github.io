"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/src/lib/utils";


const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.List>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({className, ...props}, ref) => (
    <TabsPrimitive.List
        ref={ref}
        className={cn(
            "inline-flex h-12 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 p-1 text-slate-400 w-full",
            className
        )}
        {...props}
    />
));

TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({className, ...props}, ref)=>(
    <TabsPrimitive.Trigger 
        ref={ref}
        className={cn(
            "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-8 py-2.5 text-sm font-bold ring-offset-slate-950 transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-teal-500 data-[state=active]:text-slate-950 data-[state=active]:shadow-md flex-1",
            className
        )}
        {...props}
    />
));

TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({className, ...props}, ref)=>(
    <TabsPrimitive.Content 
        ref={ref}
        className={cn(
            "mt-6 ring-offset-slate-950 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-2 duration-500",
            className
        )}
        {...props}
    />
));

TabsContent.displayName = TabsPrimitive.Content.displayName;


export {Tabs, TabsList, TabsTrigger, TabsContent}