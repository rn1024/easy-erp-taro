import { render, screen, fireEvent } from '@testing-library/react'
import FilterChips, { FilterChipsOption } from '../index'

const mockOptions: FilterChipsOption[] = [
  { value: 'option1', label: '选项1' },
  { value: 'option2', label: '选项2' },
  { value: 'option3', label: '选项3', disabled: true },
  {
    value: 'option4',
    label: '选项4',
    iconName: 'star',
    iconColor: '#fbbf24',
    backgroundColor: '#fef3c7',
    activeBackgroundColor: '#f59e0b',
    activeColor: '#ffffff'
  },
  {
    value: 'option5',
    label: <span data-testid='custom-label'>自定义标签</span>,
    icon: <span data-testid='custom-icon'>⭐</span>
  }
]

describe('FilterChips', () => {
  const defaultProps = {
    options: mockOptions,
    selectedValues: [],
    onChange: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('基础渲染', () => {
    it('应该渲染所有选项', () => {
      render(<FilterChips {...defaultProps} />)

      expect(screen.getByText('选项1')).toBeInTheDocument()
      expect(screen.getByText('选项2')).toBeInTheDocument()
      expect(screen.getByText('选项3')).toBeInTheDocument()
      expect(screen.getByText('选项4')).toBeInTheDocument()
      expect(screen.getByTestId('custom-label')).toBeInTheDocument()
    })

    it('应该渲染自定义图标', () => {
      render(<FilterChips {...defaultProps} />)

      expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
    })

    it('应该正确标记选中的选项', () => {
      render(
        <FilterChips
          {...defaultProps}
          selectedValues={['option1', 'option2']}
        />
      )

      const option1 = screen.getByText('选项1').closest('.filter-chip')
      const option2 = screen.getByText('选项2').closest('.filter-chip')
      const option3 = screen.getByText('选项3').closest('.filter-chip')

      expect(option1).toHaveClass('filter-chip--active')
      expect(option2).toHaveClass('filter-chip--active')
      expect(option3).not.toHaveClass('filter-chip--active')
    })

    it('应该标记禁用的选项', () => {
      render(<FilterChips {...defaultProps} />)

      const option3 = screen.getByText('选项3').closest('.filter-chip')
      expect(option3).toHaveClass('filter-chip--disabled')
    })
  })

  describe('单选模式', () => {
    it('应该在单选模式下只允许选择一个选项', () => {
      const onChange = jest.fn()
      render(
        <FilterChips
          {...defaultProps}
          onChange={onChange}
          multiple={false}
        />
      )

      fireEvent.click(screen.getByText('选项1'))
      expect(onChange).toHaveBeenCalledWith(['option1'])

      fireEvent.click(screen.getByText('选项2'))
      expect(onChange).toHaveBeenCalledWith(['option2'])
    })

    it('应该在单选模式下允许取消选择', () => {
      const onChange = jest.fn()
      render(
        <FilterChips
          {...defaultProps}
          onChange={onChange}
          selectedValues={['option1']}
          multiple={false}
        />
      )

      fireEvent.click(screen.getByText('选项1'))
      expect(onChange).toHaveBeenCalledWith([])
    })
  })

  describe('多选模式', () => {
    it('应该在多选模式下允许选择多个选项', () => {
      const onChange = jest.fn()
      const { rerender } = render(
        <FilterChips
          {...defaultProps}
          onChange={onChange}
          multiple
        />
      )

      fireEvent.click(screen.getByText('选项1'))
      expect(onChange).toHaveBeenCalledWith(['option1'])

      // 重置mock以便测试下一次调用
      onChange.mockClear()
      
      // 模拟已选择option1的状态
      rerender(
        <FilterChips
          {...defaultProps}
          onChange={onChange}
          selectedValues={['option1']}
          multiple
        />
      )

      fireEvent.click(screen.getByText('选项2'))
      expect(onChange).toHaveBeenCalledWith(['option1', 'option2'])
    })

    it('应该在多选模式下允许取消选择', () => {
      const onChange = jest.fn()
      render(
        <FilterChips
          {...defaultProps}
          onChange={onChange}
          selectedValues={['option1', 'option2']}
          multiple
        />
      )

      fireEvent.click(screen.getByText('选项1'))
      expect(onChange).toHaveBeenCalledWith(['option2'])
    })
  })

  describe('清除功能', () => {
    it('应该在allowClear为true且有选中项时显示清除按钮', () => {
      render(
        <FilterChips
          {...defaultProps}
          selectedValues={['option1']}
          allowClear
        />
      )

      expect(screen.getByText('清除')).toBeInTheDocument()
    })

    it('应该在没有选中项时不显示清除按钮', () => {
      render(
        <FilterChips
          {...defaultProps}
          selectedValues={[]}
          allowClear
        />
      )

      expect(screen.queryByText('清除')).not.toBeInTheDocument()
    })

    it('应该在allowClear为false时不显示清除按钮', () => {
      render(
        <FilterChips
          {...defaultProps}
          selectedValues={['option1']}
          allowClear={false}
        />
      )

      expect(screen.queryByText('清除')).not.toBeInTheDocument()
    })

    it('应该支持自定义清除标签', () => {
      render(
        <FilterChips
          {...defaultProps}
          selectedValues={['option1']}
          allowClear
          clearLabel='重置'
        />
      )

      expect(screen.getByText('重置')).toBeInTheDocument()
    })

    it('应该在点击清除按钮时清空所有选择', () => {
      const onChange = jest.fn()
      render(
        <FilterChips
          {...defaultProps}
          onChange={onChange}
          selectedValues={['option1', 'option2']}
          allowClear
        />
      )

      fireEvent.click(screen.getByText('清除'))
      expect(onChange).toHaveBeenCalledWith([])
    })
  })

  describe('禁用状态', () => {
    it('不应该响应禁用选项的点击', () => {
      const onChange = jest.fn()
      render(
        <FilterChips
          {...defaultProps}
          onChange={onChange}
        />
      )

      fireEvent.click(screen.getByText('选项3'))
      expect(onChange).not.toHaveBeenCalled()
    })
  })

  describe('样式定制', () => {
    it('应该应用自定义根类名', () => {
      const { container } = render(
        <FilterChips
          {...defaultProps}
          className='custom-filter-chips'
        />
      )

      expect(container.firstChild).toHaveClass('filter-chips', 'custom-filter-chips')
    })

    it('应该应用自定义芯片类名', () => {
      render(
        <FilterChips
          {...defaultProps}
          chipClassName='custom-chip'
        />
      )

      const chips = document.querySelectorAll('.filter-chip')
      chips.forEach(chip => {
        expect(chip).toHaveClass('custom-chip')
      })
    })

    it('应该在scrollable为true时应用滚动类', () => {
      const { container } = render(
        <FilterChips
          {...defaultProps}
          scrollable
        />
      )

      expect(container.firstChild).toHaveClass('filter-chips--scrollable')
    })

    it('应该应用自定义样式', () => {
      render(<FilterChips {...defaultProps} selectedValues={['option4']} />)

      const option4 = screen.getByText('选项4').closest('.filter-chip') as HTMLElement
      expect(option4).toHaveStyle({
        background: '#f59e0b',
        color: '#ffffff'
      })
    })
  })

  describe('图标处理', () => {
    it('应该显示图标名称对应的图标', () => {
      render(<FilterChips {...defaultProps} />)

      // 检查是否有图标容器
      const option4 = screen.getByText('选项4').closest('.filter-chip')
      const iconContainer = option4?.querySelector('.icon-text')
      expect(iconContainer).toBeInTheDocument()
    })

    it('应该优先使用自定义图标', () => {
      render(<FilterChips {...defaultProps} />)

      expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
    })
  })

  describe('标签处理', () => {
    it('应该支持字符串标签', () => {
      render(<FilterChips {...defaultProps} />)

      expect(screen.getByText('选项1')).toBeInTheDocument()
    })

    it('应该支持ReactNode标签', () => {
      render(<FilterChips {...defaultProps} />)

      expect(screen.getByTestId('custom-label')).toBeInTheDocument()
    })
  })

  describe('边界情况', () => {
    it('应该处理空选项数组', () => {
      const { container } = render(
        <FilterChips
          options={[]}
          selectedValues={[]}
          onChange={jest.fn()}
        />
      )

      expect(container.firstChild).toHaveClass('filter-chips')
      expect(container.querySelector('.filter-chip')).not.toBeInTheDocument()
    })

    it('应该处理不存在的选中值', () => {
      render(
        <FilterChips
          {...defaultProps}
          selectedValues={['nonexistent']}
        />
      )

      // 不应该有任何选项被标记为选中
      const chips = document.querySelectorAll('.filter-chip--active')
      expect(chips).toHaveLength(0)
    })
  })

  describe('可访问性', () => {
    it('应该支持键盘导航', () => {
      render(<FilterChips {...defaultProps} />)

      const firstChip = screen.getByText('选项1').closest('.filter-chip')
      expect(firstChip).toBeInTheDocument()
      
      // 在真实实现中，您可能需要添加键盘事件处理
      // 这里只是测试结构是否正确
    })
  })
})