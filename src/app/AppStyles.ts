import { Theme } from "@emotion/react";
import styled from "@emotion/styled";

export const theme: Theme = {
  color: {
    dark: "hsl(0, 10%, 10%)",
    light: "white",
  },
};

export const Page = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: ${(p) => p.theme.color.dark};
  color: ${(p) => p.theme.color.light};
  padding: 1rem;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 2rem;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

export const sizes = {
  sm: "1rem",
  md: "1.5rem",
  lg: "2rem",
} as const;

export const color = {
  dark: "hsl(0, 10%, 10%)",
  light: "white",
} as const;

export const Card = styled.div`
  display: flex;
  border-bottom: 1px solid ${color.light};
  margin: 1rem 0;
  :hover {
    cursor: pointer;
  }
`;

export const Part = styled.div`
  margin: 0.5rem 1rem;
`;

export const Check = styled.div`
  flex: 0 0 0;
  margin: 0.5rem 1rem;
  display: flex;
  align-items: center;
`;

export const TextPart = styled.div`
  flex: 1;
`;

export const TodoHeading = styled.h2`
  font-size: ${sizes.md};
  margin-bottom: 0.5rem;
`;

export const Description = styled.p`
  font-size: ${sizes.sm};
`;

export const Heading = styled.h2`
  font-size: ${sizes.lg};
  margin-bottom: ${sizes.sm};
`;

export const Button = styled.button`
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  margin: 0.5rem;
  background-color: ${(props) => (props.disabled ? "gray" : color.light)};
  color: ${color.dark};
  border: 0;

  transition: all 150ms;

  :hover {
    background-color: ${(props) => (props.disabled ? "gray" : "PowderBlue")};
    color: ${color.dark};

    cursor: pointer;
  }
  :active {
    background-color: ${(props) => (props.disabled ? "gray" : "SteelBlue")};
    color: ${color.dark};

    cursor: pointer;
  }
`;

export const Input = styled.input`
  padding: 0.5rem 1rem;
  margin: 0.5rem;
  border-radius: 0.5rem;
  border: 0;
  :focus {
    border: 0;
  }
  [type="checkbox"]:hover {
    cursor: pointer;
  }
`;
