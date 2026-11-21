import { useState, useEffect } from 'react';
import {
  BracesIcon,
  CheckIcon,
  ChevronRightIcon,
  FolderIcon,
  XIcon,
} from 'lucide-react';
import type { AiTrapPayload } from './types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from './components/ui/button';

interface VariantBModalProps {
  payload: AiTrapPayload;
  onAccept: () => void;
  onReject: () => void;
  onFrictionInteraction?: () => void;
  onDisabledClick?: () => void;
}

export function VariantBModal({
  payload,
  onAccept,
  onReject,
  onFrictionInteraction,
  onDisabledClick,
}: VariantBModalProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTargetPreviewOpen, setIsTargetPreviewOpen] = useState(false);

  useEffect(() => {
    setIsConfirmed(false);
    setInputValue('');
    setIsTargetPreviewOpen(false);
  }, [payload.id]);

  const isCritical = payload.severity === 'critical';

  const isCriticalComplete =
    payload.expectedInput !== undefined && inputValue === payload.expectedInput;

  const canAccept = isCritical ? isCriticalComplete : isConfirmed;

  const blastRadiusScope = payload.blastRadius.scope ?? null;
  const { targetDetails } = payload.blastRadius;

  const handleOpenTargetPreview = () => {
    if (onFrictionInteraction) onFrictionInteraction();
    setIsTargetPreviewOpen(true);
  };

  const handleConfirmChange = () => {
    if (onFrictionInteraction) onFrictionInteraction();
    setIsConfirmed((prev) => !prev);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onFrictionInteraction) onFrictionInteraction();
    setInputValue(e.target.value);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/75 backdrop-blur-sm p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-border/80">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle className="text-lg leading-snug ">
                Suggested action <div className='text-base pt-3 text-muted-foreground'>{payload.title}</div>
              </CardTitle>
              <CardDescription className="text-sm pt-3 text-muted-foreground">
                {payload.description}
              </CardDescription>
            </div>
            <span
              className={`shrink-0 text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${isCritical
                  ? 'bg-red-500/10 text-red-700 border-red-500/30 dark:text-red-300'
                  : 'bg-amber-500/10 text-amber-700 border-amber-500/30 dark:text-amber-300'
                }`}
            >
              {payload.severity}
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Two-column Bento layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
            {/* Left column: Two stacked bento boxes (Target & Action) */}
            <div className="flex flex-col gap-4">
              {/* Clickable Target Bento Button */}
              <button
                type="button"
                onClick={handleOpenTargetPreview}
                className="flex-1 w-full text-left rounded-xl border border-border/80 bg-muted/40 p-5 space-y-1.5 transition-all hover:bg-muted/80 hover:border-foreground/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer group"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold uppercase tracking-wider text-foreground/85">
                    Target
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    Inspect
                    <ChevronRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
                <p className="text-sm sm:text-base font-medium text-foreground break-words">
                  {payload.blastRadius.target}
                </p>
              </button>

              <div className="flex-1 rounded-xl border border-border/60 bg-muted/40 p-5 space-y-1.5">
                <p className="text-sm font-bold uppercase tracking-wider text-foreground/85">
                  Action
                </p>
                <p className="text-sm sm:text-base font-medium text-foreground break-words">
                  {payload.blastRadius.action}
                </p>
              </div>
            </div>

            {/* Right column: Impact / Scope highlight box */}
            <div
              className={`rounded-xl border p-5 flex flex-col gap-3 ${isCritical
                  ? 'bg-red-500/10 border-red-500/25'
                  : 'bg-amber-500/10 border-amber-500/25'
                }`}
            >
              <p
                className={`text-sm font-bold uppercase tracking-wider ${isCritical
                    ? 'text-red-700 dark:text-red-400'
                    : 'text-amber-700 dark:text-amber-400'
                  }`}
              >
                Impact
              </p>

              {blastRadiusScope ? (
                <>
                  <p
                    className={`text-2xl sm:text-3xl font-bold tracking-tight leading-tight break-words ${isCritical
                        ? 'text-red-700 dark:text-red-300'
                        : 'text-amber-700 dark:text-amber-200'
                      }`}
                  >
                    {blastRadiusScope}
                  </p>
                  <p
                    className={`text-sm leading-relaxed break-words ${isCritical
                        ? 'text-red-900/80 dark:text-red-100/75'
                        : 'text-amber-900/80 dark:text-amber-100/75'
                      }`}
                  >
                    {payload.blastRadius.impact}
                  </p>
                </>
              ) : (
                <p
                  className={`text-xl sm:text-2xl font-bold tracking-tight leading-snug break-words ${isCritical
                      ? 'text-red-700 dark:text-red-300'
                      : 'text-amber-700 dark:text-amber-200'
                    }`}
                >
                  {payload.blastRadius.impact}
                </p>
              )}
            </div>
          </div>

          {/* Moderate friction: Single confirmation checkbox */}
          {!isCritical && (
            <div className="pt-2 border-t border-border/60">
              <label className="flex items-start gap-3 text-sm cursor-pointer select-none group">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={isConfirmed}
                  onChange={handleConfirmChange}
                />
                <span
                  aria-hidden="true"
                  className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 ${isConfirmed
                      ? 'bg-green-600 border-green-600 text-white'
                      : 'border-muted-foreground/45 bg-transparent group-hover:border-muted-foreground/80'
                    }`}
                >
                  {isConfirmed && <CheckIcon className="h-3 w-3 stroke-[3]" />}
                </span>
                <span className="font-medium text-foreground leading-snug">
                  I reviewed the proposed changes and accept closure without
                  manual review
                </span>
              </label>
            </div>
          )}

          {/* Critical friction: Notice + Confirmation text input */}
          {isCritical && (
            <div className="space-y-2.5 pt-1">
              <p className="text-sm font-medium text-foreground">
                By authorizing, you accept the critical task and its results
              </p>
              <label className="block text-sm text-muted-foreground">
                To confirm this critical action, type{' '}
                <code className="bg-red-500/10 border border-red-500/25 px-1.5 py-0.5 rounded font-mono text-xs font-semibold text-red-700 dark:text-red-300">
                  {payload.expectedInput}
                </code>{' '}
                below:
              </label>
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder={payload.expectedInput}
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-red-500/60 font-mono"
              />
            </div>
          )}
        </CardContent>

        <CardFooter className="flex items-center justify-between gap-3 border-t border-border/60 pt-4 mt-2">
          <Button variant="ghost" onClick={onReject}>
            Do not authorize
          </Button>

          {/* Wrapper to catch disabled clicks for telemetry */}
          <div
            className={!canAccept ? 'cursor-not-allowed' : undefined}
            onClickCapture={() => {
              if (!canAccept && onDisabledClick) {
                onDisabledClick();
              }
            }}
          >
            <Button
              variant={isCritical ? 'destructive' : 'default'}
              disabled={!canAccept}
              onClick={onAccept}
              className={
                !canAccept
                  ? 'pointer-events-none'
                  : !isCritical
                    ? 'bg-green-600 text-white hover:bg-green-700 transition-colors'
                    : ''
              }
            >
              {isCritical ? 'Accept' : 'Accept AI Suggestion'}
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Blast Radius Target Inspection Sub-Modal */}
      {isTargetPreviewOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-background/60 backdrop-blur-[2px] p-4"
          onClick={() => setIsTargetPreviewOpen(false)}
        >
          <Card
            className="w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader className="flex flex-row items-start justify-between gap-3 pb-3 border-b border-border/60">
              <div className="space-y-1">
                <CardTitle className="text-base flex items-center gap-2">
                  {targetDetails.type === 'json_list' ? (
                    <BracesIcon className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <FolderIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
                  )}
                  Target Blast Radius
                </CardTitle>
                <CardDescription className="text-xs">
                  {payload.blastRadius.target}
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0"
                onClick={() => setIsTargetPreviewOpen(false)}
                aria-label="Close blast radius preview"
              >
                <XIcon className="h-4 w-4" />
              </Button>
            </CardHeader>

            <CardContent className="pt-4 overflow-y-auto">
              {targetDetails.type === 'json_list' ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Affected records (JSON)</span>
                    <span className="font-mono font-medium">
                      {targetDetails.items.length} items
                    </span>
                  </div>
                  <pre className="rounded-lg border border-border bg-muted/60 p-3.5 text-xs font-mono overflow-x-auto leading-relaxed">
                    {JSON.stringify(targetDetails.items, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="rounded-xl border border-red-500/25 bg-red-500/5 p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-red-500/10 p-2.5 text-red-600 dark:text-red-400 shrink-0">
                      <FolderIcon className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {targetDetails.folderName}
                        </p>
                        <span className="shrink-0 rounded-full bg-red-500/15 border border-red-500/30 px-2.5 py-0.5 text-xs font-mono font-semibold text-red-700 dark:text-red-300">
                          {targetDetails.itemCount} items
                        </span>
                      </div>
                      {targetDetails.path && (
                        <p className="text-xs font-mono text-muted-foreground truncate">
                          {targetDetails.path}
                        </p>
                      )}
                    </div>
                  </div>
                  {targetDetails.summary && (
                    <p className="text-xs text-muted-foreground leading-relaxed border-t border-red-500/15 pt-2.5">
                      {targetDetails.summary}
                    </p>
                  )}
                </div>
              )}
            </CardContent>

            <CardFooter className="justify-end border-t border-border/60 pt-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsTargetPreviewOpen(false)}
              >
                Close
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}