import { Notyf } from "notyf";

const notyf = new Notyf({
  position: {
    x: "right",
    y: "top",
  },
  duration: 5000,
  ripple: true,
  dismissible: true,
});

export default notyf;
