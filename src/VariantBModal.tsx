import { useState, useEffect } from 'react';
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
  // New telemetry callbacks:
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
  const [checkedItems, setCheckedItems] = useState({
    target: false,
    action: false,
    impact: false,
  });
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    setCheckedItems({ target: false, action: false, impact: false });
    setInputValue('');
  }, [payload.id]);

  const isModerateComplete =
    checkedItems.target && checkedItems.action && checkedItems.impact;

  const isCriticalComplete =
    payload.expectedInput !== undefined && inputValue === payload.expectedInput;

  const canAccept =
    payload.severity === 'moderate' ? isModerateComplete : isCriticalComplete;

  const handleCheckboxChange = (key: keyof typeof checkedItems) => {
    if (onFrictionInteraction) onFrictionInteraction();
    setCheckedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onFrictionInteraction) onFrictionInteraction();
    setInputValue(e.target.value);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm p-4">
      <Card className="w-full max-w-lg shadow-xl border-2">
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-lg">{payload.title}</CardTitle>
            <span
              className={`text-xs font-semibold uppercase px-2.5 py-0.5 rounded-full ${
                payload.severity === 'critical'
                  ? 'bg-red-100 text-red-800 border border-red-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}
            >
              {payload.severity}
            </span>
          </div>
          <CardDescription className="text-sm text-foreground/80 pt-1">
            {payload.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <p className="text-xs font-mono font-semibold uppercase text-muted-foreground">
              JSON Blast Radius Preview
            </p>
            <pre className="bg-muted p-3 rounded-md text-xs font-mono overflow-x-auto border">
              {JSON.stringify(payload.blastRadius, null, 2)}
            </pre>
          </div>

          {payload.severity === 'moderate' && (
            <div className="space-y-2.5 pt-2 border-t">
              <p className="text-xs font-medium text-muted-foreground">
                Acknowledge all impact parameters to proceed:
              </p>
              <label className="flex items-start gap-2.5 text-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-gray-300"
                  checked={checkedItems.target}
                  onChange={() => handleCheckboxChange('target')}
                />
                <span>
                  <strong>Target:</strong> {payload.blastRadius.target}
                </span>
              </label>
              <label className="flex items-start gap-2.5 text-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-gray-300"
                  checked={checkedItems.action}
                  onChange={() => handleCheckboxChange('action')}
                />
                <span>
                  <strong>Action:</strong> {payload.blastRadius.action}
                </span>
              </label>
              <label className="flex items-start gap-2.5 text-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-gray-300"
                  checked={checkedItems.impact}
                  onChange={() => handleCheckboxChange('impact')}
                />
                <span>
                  <strong>Impact:</strong> {payload.blastRadius.impact}
                </span>
              </label>
            </div>
          )}

          {payload.severity === 'critical' && (
            <div className="space-y-2 pt-2 border-t">
              <label className="block text-sm font-medium">
                To confirm this critical action, type{' '}
                <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs font-bold text-red-600">
                  {payload.expectedInput}
                </code>{' '}
                below:
              </label>
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder={payload.expectedInput}
                className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring font-mono"
              />
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-end gap-2 border-t pt-4">
          <Button variant="outline" onClick={onReject}>
            Reject / Cancel
          </Button>

          {/* Wrapper to catch disabled clicks */}
          <div
            onClickCapture={() => {
              if (!canAccept && onDisabledClick) {
                onDisabledClick();
              }
            }}
          >
            <Button
              variant={
                payload.severity === 'critical' ? 'destructive' : 'default'
              }
              disabled={!canAccept}
              onClick={onAccept}
              // Ensure the button itself doesn't block the click from reaching the wrapper when disabled
              className={!canAccept ? 'pointer-events-none' : ''}
            >
              {payload.severity === 'moderate'
                ? 'Accept AI Suggestion'
                : 'Accept'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}