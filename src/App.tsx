import { useState, useEffect } from "react"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import { ArrowUpIcon, CheckCircle2Icon, DownloadIcon } from "lucide-react"
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
import { useTelemetry } from "./recorder/useTelemetry"
import { VariantAModal } from "./VariantAModal"
import { VariantBModal } from "./VariantBModal"
import type { AiTrapDecision, TestVariant, Ticket, TicketCategory } from "./types"

function getInitialVariant(): TestVariant {
  const params = new URLSearchParams(window.location.search)
  const rawVariant = params.get("variant")?.toUpperCase()
  return rawVariant === "B" ? "B" : "A"
}

function App() {
  const [variant] = useState<TestVariant>(getInitialVariant)
  const { state, solveTicket, startTest, resolveAiModal } = useTestEngine(variant)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [listRef] = useAutoAnimate<HTMLDivElement>({ duration: 300 })

  const {
    startSession,
    logTicketOpen,
    logTicketSolve,
    logAiModalOpen,
    logFrictionInteraction,
    logDisabledButtonClick,
    logAiModalResolve,
    exportToCsv,
  } = useTelemetry(variant)

  // Log whenever an AI Trap modal opens
  useEffect(() => {
    if (state.activeAiTrap) {
      logAiModalOpen({
        aiTrapId: state.activeAiTrap.id,
        severity: state.activeAiTrap.severity,
        isHallucination: state.activeAiTrap.correctDecision === "rejected",
      })
    }
  }, [state.activeAiTrap, logAiModalOpen])

  const handleStartTest = () => {
    setSelectedTicket(null)
    startSession(variant)
    startTest()
  }

  const handleOpenTicket = (ticket: Ticket) => {
    logTicketOpen(ticket.id)
    setSelectedTicket(ticket)
  }

  const handleSolve = (ticket: Ticket, selectedCategory: TicketCategory) => {
    logTicketSolve({
      ticketId: ticket.id,
      selectedCategory,
      correctCategory: ticket.category,
    })
    solveTicket(ticket.id, selectedCategory)
    setSelectedTicket(null)
  }

  const handleResolveAi = (decision: AiTrapDecision) => {
    logAiModalResolve(decision)
    resolveAiModal(decision)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-24 gap-3">
      <header className="fixed top-0 inset-x-0 z-40 flex items-center justify-center gap-3 p-4 bg-background/95 backdrop-blur-sm border-b">
        <Button variant="outline" size="lg" onClick={handleStartTest}>
          Start the test
        </Button>
        <Button variant="outline" size="icon" aria-label="Submit">
          <ArrowUpIcon className={state.isTestActive ? "text-green-500" : ""} />
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={exportToCsv}
          className="gap-2"
        >
          <DownloadIcon className="w-4 h-4" />
          Download CSV
        </Button>
      </header>

      <div className="flex items-baseline gap-2 py-1">
        <span className="text-sm font-medium text-muted-foreground">
          Solved tickets:
        </span>
        <span className="text-2xl font-bold tracking-tight tabular-nums">
          {state.solvedCount}
        </span>
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

      <div ref={listRef} className="w-full max-w-md flex flex-col gap-3">
        {state.visibleTickets.map((ticket) => {
          const isSolved = ticket.status === "solved"

          return (
            <Item
              key={ticket.id}
              variant="outline"
              className={`w-full transition-colors duration-300 ${isSolved
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
                    onClick={() => handleOpenTicket(ticket)}
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
            <CardFooter className="flex flex-col space-y-2 items-center gap-2">
              <div className="grid grid-cols-2 gap-6 ">
                <Button
                  variant="outline"
                  className="w-fit items-center"
                  onClick={() => handleSolve(selectedTicket, "helpdesk")}
                >
                  Help Desk
                </Button>

                <Button
                  variant="outline"
                  onClick={() => handleSolve(selectedTicket, "billing")}
                >
                  Billing
                </Button>
              </div>

              <Button size="xs"
                variant="outline"
                className="text-muted-foreground"
                onClick={() => setSelectedTicket(null)}>
                Cancel
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {state.activeAiTrap &&
        (variant === "B" ? (
          <VariantBModal
            key={state.activeAiTrap.id}
            payload={state.activeAiTrap}
            onAccept={() => handleResolveAi("accepted")}
            onReject={() => handleResolveAi("rejected")}
            onFrictionInteraction={logFrictionInteraction}
            onDisabledClick={logDisabledButtonClick}
          />
        ) : (
          <VariantAModal
            key={state.activeAiTrap.id}
            payload={state.activeAiTrap}
            onAccept={() => handleResolveAi("accepted")}
            onReject={() => handleResolveAi("rejected")}
          />
        ))}

      {state.isTestCompleted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/75 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md shadow-2xl border">
            <CardHeader className="text-center space-y-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 text-green-600">
                <CheckCircle2Icon className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl">Test Completed</CardTitle>
              <CardDescription>
                Thank you for participating. All tasks and AI review prompts
                have been completed. Please notify the researcher and export your
                session results.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center gap-2 border-t pt-4">
              <Button onClick={exportToCsv} className="gap-2">
                <DownloadIcon className="w-4 h-4" />
                Download CSV
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}

export default App