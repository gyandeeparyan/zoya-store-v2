"use client"

import * as React from "react"
import { Instagram, MessageCircleMore, ChevronDown } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
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
          <div className="flex justify-center items-center">
            <DrawerHeader>
              <DrawerTitle className="text-left hidden">Contact us</DrawerTitle>
            </DrawerHeader>
            <DrawerClose className="max-h-full max-w-full">
              <Button className="text-black bg-red-400 hover:bg-red-300 rounded-full mr-4 h-10 w-10 p-0">
                <ChevronDown className="h-10 w-10" />
              </Button>
            </DrawerClose>
          </div>
          
          <div className="p-4 pb-4">
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
        </div>
      </DrawerContent>
    </Drawer>
  )
}
