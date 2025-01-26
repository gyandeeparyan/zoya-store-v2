"use client"

import * as React from "react"



import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { OrderHistoryTable } from "./OrderHistoryTable"



export function MyOrdersDrawer() {
 

  

  return (
    <Drawer >
      <DrawerTrigger className="" asChild>
        <button className="">Orders</button>
      </DrawerTrigger>
      <DrawerContent className="h-full    ">
        <div className="mx-auto w-full text-white z-50 max-w-xl">
          <DrawerHeader>
            <DrawerTitle >Here is your order history</DrawerTitle>
            <DrawerDescription>Enter your details to search.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0 ">
            
            <OrderHistoryTable/>
          </div>
          <DrawerFooter>
            
            <DrawerClose asChild>
              <Button className="bg-violet-100 text-black" >Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
