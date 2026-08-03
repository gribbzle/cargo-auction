import { useState, useRef, useEffect, useCallback, type KeyboardEvent } from 'react'

interface ComboboxOption {
  value: string
  label: string
  description?: string
}

interface ComboboxProps {
  label?: string
  options: ComboboxOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string
  className?: string
}

export function Combobox({
  label,
  options,
  value,
  onChange,
  placeholder = 'Поиск...',
  error,
  className = '',
}: ComboboxProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const filtered = options.filter((opt) =>
    opt.label.toLowerCase().includes(query.toLowerCase()),
  )

  const selectedLabel = options.find((opt) => opt.value === value)?.label ?? ''

  const open = useCallback(() => {
    setIsOpen(true)
    setActiveIndex(-1)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setQuery('')
    setActiveIndex(-1)
  }, [])

  const select = useCallback(
    (val: string) => {
      onChange(val === value ? '' : val)
      close()
      inputRef.current?.blur()
    },
    [onChange, value, close],
  )

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [close])

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        e.preventDefault()
        open()
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1))
        break
      case 'Enter':
        e.preventDefault()
        if (activeIndex >= 0 && filtered[activeIndex]) {
          select(filtered[activeIndex].value)
        }
        break
      case 'Escape':
        close()
        break
    }
  }

  return (
    <div className={`flex flex-col gap-1 relative ${className}`} ref={containerRef}>
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <input
        ref={inputRef}
        type="text"
        value={isOpen ? query : selectedLabel}
        onChange={(e) => {
          setQuery(e.target.value)
          if (!isOpen) open()
        }}
        onFocus={open}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 ${error ? 'border-red-500' : ''}`}
        role="combobox"
        aria-expanded={isOpen}
        aria-autocomplete="list"
      />
      {isOpen && filtered.length > 0 && (
        <ul
          ref={listRef}
          role="listbox"
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg"
        >
          {filtered.map((opt, i) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              className={`cursor-pointer px-3 py-2 text-sm hover:bg-sky-50 ${i === activeIndex ? 'bg-sky-100' : ''} ${opt.value === value ? 'bg-sky-50 font-medium' : ''}`}
              onMouseDown={() => select(opt.value)}
              onMouseEnter={() => setActiveIndex(i)}
            >
              <span>{opt.label}</span>
              {opt.description && (
                <span className="ml-2 text-xs text-gray-500">{opt.description}</span>
              )}
            </li>
          ))}
        </ul>
      )}
      {isOpen && query && filtered.length === 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-500 shadow-lg">
          Ничего не найдено
        </div>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
