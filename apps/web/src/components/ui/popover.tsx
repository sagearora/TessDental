import * as React from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"

interface PopoverProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

interface PopoverTriggerProps {
  asChild?: boolean
  children: React.ReactNode
  onClick?: () => void
}

interface PopoverContentProps {
  className?: string
  children: React.ReactNode
  align?: "start" | "center" | "end"
  sideOffset?: number
  triggerRef?: React.RefObject<HTMLElement | null> | React.RefObject<HTMLInputElement | null>
}

const PopoverContext = React.createContext<{
  open: boolean
  onOpenChange: (open: boolean) => void
}>({
  open: false,
  onOpenChange: () => {},
})

const Popover = ({ open, onOpenChange, children }: PopoverProps) => {
  return (
    <PopoverContext.Provider value={{ open, onOpenChange }}>
      {children}
    </PopoverContext.Provider>
  )
}

const PopoverTrigger = React.forwardRef<
  HTMLButtonElement,
  PopoverTriggerProps
>(({ asChild, children, onClick, ...props }, ref) => {
  const { open, onOpenChange } = React.useContext(PopoverContext)

  const handleClick = () => {
    onOpenChange(!open)
    onClick?.()
  }

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      ref,
      onClick: handleClick,
    } as any)
  }

  return (
    <button
      ref={ref}
      type="button"
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  )
})
PopoverTrigger.displayName = "PopoverTrigger"

const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ className, children, align = "start", sideOffset = 4, triggerRef, ...props }, ref) => {
    const { open, onOpenChange } = React.useContext(PopoverContext)
    const [position, setPosition] = React.useState<{ top: number; left: number; width: number } | null>(null)
    const contentRef = React.useRef<HTMLDivElement | null>(null)

    // Combine internal ref with forwarded ref
    const setRefs = (node: HTMLDivElement | null) => {
      contentRef.current = node
      if (typeof ref === "function") {
        ref(node)
      } else if (ref) {
        ;(ref as React.MutableRefObject<HTMLDivElement | null>).current = node
      }
    }

    React.useEffect(() => {
      if (open && triggerRef?.current) {
        const updatePosition = () => {
          const rect = triggerRef.current!.getBoundingClientRect()
          setPosition({
            // Use viewport coordinates directly so popover stays aligned with fixed headers
            top: rect.bottom + sideOffset,
            left: rect.left,
            width: rect.width,
          })
        }
        updatePosition()
        window.addEventListener("scroll", updatePosition, true)
        window.addEventListener("resize", updatePosition)
        return () => {
          window.removeEventListener("scroll", updatePosition, true)
          window.removeEventListener("resize", updatePosition)
        }
      } else {
        setPosition(null)
      }
    }, [open, triggerRef, sideOffset])

    // Close on outside click
    React.useEffect(() => {
      if (!open) return

      const handlePointerDown = (event: MouseEvent | TouchEvent) => {
        const target = event.target as Node | null
        if (!target) return

        const triggerEl = triggerRef?.current
        const contentEl = contentRef.current

        if (triggerEl?.contains(target) || contentEl?.contains(target)) {
          return
        }

        onOpenChange(false)
      }

      document.addEventListener("mousedown", handlePointerDown, true)
      document.addEventListener("touchstart", handlePointerDown, true)

      return () => {
        document.removeEventListener("mousedown", handlePointerDown, true)
        document.removeEventListener("touchstart", handlePointerDown, true)
      }
    }, [open, onOpenChange, triggerRef])

    // Close on Escape
    React.useEffect(() => {
      if (!open) return
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          onOpenChange(false)
        }
      }
      document.addEventListener("keydown", handleKeyDown)
      return () => {
        document.removeEventListener("keydown", handleKeyDown)
      }
    }, [open, onOpenChange])

    if (!open || !position) return null

    const content = (
      <div
        ref={setRefs}
        className={cn(
          "fixed z-[100] rounded-md border bg-white text-popover-foreground shadow-lg outline-none",
          className
        )}
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          width: `${position.width}px`,
        }}
        {...props}
      >
        {children}
      </div>
    )

    return createPortal(content, document.body)
  }
)
PopoverContent.displayName = "PopoverContent"

export { Popover, PopoverTrigger, PopoverContent }
