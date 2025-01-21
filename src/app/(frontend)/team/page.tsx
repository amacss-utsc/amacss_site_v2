import React from 'react';
import { ErrDefault, FetchTeam } from '../_data';
import { Media, SubTeam, TeamMember } from '@/payload-types';
import Image from 'next/image';
import { cn } from '@/utilities/cn';
import { MemberWrapperStyle } from '@/utilities/tailwindShared';

const Member = (m: TeamMember, j: number) => {
  const img: Media | null =
    typeof m.photo !== 'number' &&
      m.photo != null &&
      'url' in m.photo &&
      m.photo.url
      ? m.photo
      : null;


  if (img === null) return null;

  const { url, alt, width, height } = img;

  if (!url || !alt || width == null || height == null) return null;

  return (
    <article key={j} className="flex flex-col items-center mb-8 lg:mb-0">
      <Image src={url} alt={alt} width={width} height={height} className="w-64 h-64 rounded-[32px] mb-2 object-cover" />
      <h3 className="text-2xl font-semibold">{m.name}</h3>
      <h4 className="text-2xl font-extrabold text-[#F3F3F3] opacity-25">{m.role}</h4>
    </article>
  );
}

export default async function Page() {
  const { team, error } = await FetchTeam();

  const subteams: SubTeam[] = ErrDefault(error, team?.['sub-teams'], []);

  const sortedSubteams = [...subteams].sort((a, b) => {
    if (a.name === 'Executive Team') return -1;
    if (b.name === 'Executive Team') return 1;
    return 0;
  });

  return (
    <main className="pt-6 min-h-full h-full overflow-y-scroll bg-gray-90 text-gray-02 px-7 lg:px-20 uppercase lg:rounded-tl-[32px]">
      {sortedSubteams.map((s: SubTeam, i: number) => {
        const mfFn = (member, idx) =>
          (member && member.member && typeof member.member !== "number")

        const mmFn = (member, idx) => member.member

        const members = (s['team-members'] ?? []).filter(mfFn).map(mmFn)
        const prioMembers = (s['prio-team-members'] ?? []).filter(mfFn).map(mmFn)

        return (
          <section key={i} className="pt-9 flex flex-col items-center lg:gap-y-10">
            <h2 className="font-bold text-3xl w-full mt-6 lg:mt-0 mb-8 lg:mb-0">{s.name}</h2>

            <div className={cn(MemberWrapperStyle, "lg:w-[70%]")}>
            {prioMembers.map(Member)}
            </div>
            <div className={cn(MemberWrapperStyle, "lg:w-full")}>
            {members.map(Member)}
            </div>
          </section>
        );
      })}
      <div className="h-20" />
    </main>
  );
}

