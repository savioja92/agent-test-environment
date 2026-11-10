import { useState } from "react"
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
import { ArrowUpIcon } from "lucide-react"
import { Button } from "./components/ui/button"
import { useTestEngine } from "./useTestEngine"
import type { Ticket, TicketCategory } from "./types"

function App() {
  const { state, solveTicket, startTest } = useTestEngine()
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)

  const handleSolve = (ticketId: string, category: TicketCategory) => {
  solveTicket(ticketId, category)
  setSelectedTicket(null)
}

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-3">
      <div className="flex items-start gap-3">
        <Button variant="outline" size="lg" 
        onClick={startTest}>
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

      {state.visibleTickets.map((ticket) => (
        <Item key={ticket.id} variant="outline" className="w-full max-w-md">
          <ItemContent>
            <ItemTitle>Request</ItemTitle>
            <ItemDescription>{ticket.ticketNr}</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant="outline" onClick={() => setSelectedTicket(ticket)}>
              Open
            </Button>
          </ItemActions>
        </Item>
      ))}

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
                  onClick={() => handleSolve(selectedTicket.id, 'helpdesk')}
                >
                  Help Desk
                </Button>

                <Button
                  variant="outline"
                  onClick={() => handleSolve(selectedTicket.id, 'billing')}
                >
                  Billing
                </Button>
              </div>

              <Button size="xs" variant="outline" onClick={() => setSelectedTicket(null)}>
                Cancel
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}

export default App