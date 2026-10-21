import Logo from "./Logo";
import ModeToggle from "./ModeToggle";

/** Logo (top-left) and Night/Day pill (top-right), shared by every page. */
export default function SiteChrome() {
  return (
    <>
      <Logo />
      <ModeToggle />
    </>
  );
}
