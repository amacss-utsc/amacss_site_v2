"use client"

import React, { useRef } from "react"
import Hamburger from "../svg/Hamburger"
import { usePathname } from "next/navigation"
import { PathnameToTitle } from "@/utilities/strings"
import { useStateContext } from "@/providers/State"
import ChevronRight from "../svg/ChevronRight"
import Link from "next/link"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

type MobileMenuProps = {
  closeMenu: () => void
}

export const Links: { n: string; u: string }[] = [
  { n: "HOME", u: "/" },
  { n: "EVENTS", u: "/events" },
  { n: "OUR TEAM", u: "/team" },
]

const MobileMenu: React.FC<MobileMenuProps> = ({ closeMenu }) => {
  const menuRef = useRef<HTMLMenuElement>(null)

  useGSAP(() => {
    gsap.fromTo(
      menuRef.current,
      { x: "100%" },
      { x: "0%", ease: "power3.out", duration: 0.3 }
    )
  })

  return (
    <menu
      ref={menuRef}
      className="w-4/5 h-screen fixed top-0 right-0 bg-gray-80 px-8 pt-6 uppercase text-gray-02"
    >
      <button
        onClick={closeMenu}
        className="font-bold text-gray-10 text-2xl flex items-center justify-center tracking-[5%] hover:text-white group active:text-white"
      >
        <ChevronRight className="inline mr-4 group-hover:stroke-white" /> CLOSE
      </button>
      <ul className="w-full flex flex-col items-end text-3xl font-[800] mt-14 gap-y-5">
        {Links.map((i, j) => (
          <li key={j}>
            <Link
              href={i.u}
              onClick={() => closeMenu()}
              className="active:text-gray-20 hover:text-gray-20 transition-all"
            >
              {i.n}
            </Link>
          </li>
        ))}
      </ul>
    </menu>
  )
}

const Nav: React.FC = () => {
  const { menuOpen, setMenuOpen } = useStateContext()
  const navRef = useRef<HTMLDivElement>(null)
  const menu = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (menuOpen) {
        gsap.fromTo(
          menu.current,
          { x: "100%" },
          { x: "0%", ease: "power3.out", duration: 0.3 }
        )
      } else {
        gsap.to(menu.current, { x: "100%", ease: "power3.out", duration: 0.3 })
      }
    },
    { dependencies: [menuOpen], scope: navRef }
  )

  const { contextSafe } = useGSAP({ scope: navRef })

  const onHide = contextSafe(() => {
    gsap.to(menu.current, { x: "100%", ease: "power3.out", duration: 0.3 })
    setTimeout(() => setMenuOpen(false), 300)
  })

  const pathname = usePathname()

  if (pathname === "/login" || pathname === "/register") return null

  return (
    <div
      ref={navRef}
      className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 pt-6 lg:hidden"
    >
      {menuOpen && (
        <div
          ref={menu}
          className="fixed top-0 left-0 w-full h-screen bg-gray-90 flex flex-col items-center justify-center"
        >
          <MobileMenu closeMenu={onHide} />
        </div>
      )}
      <h1 className="text-gray-02 text-4xl uppercase font-extrabold">
        {PathnameToTitle(pathname)}
      </h1>
      <Hamburger
        onClick={() => setMenuOpen(true)}
        width={36}
        height={32}
        className="cursor-pointer"
      />
    </div>
  )
}

export default Nav

