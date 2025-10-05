import { useCallback, useMemo, useRef, useState } from 'react'

export type FilterValue = string | string[] | null

export interface FilterConfigItem {
  multiple?: boolean
  defaultValue?: FilterValue
}

export type FilterConfig<TKeys extends string> = Record<TKeys, FilterConfigItem>

export type FilterState<TKeys extends string> = Record<TKeys, FilterValue>

export interface UseFiltersOptions<TKeys extends string> {
  config: FilterConfig<TKeys>
  onChange?: (state: FilterState<TKeys>) => void
}

export interface UseFiltersReturn<TKeys extends string> {
  values: FilterState<TKeys>
  setValue: (key: TKeys, value: FilterValue) => void
  toggleValue: (key: TKeys, value: string) => void
  isActive: (key: TKeys, value: string) => boolean
  reset: (key?: TKeys) => void
  clearAll: () => void
}

const normalizeValue = (value: FilterValue, multiple?: boolean): FilterValue => {
  if (multiple) {
    if (Array.isArray(value)) {
      return value
    }
    if (typeof value === 'string') {
      return value ? [value] : []
    }
    return []
  }
  if (Array.isArray(value)) {
    return value[0] ?? null
  }
  return value ?? null
}

function useFilters<TKeys extends string>(options: UseFiltersOptions<TKeys>): UseFiltersReturn<TKeys> {
  const { config, onChange } = options

  const createInitialState = useCallback(() => {
    const initialState = {} as FilterState<TKeys>
    ;(Object.keys(config) as TKeys[]).forEach((key) => {
      const { defaultValue, multiple } = config[key]
      initialState[key] = normalizeValue(defaultValue ?? null, multiple)
    })
    return initialState
  }, [config])

  const [values, setValues] = useState<FilterState<TKeys>>(createInitialState)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const emitChange = useCallback((nextState: FilterState<TKeys>) => {
    onChangeRef.current?.(nextState)
  }, [])

  const setValue = useCallback((key: TKeys, value: FilterValue) => {
    setValues(prev => {
      const configItem = config[key]
      const normalized = normalizeValue(value, configItem?.multiple)
      const nextState = { ...prev, [key]: normalized }
      emitChange(nextState)
      return nextState
    })
  }, [config, emitChange])

  const toggleValue = useCallback((key: TKeys, value: string) => {
    setValues(prev => {
      const configItem = config[key]
      const multiple = configItem?.multiple
      const prevValue = prev[key]

      let nextValue: FilterValue

      if (multiple) {
        const currentList = Array.isArray(prevValue) ? prevValue : []
        const exists = currentList.includes(value)
        nextValue = exists
          ? currentList.filter(item => item !== value)
          : [...currentList, value]
      } else {
        nextValue = prevValue === value ? null : value
      }

      const nextState = { ...prev, [key]: normalizeValue(nextValue, multiple) }
      emitChange(nextState)
      return nextState
    })
  }, [config, emitChange])

  const isActive = useCallback((key: TKeys, value: string) => {
    const currentValue = values[key]

    if (Array.isArray(currentValue)) {
      return currentValue.includes(value)
    }

    return currentValue === value
  }, [values])

  const reset = useCallback((key?: TKeys) => {
    if (!key) {
      const initial = createInitialState()
      setValues(initial)
      emitChange(initial)
      return
    }

    setValues(prev => {
      const configItem = config[key]
      const normalized = normalizeValue(configItem?.defaultValue ?? null, configItem?.multiple)
      const nextState = { ...prev, [key]: normalized }
      emitChange(nextState)
      return nextState
    })
  }, [config, createInitialState, emitChange])

  const clearAll = useCallback(() => {
    const cleared = {} as FilterState<TKeys>
    ;(Object.keys(config) as TKeys[]).forEach((key) => {
      const multiple = config[key]?.multiple
      cleared[key] = normalizeValue(null, multiple)
    })
    setValues(cleared)
    emitChange(cleared)
  }, [config, emitChange])

  return useMemo(() => ({
    values,
    setValue,
    toggleValue,
    isActive,
    reset,
    clearAll
  }), [values, setValue, toggleValue, isActive, reset, clearAll])
}

export default useFilters
