"use client"

import * as React from "react"
import { Instagram, MessageCircleMore } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,

  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

export function ContactUsDrawer() {
 

  

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button className="">Contact</button>
      </DrawerTrigger>
      <DrawerContent className="">
        <div className="mx-auto w-full text-white z-50 max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="text-center">Contact us</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex flex-row items-center justify-center gap-4">
              <Link 
                href="https://www.instagram.com/zoyaofficial898" 
                target="_blank"
                className="flex items-center gap-2 hover:text-violet-400 transition-colors"
              >
                <Instagram className="h-6 w-6" />
                <span>Instagram</span>
              </Link>
              <Link 
                href="https://api.whatsapp.com/send/?phone=918584032812&text&type=phone_number&app_absent=0" 
                target="_blank"
                className="flex items-center gap-2 hover:text-violet-400 transition-colors"
              >
                <MessageCircleMore className="h-6 w-6" />
                <span>WhatsApp</span>
              </Link>
            </div>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button className="bg-violet-100 text-black">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
