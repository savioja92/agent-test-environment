import {
  Card,
  CardContent,
  CardDescription,
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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./components/ui/drawer"
import { useTestEngine } from "./useTestEngine"

function App() {
  const { state, solveTicket } = useTestEngine()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-3">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Vastaanotetut</CardTitle>
          <CardDescription>Helpdesk-pyynnöt</CardDescription>
        </CardHeader>
        <CardContent>
          Saapuneet helpdesk-pyynnöt listattuna alapuolella saapumisjärjestyksessä.
        </CardContent>
      </Card>

      {state.visibleTickets.map((ticket) => (
        <Item key={ticket.id} variant="outline" className="w-full max-w-md">
          <ItemContent>
            <ItemTitle>Request</ItemTitle>
            <ItemDescription>{ticket.title}</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline">Open</Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>{ticket.title}</DrawerTitle>
                  <DrawerDescription>{ticket.description}</DrawerDescription>
                </DrawerHeader>
                <DrawerFooter className="items-center">
                  <div className="flex gap-2">
                    <DrawerClose asChild>
                      <Button
                        variant="outline"
                        className="w-fit items-center"
                        onClick={() => solveTicket(ticket.id)}
                      >
                        HelpDesk
                      </Button>
                    </DrawerClose>

                    <DrawerClose asChild>
                      <Button
                        variant="outline"
                        onClick={() => solveTicket(ticket.id)}
                      >
                        Laskutus
                      </Button>
                    </DrawerClose>
                  </div>

                  <DrawerClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </ItemActions>
        </Item>
      ))}
    </div>
  )
}

export default App