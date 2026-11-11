import { useState, useEffect } from "react"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import { ArrowUpIcon, CheckCircle2Icon } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "./components/ui/item"
import { Button } from "./components/ui/button"
import { useTestEngine } from "./useTestEngine"
import { VariantAModal } from "./VariantAModal"
import { VariantBModal } from "./VariantBModal"
import type { Ticket, TicketCategory } from "./types"

function App() {
  const { state, solveTicket, startTest, resolveAiModal } = useTestEngine()
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [variant, setVariant] = useState<"A" | "B">("A")
  const [listRef] = useAutoAnimate<HTMLDivElement>({ duration: 300 })

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const rawVariant = params.get("variant")?.toUpperCase()

    if (rawVariant === "A" || rawVariant === "B") {
      setVariant(rawVariant)
    } else {
      setVariant("A")
    }
  }, [])

  const handleSolve = (ticketId: string, category: TicketCategory) => {
    solveTicket(ticketId, category)
    setSelectedTicket(null)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-3">
      <div className="flex items-start gap-3">
        <Button variant="outline" size="lg" onClick={startTest}>
          Start the test
        </Button>
        <Button variant="outline" size="icon" aria-label="Submit">
          <ArrowUpIcon className={state.isTestActive ? "text-green-500" : ""} />
        </Button>
      </div>


     

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Received</CardTitle>
          <CardDescription>Helpdesk-requests</CardDescription>
        </CardHeader>
        <CardContent>
          All of the received support-request tickets are listed below. Currently showing top 5.
        </CardContent>
      </Card>

       <div className="flex items-baseline gap-2 py-1">
  <span className="text-sm font-medium text-muted-foreground">
    Solved tickets:
  </span>
  <span className="text-2xl font-bold tracking-tight tabular-nums">
    {state.solvedCount}
  </span>
</div>

      <div ref={listRef} className="w-full max-w-md flex flex-col gap-3">
        {state.visibleTickets.map((ticket) => {
          const isSolved = ticket.status === "solved"

          return (
            <Item
              key={ticket.id}
              variant="outline"
              className={`w-full transition-colors duration-300 ${
                isSolved
                  ? "opacity-50 bg-muted/40 border-green-500/40"
                  : "opacity-100"
              }`}
            >
              <ItemContent>
                <ItemTitle
                  className={isSolved ? "line-through text-muted-foreground" : ""}
                >
                  Request
                </ItemTitle>
                <ItemDescription>{ticket.ticketNr}</ItemDescription>
              </ItemContent>
              <ItemActions>
                {isSolved ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-green-600 animate-in fade-in zoom-in-95 duration-200">
                    <CheckCircle2Icon className="w-4 h-4" />
                    Solved
                  </span>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    Open
                  </Button>
                )}
              </ItemActions>
            </Item>
          )
        })}
      </div>

      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md shadow-lg">
            <CardHeader>
              <CardTitle>{selectedTicket.title}</CardTitle>
              <CardDescription>{selectedTicket.description}</CardDescription>
            </CardHeader>
            <CardFooter className="flex flex-col items-center gap-2">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="w-fit items-center"
                  onClick={() => handleSolve(selectedTicket.id, "helpdesk")}
                >
                  HelpDesk
                </Button>

                <Button
                  variant="outline"
                  onClick={() => handleSolve(selectedTicket.id, "billing")}
                >
                  Billing
                </Button>
              </div>

              <Button variant="outline" onClick={() => setSelectedTicket(null)}>
                Cancel
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {state.activeAiTrap &&
        (variant === "B" ? (
          <VariantBModal
            payload={state.activeAiTrap}
            onAccept={() => resolveAiModal("accepted")}
            onReject={() => resolveAiModal("rejected")}
          />
        ) : (
          <VariantAModal
            payload={state.activeAiTrap}
            onAccept={() => resolveAiModal("accepted")}
            onReject={() => resolveAiModal("rejected")}
          />
        ))}
    </div>
  )
}

export default App