import { ContactDialog } from "./dialogs/contact-dialog";

export function Dialogs({
  deliveryEnabled = false,
}: {
  deliveryEnabled?: boolean;
}) {
  return <ContactDialog deliveryEnabled={deliveryEnabled} />;
}
