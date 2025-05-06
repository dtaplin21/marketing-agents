import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"

export type DialogProps = React.PropsWithChildren<{
  open?: boolean
  onOpenChange?: (open: boolean) => void
}>

const DialogContent = DialogPrimitive.Content

export { Dialog, DialogContent }

function Dialog({ children, open, onOpenChange }: DialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50" />
        {children}
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
} 