import { Button, Drawer, Typography, type useOverlayState } from "@heroui/react";

interface FilterDrawerProps {
  state: ReturnType<typeof useOverlayState>;
}

/** Filter entry point. The options are being rebuilt — the tab stays, the controls don't. */
export default function FilterDrawer({ state }: FilterDrawerProps) {
  return (
    <Drawer state={state}>
      <Drawer.Backdrop>
        <Drawer.Content placement="left" className="w-full max-w-[384px]">
          <Drawer.Dialog>
            <Drawer.Header>
              <Drawer.Heading>Filters</Drawer.Heading>
              <Drawer.CloseTrigger />
            </Drawer.Header>

            <Drawer.Body>
              <div className="flex flex-col gap-2 rounded-[var(--radius)] border border-dashed p-4">
                <Typography weight="semibold">Filters are being remade</Typography>
                <Typography color="muted" className="text-sm">
                  Every filter option has been cleared out while the new filter set is designed.
                </Typography>
              </div>
            </Drawer.Body>

            <Drawer.Footer className="flex justify-end">
              <Button variant="outline" slot="close">
                Close
              </Button>
            </Drawer.Footer>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
}
