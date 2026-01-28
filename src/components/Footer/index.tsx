"use client"

import React from "react"
import { Facebook, Globe, Instagram, Linkedin, Mail, Youtube } from "lucide-react"
import Discord from "@/components/svg/Discord"

export const Footer: React.FC = () => {
  return (
    <footer className="w-full my-4 bg-gray-90 border border-gray-60 rounded-[32px] px-7 py-10 lg:px-12">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-4 text-gray-02">
          <a
            className="rounded-full border border-gray-60 p-2 hover:bg-gray-80 transition-colors"
            href="https://discord.gg/G788CefnRc"
            aria-label="Discord"
          >
            <Discord className="h-5 w-5" />
          </a>
          <a
            className="rounded-full border border-gray-60 p-2 hover:bg-gray-80 transition-colors"
            href="mailto:amacss.uoft@gmail.com"
            aria-label="Email"
          >
            <Mail className="h-5 w-5" />
          </a>
          <a
            className="rounded-full border border-gray-60 p-2 hover:bg-gray-80 transition-colors"
            href="https://www.instagram.com/amacss_utsc/"
            aria-label="Instagram"
          >
            <Instagram className="h-5 w-5" />
          </a>
          <a
            className="rounded-full border border-gray-60 p-2 hover:bg-gray-80 transition-colors"
            href="https://ca.linkedin.com/company/association-of-mathematical-and-computer-science-students"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-5 w-5" />
          </a>
          <a
            className="rounded-full border border-gray-60 p-2 hover:bg-gray-80 transition-colors"
            href="https://www.youtube.com/channel/UCUAWhdc8JqyH97S1mFzLCAg?sub_confirmation=1"
            aria-label="YouTube"
          >
            <Youtube className="h-5 w-5" />
          </a>
          <a
            className="rounded-full border border-gray-60 p-2 hover:bg-gray-80 transition-colors"
            href="https://www.facebook.com/AMACSSUTSC"
            aria-label="Facebook"
          >
            <Facebook className="h-5 w-5" />
          </a>
        </div>
        <div className="flex flex-col gap-1 text-sm text-gray-05 lg:text-right">
          <p className="text-gray-02">AMACSS</p>
          <p>1057 Military Trail #1049, Scarborough, ON M1C 1G9</p>
        </div>
      </div>
    </footer>
  )
}
