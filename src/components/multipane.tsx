import classes from "./multipane.module.css";

export default function Multipane({ children }: { children: React.ReactNode }) {
  return <div className={classes.panes}>{children}</div>;
}
