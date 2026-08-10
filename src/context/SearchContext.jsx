import { createContext, useContext, useState } from "react"

// 1. create context
const SearchContext = createContext()

// 2. provider
export function SearchProvider({ children }) {
  const [search, setSearch] = useState("")

  return (
    <SearchContext.Provider value={{ search, setSearch }}>
      {children}
    </SearchContext.Provider>
  )
}

// 3. custom hook
export function useSearch() {
  return useContext(SearchContext)
}