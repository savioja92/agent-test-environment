import type { AiTrapPayload } from './types';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from './components/ui/button';

interface VariantAModalProps {
  payload: Pick<AiTrapPayload, 'title' | 'description'>;
  onAccept: () => void;
  onReject: () => void;
}

export function VariantAModal({
  payload,
  onAccept,
  onReject,
}: VariantAModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm p-4">
      <Card className="w-full max-w-md shadow-xl border">
        <CardHeader>
          <CardTitle className="text-lg">{payload.title}</CardTitle>
          <CardDescription className="text-sm text-foreground/80 pt-1">
            {payload.description}
          </CardDescription>
        </CardHeader>

        <CardFooter className="flex justify-end gap-2 border-t pt-4">
          <Button variant="outline" onClick={onReject}>
            Reject / Cancel
          </Button>
          <Button variant="default" onClick={onAccept}>
            Accept
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}