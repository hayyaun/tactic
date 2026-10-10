import { RouteMessage } from "./components/route-message";

export default function NotFound() {
  return (
    <RouteMessage title="This page isn’t here.">
      <p>The link may have changed, or the page hasn’t been published yet.</p>
    </RouteMessage>
  );
}
