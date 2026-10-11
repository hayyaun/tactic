import { ContactDialog } from "./dialogs/contact-dialog";
import { StudyDialog } from "./dialogs/study-dialog";

export function Dialogs({
  deliveryEnabled = false,
}: {
  deliveryEnabled?: boolean;
}) {
  return (
    <>
      <ContactDialog deliveryEnabled={deliveryEnabled} />
      <StudyDialog />
    </>
  );
}
