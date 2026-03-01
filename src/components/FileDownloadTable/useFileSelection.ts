import { useState, useMemo } from 'react'
import type { FileItem } from './types'

export const useFileSelection = (files: FileItem[]) => {
  const [selected, setSelected] = useState<Set<string>>(new Set())

  // Get all files that can be selected
  const selectableFiles = useMemo(
    () => files,
    [files]
  )

  // Compute selection states
  const allSelected = useMemo(
    () => selectableFiles.length > 0 && selectableFiles.every(file => selected.has(file.name)),
    [selectableFiles, selected]
  )

  const someSelected = useMemo(
    () => selected.size > 0 && !allSelected,
    [selected.size, allSelected]
  )

  const isIndeterminate = useMemo(
    () => someSelected && !allSelected,
    [someSelected, allSelected]
  )

  // Toggle individual file selection
  const toggleFile = (name: string) => {
    setSelected(prev => {
      const newSelected = new Set(prev)
      if (newSelected.has(name)) {
        newSelected.delete(name)
      } else {
        newSelected.add(name)
      }
      return newSelected
    })
  }

  // Toggle all files
  const toggleAll = () => {
    if (allSelected) {
      // Deselect all
      setSelected(new Set())
    } else {
      // Select all files
      setSelected(new Set(selectableFiles.map(f => f.name)))
    }
  }

  // Get selected file objects
  const getSelectedFiles = () => {
    return files.filter(file => selected.has(file.name))
  }

  return {
    selected,
    selectableFiles,
    allSelected,
    someSelected,
    isIndeterminate,
    toggleFile,
    toggleAll,
    getSelectedFiles,
  }
}
