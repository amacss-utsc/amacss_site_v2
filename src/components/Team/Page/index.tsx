"use client"

import React, { useState, useEffect } from "react"
import { SubTeam, TeamMember } from "@/payload-types"
import { cn } from "@/utilities/cn"
import { MemberWrapperStyle } from "@/utilities/tailwindShared"
import MemberTile from "@/components/Team/MemberTile"
import { ChevronDown } from "lucide-react"

type TeamPageClientProps = {
  subteams: SubTeam[]
}

export function TeamPageClient({ subteams }: TeamPageClientProps) {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([])
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const isPresident = (role: string) => role.toLowerCase().includes('president')
  const isVicePresident = (role: string) => role.toLowerCase().includes('vice-president')
  const isDirector = (role: string) => role.toLowerCase().includes('director')
  const isAssociate = (role: string) => role.toLowerCase().includes('associate')

  const getRoleCategory = (role: string): string[] => {
    const categories: string[] = []
    if (isPresident(role)) categories.push('VP')
    if (isVicePresident(role)) categories.push('VP')
    if (isDirector(role)) categories.push('Directors')
    if (isAssociate(role)) categories.push('Associates')
    return categories
  }

  const departmentNames = [...new Set(subteams.map(team => team.name))].sort()

  const toggleRole = (role: string) => {
    setSelectedRoles(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role)
        : [...prev, role]
    )
  }

  const toggleDepartment = (department: string) => {
    setSelectedDepartments(prev => 
      prev.includes(department) 
        ? prev.filter(d => d !== department)
        : [...prev, department]
    )
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownOpen && !(event.target as Element).closest('.dropdown-container')) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [dropdownOpen])

  const filterMember = (member: TeamMember, teamName: string): boolean => {
    const memberRoleCategories = getRoleCategory(member.role)
    
    const roleMatch = selectedRoles.length === 0 || 
      selectedRoles.some(selectedRole => memberRoleCategories.includes(selectedRole))
    
    const departmentMatch = selectedDepartments.length === 0 || 
      selectedDepartments.includes(teamName)
    
    return roleMatch && departmentMatch
  }

  const sortedSubteams = [...subteams].sort((a, b) => {
    if (a.name === "Executive Team") return -1
    if (b.name === "Executive Team") return 1
    return 0
  })

  const filteredSubteams = sortedSubteams.filter(subteam => {
    const mfFn = (member, idx) => member && member.member && typeof member.member !== "number"
    const mmFn = (member, idx) => member.member

    const members = (subteam["team-members"] ?? []).filter(mfFn).map(mmFn)
    const prioMembers = (subteam["prio-team-members"] ?? []).filter(mfFn).map(mmFn)

    const allMembers = [...members, ...prioMembers]
    return allMembers.some(member => filterMember(member, subteam.name))
  })

  return (
    <main className="pt-6 min-h-full h-full overflow-y-scroll bg-gray-90 text-gray-02 px-7 uppercase lg:rounded-tl-[32px]">
      <div className="max-w-7xl mx-auto">
        {/* header section */}
        <h1 className="hidden lg:block text-4xl font-bold mb-8">Meet the Team</h1>

      {/* filter section */}
      <div className="border-2 border-gray-40 bg-gray-80/50 rounded-[16px] lg:rounded-[32px] p-4 lg:p-6 mb-6 lg:mb-8 mt-16 lg:mt-0">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* left */}
          <div className="flex flex-wrap gap-2 lg:gap-3 justify-center lg:justify-start">
            {['VP', 'Directors', 'Associates'].map((role) => (
              <button
                key={role}
                onClick={() => toggleRole(role)}
                className={`px-4 py-2 lg:px-6 lg:py-2 text-sm lg:text-base rounded-full border transition-all duration-200 normal-case flex-1 sm:flex-none ${
                  selectedRoles.includes(role)
                    ? 'bg-blue-30 text-white border-blue-30'
                    : 'bg-transparent text-gray-20 border-gray-60 hover:border-gray-40'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          {/* middle */}
          <div className="hidden md:flex flex-1 justify-center px-2 lg:px-4">
            {(selectedRoles.length > 0 || selectedDepartments.length > 0) && (
              <div className="bg-gray-70/80 border border-gray-50 rounded-[20px] px-3 py-2.5 lg:px-4 lg:py-2 shadow-sm max-w-full">
                <div className="flex flex-wrap gap-2 lg:gap-2 items-center justify-center">
                  <span className="hidden lg:inline text-xs text-gray-20 font-medium normal-case mr-2">Active Filters:</span>
                  {selectedRoles.map((role) => (
                    <div
                      key={`chip-${role}`}
                      className="flex items-center gap-1.5 bg-blue-30 hover:bg-blue-40 text-white px-2.5 py-1.5 lg:px-3 lg:py-1.5 rounded-full text-xs lg:text-sm normal-case shadow-sm transition-all duration-200 border border-blue-20"
                    >
                      <span className="font-medium">{role}</span>
                      <button
                        onClick={() => toggleRole(role)}
                        className="hover:bg-white/20 rounded-full p-0.5 transition-colors group"
                        aria-label={`Remove ${role} filter`}
                      >
                        <svg className="w-2.5 h-2.5 lg:w-3 lg:h-3 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  {selectedDepartments.map((department) => (
                    <div
                      key={`chip-${department}`}
                      className="flex items-center gap-1.5 bg-gray-60 hover:bg-gray-50 text-white px-2.5 py-1.5 lg:px-3 lg:py-1.5 rounded-full text-xs lg:text-sm normal-case shadow-sm transition-all duration-200 border border-gray-40"
                    >
                      <span className="font-medium truncate max-w-[120px]">{department}</span>
                      <button
                        onClick={() => toggleDepartment(department)}
                        className="hover:bg-white/20 rounded-full p-0.5 transition-colors group flex-shrink-0"
                        aria-label={`Remove ${department} filter`}
                      >
                        <svg className="w-2.5 h-2.5 lg:w-3 lg:h-3 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* right */}
          <div className="relative dropdown-container">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center justify-between w-full lg:w-64 px-4 py-2 bg-transparent border border-gray-60 rounded-full text-gray-20 hover:border-gray-40 transition-all duration-200 normal-case text-sm lg:text-base"
            >
              <span>
                {selectedDepartments.length === 0 
                  ? 'All Departments' 
                  : selectedDepartments.length === 1 
                    ? selectedDepartments[0]
                    : `${selectedDepartments.length} Selected`
                }
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-gray-80 border border-gray-60 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                <button
                  onClick={() => setSelectedDepartments([])}
                  className="w-full px-4 py-2 text-left hover:bg-gray-70 transition-colors text-gray-20 normal-case"
                >
                  All Departments
                </button>
                {departmentNames.map((department) => (
                  <button
                    key={department}
                    onClick={() => toggleDepartment(department)}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-70 transition-colors normal-case ${
                      selectedDepartments.includes(department)
                        ? 'bg-blue-30 text-white'
                        : 'text-gray-20'
                    }`}
                  >
                    {department}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {filteredSubteams.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-30 text-lg normal-case">
            No team members match the selected filters.
          </p>
          <button
            onClick={() => {
              setSelectedRoles([])
              setSelectedDepartments([])
            }}
            className="mt-4 px-6 py-2 bg-blue-30 text-white rounded-full hover:bg-blue-40 transition-colors normal-case"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        filteredSubteams.map((s: SubTeam, i: number) => {
          const mfFn = (member, idx) =>
            member && member.member && typeof member.member !== "number"

          const mmFn = (member, idx) => member.member

          const allMembers = (s["team-members"] ?? []).filter(mfFn).map(mmFn)
          const allPrioMembers = (s["prio-team-members"] ?? [])
            .filter(mfFn)
            .map(mmFn)

          const filteredMembers = allMembers.filter(member => filterMember(member, s.name))
          const filteredPrioMembers = allPrioMembers.filter(member => filterMember(member, s.name))

          return (
            <section
              key={i}
              className="pt-9 flex flex-col items-center lg:gap-y-10"
            >
              <h2 className="font-bold text-3xl w-full mt-6 lg:mt-0 mb-8 lg:mb-0">
                {s.name}
              </h2>

              {filteredPrioMembers.length > 0 && (
                <div className={cn(MemberWrapperStyle, "lg:w-full")}>
                  {filteredPrioMembers.map((m: any, j: number) => (
                    <div key={m.id ?? j} className="w-80 flex-shrink-0">
                      <MemberTile member={m} idx={j} />
                    </div>
                  ))}
                </div>
              )}

              {filteredMembers.length > 0 && (
                <div className={cn(MemberWrapperStyle, "lg:w-full max-w-[1500px]")}>
                  {filteredMembers.map((m: any, j: number) => (
                    <div key={m.id ?? j} className='w-80 flex-shrink-0'>
                      <MemberTile member={m} idx={j} />
                    </div>
                  ))}
                </div>
              )}
            </section>
          )
        })
      )}
      <div className="h-20" />
      </div>
    </main>
  )
}