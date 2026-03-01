import { useEffect, useRef } from 'react'
import type { FileItem } from './types'
import { useFileSelection } from './useFileSelection'
import './FileDownloadTable.css'

interface FileDownloadTableProps {
  files: FileItem[]
}

export const FileDownloadTable = ({ files }: FileDownloadTableProps) => {
  const {
    selected,
    allSelected,
    isIndeterminate,
    toggleFile,
    toggleAll,
    getSelectedFiles,
  } = useFileSelection(files)

  const selectAllRef = useRef<HTMLInputElement>(null)

  // Set indeterminate state on the select-all checkbox
  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = isIndeterminate
    }
  }, [isIndeterminate])

  const handleDownload = () => {
    const selectedFiles = getSelectedFiles()
    if (selectedFiles.length === 0) {
      alert('No files selected')
      return
    }

    const fileDetails = selectedFiles
      .map(file => `Name: ${file.name}\nDevice: ${file.device}\nPath: ${file.path}`)
      .join('\n\n')

    alert(`Downloading ${selectedFiles.length} file(s):\n\n${fileDetails}`)
  }

  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  const selectionText = selected.size === 0
    ? 'None Selected'
    : `Selected ${selected.size}`

  return (
    <div className="file-download-table-container">
      <div className="table-header">
        <div className="header-left">
          <input
            ref={selectAllRef}
            type="checkbox"
            checked={allSelected}
            onChange={toggleAll}
            aria-label="Select all files"
            className="select-all-checkbox"
          />
          <span className="selection-count">{selectionText}</span>
        </div>
        <button
          className="download-button"
          onClick={handleDownload}
          disabled={selected.size === 0}
        >
          <span className="download-icon">⬇</span>
          Download Selected
        </button>
      </div>

      <table className="file-table">
        <thead>
          <tr>
            <th className="checkbox-column"></th>
            <th>Name</th>
            <th>Device</th>
            <th>Path</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => {
            const isSelected = selected.has(file.name)

            return (
              <tr
                key={file.name}
                className={isSelected ? 'selected' : ''}
              >
                <td className="checkbox-column">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleFile(file.name)}
                    aria-label={`Select ${file.name}`}
                  />
                </td>
                <td>{file.name}</td>
                <td>{file.device}</td>
                <td className="path-column">{file.path}</td>
                <td>
                  <span className={`status status-${file.status}`}>
                    {file.status === 'available' && <span className="status-dot"></span>}
                    {formatStatus(file.status)}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
