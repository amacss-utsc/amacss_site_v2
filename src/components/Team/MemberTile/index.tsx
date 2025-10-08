"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Linkedin, Globe } from "lucide-react"
import { TeamMember, Media } from "@/payload-types"
import { ImageWithLoader } from "@/components/Team/ImageWithLoader"
import AvatarImageWithLoader from "@/components/Team/AvatarImageWithLoader"

type Props = { member: TeamMember; idx?: number }

export default function MemberTile({ member }: Props) {
  const img: Media | null =
    typeof member.photo !== "number" &&
    member.photo != null &&
    "url" in member.photo &&
    member.photo.url
      ? (member.photo as Media)
      : null

  if (!img || !img.url || !img.alt || img.width == null || img.height == null) {
    return null
  }

  const { url, alt, width, height } = img

  const role: string | undefined = member.role ?? undefined
  const linkedin: string | undefined = member.linkedin ?? undefined
  const github: string | undefined = member.github ?? undefined
  const webpage: string | undefined = member.webpage ?? undefined
  const description: string | undefined = member.description ?? undefined
  const pronouns: string | undefined = member.pronouns ?? undefined

  const IconLink = ({
    href,
    label,
    children,
  }: {
    href?: string
    label: string
    children: React.ReactNode
  }) =>
    href ? (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label={label}
        title={label}
        className="inline-flex h-6 w-6 items-center justify-center rounded-md text-white hover:text-white"
      >
        {children}
      </a>
    ) : null

  return (
    <Dialog>
      <DialogTrigger asChild>
        <article
          className="flex cursor-pointer flex-col items-center mb-8 lg:mb-0 lg:mx-4 focus:outline-none"
          aria-label={`${member.name}${role ? ` – ${role}` : ""}`}
        >
          <ImageWithLoader
            src={url}
            alt={alt}
            width={width}
            height={height}
            className="w-64 h-64 rounded-[32px] mb-2 object-cover"
          />
          <h3 className="text-2xl font-semibold">{member.name}</h3>
          <h4 className="text-lg font-extrabold text-[#F3F3F3] opacity-25">
            {role}
          </h4>
        </article>
      </DialogTrigger>

      <DialogContent
        className="
          sm:max-w-[420px] w-[92vw]
          bg-transparent p-0 border-0 outline-none
        "
      >
        <DialogTitle></DialogTitle>
        <div className="rounded-[22px] border border-white/25 bg-[#1F1F1F] overflow-hidden shadow-2xl">
          <Card className="bg-transparent border-0 rounded-none">
            <CardContent className="px-6 pb-6 pt-5">
              {/* links */}
              {(linkedin || github || webpage) && (
                <div className="flex items-center justify-center gap-3 mb-2">
                  <IconLink href={linkedin} label="LinkedIn">
                    <Linkedin className="h-5 w-5" />
                  </IconLink>
                  <IconLink href={github} label="GitHub">
                    <svg
                      role="img"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 fill-white"
                    >
                      <title>GitHub</title>
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                    </svg>
                  </IconLink>
                  <IconLink href={webpage} label="Website">
                    <Globe className="h-5 w-5" />
                  </IconLink>
                </div>
              )}

              {/* Profile pic */}
              <div className="flex w-full justify-center">
                <div className="relative mb-3">
                  <div className="rounded-full p-1">
                    <AvatarImageWithLoader
                      src={url}
                      alt={alt}
                      size={112}
                      className="rounded-full"
                      imgClassName="rounded-full" 
                    />
                  </div>
                </div>
              </div>

              {/* Name + role + pronouns */}
              <div className="text-center space-y-2">
                <div className="flex w-full justify-center">
                  <span className="inline-flex items-center rounded-full bg-[#4978BF] px-3 py-1 text-base font-semibold tracking-wide uppercase text-black shadow-sm">
                    {member.name}
                  </span>
                </div>

                {role && (
                  <div className="flex w-full justify-center">
                    <span className="inline-flex items-center rounded-full bg-[#4978BF] px-3 py-1 text-sm font-bold uppercase text-black shadow-sm">
                      {role}
                    </span>
                  </div>
                )}

                {pronouns && (
                  <p className="text-sm text-white/60">{pronouns}</p>
                )}
              </div>

              {/* Description */}
              {description && (
                <div className="mt-4 text-[13px] leading-6 text-white/85">
                  {description}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
