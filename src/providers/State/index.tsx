'use client'

import { Event } from '@/payload-types'
import React, { createContext, Dispatch, SetStateAction, useContext, useState } from 'react'

type StateContextType = {
  menuOpen: boolean
  setMenuOpen: (o: boolean) => void
  filterOpen: boolean
  setFilterOpen: (o: boolean) => void
  focusedEvent: Event | null
  setFocusedEvent: (e: Event | null) => void
  tags: string[]
  setTags: (t: string[]) => void
  tagsIndices: number[]
  setTagsIndices: (i: number[]) => void
  startDate: Date | undefined
  setStartDate: Dispatch<SetStateAction<Date>>
  endDate: Date | undefined
  setEndDate: Dispatch<SetStateAction<Date>>
}

const initialContext: StateContextType = {
  menuOpen: false,
  setMenuOpen: () => null,
  filterOpen: false,
  setFilterOpen: () => null,
  focusedEvent: null,
  setFocusedEvent: () => null,
  tags: [],
  setTags: () => null,
  tagsIndices: [],
  setTagsIndices: () => null,
  startDate: undefined,
  setStartDate: () => null,
  endDate: undefined,
  setEndDate: () => null,
}

const StateContext = createContext(initialContext)

export const StateProvider = ({ children }: { children: React.ReactNode }) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false)
  const [filterOpen, setFilterOpen] = useState<boolean>(false)
  const [focusedEvent, setFocusedEvent] = useState<Event | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [tagsIndices, setTagsIndices] = useState<number[]>([])
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()

  return (
    <StateContext.Provider
      value={{
        menuOpen,
        setMenuOpen,
        filterOpen,
        setFilterOpen,
        focusedEvent,
        setFocusedEvent,
        tags,
        setTags,
        tagsIndices,
        setTagsIndices,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = (): StateContextType => useContext(StateContext)

