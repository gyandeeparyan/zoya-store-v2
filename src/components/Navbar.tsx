"use client"

import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

import { Cart } from "./Cart"
import { ContactUsDrawer } from "./ContactUsDrawer"
import { MyOrdersDrawer } from "./MyOrdersDrawer"

export function NavigationMenuDemo() {
  return (
    <NavigationMenu className="py-4  flex items-center justify-center md:px-16 w-full">
      <div className="flex w-full items-center justify-center">
        <NavigationMenuList className="flex items-center space-x-4">
          <NavigationMenuItem>
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Home
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
             <MyOrdersDrawer/>
              </NavigationMenuLink>
            
          </NavigationMenuItem>
          <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
           <ContactUsDrawer/>
           </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            
              <NavigationMenuLink className="relative text-white">
              <Cart/>
              </NavigationMenuLink>
           
          </NavigationMenuItem>
        </NavigationMenuList>
      </div>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
