import React from "react"
import Link from "next/link"
import { Facebook, Instagram, Linkedin, Mail, Youtube } from "lucide-react"
import Discord from "@/components/svg/Discord"

export const Footer: React.FC = () => {
  const menuLinks = [
    { label: "Home", href: "/" },
    { label: "Events", href: "/events" },
    { label: "Our Team", href: "/team" },
    { label: "Resources", href: "/resources" },
  ]

  const moreLinks = [
    { label: "Register", href: "/register" },
    { label: "Member Login", href: "/login" },
  ]

  return (
    <footer className="w-full py-4 lg:py-6">
      <div className="rounded-[24px] border border-gray-60 bg-gray-90 px-6 py-8 lg:px-10">
        <div className="grid grid-cols-1 gap-8 text-sm text-gray-05 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <h3 className="text-base font-bold text-gray-02">AMACSS</h3>
            <p className="max-w-[260px]">
              Association of Mathematical and Computer Science Students at UTSC.
            </p>
            <p>1057 Military Trail #1049, Scarborough, ON M1C 1G9</p>
            <a
              className="inline-block text-gray-03 transition-colors hover:text-gray-02"
              href="mailto:amacss.uoft@gmail.com"
            >
              amacss.uoft@gmail.com
            </a>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-bold text-gray-02">Menu</h3>
            <ul className="space-y-1">
              {menuLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-gray-02"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-bold text-gray-02">More</h3>
            <ul className="space-y-1">
              {moreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-gray-02"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-bold text-gray-02">Social Links</h3>
            <div className="flex flex-wrap items-center gap-3 text-gray-02">
              <a
                className="rounded-full border border-gray-60 p-2 transition-colors hover:bg-gray-80"
                href="https://discord.gg/G788CefnRc"
                aria-label="Discord"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Discord className="h-4 w-4" />
              </a>
              <a
                className="rounded-full border border-gray-60 p-2 transition-colors hover:bg-gray-80"
                href="mailto:amacss.uoft@gmail.com"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
              <a
                className="rounded-full border border-gray-60 p-2 transition-colors hover:bg-gray-80"
                href="https://www.instagram.com/amacss_utsc/"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                className="rounded-full border border-gray-60 p-2 transition-colors hover:bg-gray-80"
                href="https://ca.linkedin.com/company/association-of-mathematical-and-computer-science-students"
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                className="rounded-full border border-gray-60 p-2 transition-colors hover:bg-gray-80"
                href="https://www.youtube.com/channel/UCUAWhdc8JqyH97S1mFzLCAg?sub_confirmation=1"
                aria-label="YouTube"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Youtube className="h-4 w-4" />
              </a>
              <a
                className="rounded-full border border-gray-60 p-2 transition-colors hover:bg-gray-80"
                href="https://www.facebook.com/AMACSSUTSC"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-60 pt-4 text-xs text-gray-05">
          <p>{new Date().getFullYear()} © AMACSS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
