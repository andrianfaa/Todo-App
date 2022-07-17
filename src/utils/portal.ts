import type { ReactNode } from "react";
import { createPortal } from "react-dom";

interface PortalProps {
  children: ReactNode;
}

const Portal = ({ children }: PortalProps) => {
  const portalContainer = document.getElementById("portal") as HTMLElement;

  return createPortal(children, portalContainer);
};

export default Portal;
