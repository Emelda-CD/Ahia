
'use client';

/**
 * This component is no longer used as authentication has been removed.
 * It returns null to prevent errors in any part of the app that might still reference it,
 * and calls onOpenChange(false) to ensure it never remains visible.
 */
export function AuthModal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void}) {
  if (open) {
    onOpenChange(false);
  }
  return null;
}
