import styled from "@emotion/styled";
import { color } from "../App.styles";

export const TopBar = styled.div`
  margin-bottom: 1rem;
`;

interface NavItemProps {
  selected: boolean;
  disabled: boolean;
}
export const NavItem = styled.button<NavItemProps>`
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  margin: 0.5rem;
  border: 0;

  transition: all 150ms;

  background-color: ${(props) =>
    chooseColor(props, color.light, "SteelBlue", "gray")};
  color: ${(props) => chooseColor(props, color.dark, color.light)};

  :hover {
    background-color: ${(props) =>
      chooseColor(props, "PowderBlue", "SteelBlue", "gray")};
    color: ${(props) => chooseColor(props, color.dark, color.light)};
    cursor: ${(props) => (props.disabled ? "default" : "pointer")};
  }

  :active {
    background-color: ${(props) =>
      chooseColor(props, "SteelBlue", "SteelBlue", "gray")};
    color: ${(props) => chooseColor(props, color.dark, color.light)};
    cursor: ${(props) => (props.disabled ? "default" : "pointer")};
  }
`;

function chooseColor(
  props: any,
  fallback: string,
  selected: string = fallback,
  disabled: string = fallback
) {
  if (props.selected) return selected;
  if (props.disabled) return disabled;
  return fallback;
}
