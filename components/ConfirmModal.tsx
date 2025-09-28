'use client';

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

type ConfirmModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  isLoading?: boolean;
};

export default function ConfirmModal({
  open,
  setOpen,
  onConfirm,
  title = 'Confirmer',
  description = 'Êtes-vous sûr de vouloir effectuer cette action ?',
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  confirmButtonVariant = 'default',
  isLoading = false,
}: ConfirmModalProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button variant={confirmButtonVariant} onClick={onConfirm} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
